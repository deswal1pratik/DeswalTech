#!/usr/bin/env node

import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import Redis from 'ioredis';
import { Pool } from 'pg';
import mongoose from 'mongoose';
import Queue from 'bull';
import Joi from 'joi';
import axios from 'axios';
import { EventEmitter } from 'events';

// Load environment variables
dotenv.config();

// Enhanced logging configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'universal-ai-mcp-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Redis configuration for caching and session management
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// PostgreSQL configuration for persistent storage
const pgPool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'universal_ai_orchestration',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// MongoDB configuration for document storage
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/universal_ai_orchestration');

// Queue configuration for background tasks
const taskQueue = new Queue('ai agent tasks', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

// Enhanced data models and interfaces
interface AgentStatus {
  id: string;
  name: string;
  type: 'orchestrator' | 'backend' | 'frontend' | 'mobile' | 'devops' | 'qa' | 'security' | 'business';
  status: 'active' | 'idle' | 'busy' | 'error' | 'offline';
  currentTask?: string;
  progress: number;
  lastSeen: Date;
  capabilities: string[];
  performance: {
    tasksCompleted: number;
    averageTaskTime: number;
    successRate: number;
    qualityScore: number;
  };
  context: {
    currentProject?: string;
    currentSprint?: string;
    currentPhase?: string;
    dependencies?: string[];
    blockers?: string[];
  };
}

interface ProjectContext {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'deployment' | 'completed' | 'paused';
  phase: 'requirements' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';
  sprint: {
    current: number;
    total: number;
    startDate: Date;
    endDate: Date;
    goals: string[];
    progress: number;
  };
  team: {
    orchestrator: string;
    backend: string;
    frontend: string;
    mobile: string;
    devops: string;
    qa: string;
    security: string;
    business: string;
  };
  requirements: {
    functional: string[];
    nonFunctional: string[];
    technical: string[];
    business: string[];
  };
  architecture: {
    backend: string;
    frontend: string;
    mobile: string;
    database: string;
    infrastructure: string;
  };
  progress: {
    overall: number;
    backend: number;
    frontend: number;
    mobile: number;
    testing: number;
    deployment: number;
  };
  quality: {
    codeQuality: number;
    testCoverage: number;
    performance: number;
    security: number;
    usability: number;
  };
  risks: {
    technical: string[];
    business: string[];
    timeline: string[];
    resource: string[];
  };
  metrics: {
    velocity: number;
    burndown: number;
    quality: number;
    satisfaction: number;
  };
}

interface TaskAssignment {
  id: string;
  projectId: string;
  agentId: string;
  title: string;
  description: string;
  type: 'development' | 'testing' | 'deployment' | 'analysis' | 'coordination';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  blockers: string[];
  acceptanceCriteria: string[];
  createdDate: Date;
  dueDate: Date;
  completedDate?: Date;
  quality: {
    codeReview: boolean;
    testing: boolean;
    documentation: boolean;
    performance: boolean;
    security: boolean;
  };
  context: {
    requirements: string[];
    design: string[];
    implementation: string[];
    testing: string[];
    deployment: string[];
  };
}

interface SprintHandoff {
  id: string;
  projectId: string;
  fromSprint: number;
  toSprint: number;
  handoffDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  deliverables: {
    completed: string[];
    inProgress: string[];
    blocked: string[];
    next: string[];
  };
  context: {
    progress: number;
    blockers: string[];
    dependencies: string[];
    risks: string[];
    lessons: string[];
  };
  quality: {
    codeReview: boolean;
    testing: boolean;
    documentation: boolean;
    performance: boolean;
    security: boolean;
  };
  approval: {
    technical: boolean;
    business: boolean;
    stakeholder: boolean;
  };
}

interface ContextSync {
  id: string;
  projectId: string;
  agentId: string;
  timestamp: Date;
  context: {
    currentTask: string;
    progress: number;
    blockers: string[];
    dependencies: string[];
    decisions: string[];
    learnings: string[];
  };
  shared: {
    requirements: string[];
    design: string[];
    implementation: string[];
    testing: string[];
    deployment: string[];
  };
  quality: {
    codeQuality: number;
    testCoverage: number;
    performance: number;
    security: number;
    documentation: number;
  };
}

// Enhanced MCP Server class
class UniversalAIMCPServer extends EventEmitter {
  private app: express.Application;
  private server: any;
  private wss: WebSocketServer;
  private io: SocketIOServer;
  private agents: Map<string, AgentStatus> = new Map();
  private projects: Map<string, ProjectContext> = new Map();
  private tasks: Map<string, TaskAssignment> = new Map();
  private handoffs: Map<string, SprintHandoff> = new Map();
  private contextSyncs: Map<string, ContextSync> = new Map();
  private isShuttingDown = false;

  constructor() {
    super();
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupSocketIO();
    this.setupCronJobs();
    this.setupQueueProcessing();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, { 
        ip: req.ip, 
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        agents: this.agents.size,
        projects: this.projects.size,
        tasks: this.tasks.size
      });
    });

    // Agent management endpoints
    this.app.get('/api/agents', (req, res) => {
      res.json(Array.from(this.agents.values()));
    });

    this.app.get('/api/agents/:id', (req, res) => {
      const agent = this.agents.get(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json(agent);
    });

    this.app.post('/api/agents', (req, res) => {
      const agentData = req.body;
      const agentId = uuidv4();
      const agent: AgentStatus = {
        id: agentId,
        name: agentData.name,
        type: agentData.type,
        status: 'active',
        progress: 0,
        lastSeen: new Date(),
        capabilities: agentData.capabilities || [],
        performance: {
          tasksCompleted: 0,
          averageTaskTime: 0,
          successRate: 100,
          qualityScore: 100
        },
        context: {}
      };
      this.agents.set(agentId, agent);
      this.emit('agentRegistered', agent);
      res.json(agent);
    });

    this.app.put('/api/agents/:id/status', (req, res) => {
      const agent = this.agents.get(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      agent.status = req.body.status;
      agent.lastSeen = new Date();
      this.agents.set(req.params.id, agent);
      this.emit('agentStatusUpdated', agent);
      res.json(agent);
    });

    // Project management endpoints
    this.app.get('/api/projects', (req, res) => {
      res.json(Array.from(this.projects.values()));
    });

    this.app.get('/api/projects/:id', (req, res) => {
      const project = this.projects.get(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    });

    this.app.post('/api/projects', (req, res) => {
      const projectData = req.body;
      const projectId = uuidv4();
      const project: ProjectContext = {
        id: projectId,
        name: projectData.name,
        description: projectData.description,
        status: 'planning',
        phase: 'requirements',
        sprint: {
          current: 1,
          total: projectData.totalSprints || 4,
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
          goals: projectData.goals || [],
          progress: 0
        },
        team: projectData.team || {},
        requirements: projectData.requirements || { functional: [], nonFunctional: [], technical: [], business: [] },
        architecture: projectData.architecture || { backend: '', frontend: '', mobile: '', database: '', infrastructure: '' },
        progress: { overall: 0, backend: 0, frontend: 0, mobile: 0, testing: 0, deployment: 0 },
        quality: { codeQuality: 0, testCoverage: 0, performance: 0, security: 0, usability: 0 },
        risks: { technical: [], business: [], timeline: [], resource: [] },
        metrics: { velocity: 0, burndown: 0, quality: 0, satisfaction: 0 }
      };
      this.projects.set(projectId, project);
      this.emit('projectCreated', project);
      res.json(project);
    });

    // Task management endpoints
    this.app.get('/api/tasks', (req, res) => {
      res.json(Array.from(this.tasks.values()));
    });

    this.app.get('/api/tasks/:id', (req, res) => {
      const task = this.tasks.get(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    });

    this.app.post('/api/tasks', (req, res) => {
      const taskData = req.body;
      const taskId = uuidv4();
      const task: TaskAssignment = {
        id: taskId,
        projectId: taskData.projectId,
        agentId: taskData.agentId,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        priority: taskData.priority,
        status: 'pending',
        estimatedHours: taskData.estimatedHours,
        dependencies: taskData.dependencies || [],
        blockers: [],
        acceptanceCriteria: taskData.acceptanceCriteria || [],
        createdDate: new Date(),
        dueDate: new Date(Date.now() + taskData.estimatedHours * 60 * 60 * 1000),
        quality: {
          codeReview: false,
          testing: false,
          documentation: false,
          performance: false,
          security: false
        },
        context: {
          requirements: [],
          design: [],
          implementation: [],
          testing: [],
          deployment: []
        }
      };
      this.tasks.set(taskId, task);
      this.emit('taskCreated', task);
      res.json(task);
    });

    // Sprint handoff endpoints
    this.app.get('/api/handoffs', (req, res) => {
      res.json(Array.from(this.handoffs.values()));
    });

    this.app.post('/api/handoffs', (req, res) => {
      const handoffData = req.body;
      const handoffId = uuidv4();
      const handoff: SprintHandoff = {
        id: handoffId,
        projectId: handoffData.projectId,
        fromSprint: handoffData.fromSprint,
        toSprint: handoffData.toSprint,
        handoffDate: new Date(),
        status: 'pending',
        deliverables: {
          completed: [],
          inProgress: [],
          blocked: [],
          next: []
        },
        context: {
          progress: 0,
          blockers: [],
          dependencies: [],
          risks: [],
          lessons: []
        },
        quality: {
          codeReview: false,
          testing: false,
          documentation: false,
          performance: false,
          security: false
        },
        approval: {
          technical: false,
          business: false,
          stakeholder: false
        }
      };
      this.handoffs.set(handoffId, handoff);
      this.emit('handoffCreated', handoff);
      res.json(handoff);
    });

    // Context synchronization endpoints
    this.app.get('/api/context-syncs', (req, res) => {
      res.json(Array.from(this.contextSyncs.values()));
    });

    this.app.post('/api/context-syncs', (req, res) => {
      const contextData = req.body;
      const contextId = uuidv4();
      const contextSync: ContextSync = {
        id: contextId,
        projectId: contextData.projectId,
        agentId: contextData.agentId,
        timestamp: new Date(),
        context: contextData.context,
        shared: contextData.shared,
        quality: contextData.quality
      };
      this.contextSyncs.set(contextId, contextSync);
      this.emit('contextSynced', contextSync);
      res.json(contextSync);
    });

    // MCP protocol endpoints
    this.app.post('/mcp/list-tools', (req, res) => {
      res.json({
        tools: [
          {
            name: 'get_agent_status',
            description: 'Get current status of an AI agent',
            inputSchema: {
              type: 'object',
              properties: {
                agentId: { type: 'string' }
              },
              required: ['agentId']
            }
          },
          {
            name: 'update_agent_status',
            description: 'Update status of an AI agent',
            inputSchema: {
              type: 'object',
              properties: {
                agentId: { type: 'string' },
                status: { type: 'string' },
                progress: { type: 'number' },
                currentTask: { type: 'string' }
              },
              required: ['agentId', 'status']
            }
          },
          {
            name: 'get_project_context',
            description: 'Get current project context',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string' }
              },
              required: ['projectId']
            }
          },
          {
            name: 'update_project_context',
            description: 'Update project context',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string' },
                context: { type: 'object' }
              },
              required: ['projectId', 'context']
            }
          },
          {
            name: 'assign_task',
            description: 'Assign a task to an agent',
            inputSchema: {
              type: 'object',
              properties: {
                agentId: { type: 'string' },
                task: { type: 'object' }
              },
              required: ['agentId', 'task']
            }
          },
          {
            name: 'sync_context',
            description: 'Synchronize context between agents',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string' },
                agentId: { type: 'string' },
                context: { type: 'object' }
              },
              required: ['projectId', 'agentId', 'context']
            }
          }
        ]
      });
    });

    this.app.post('/mcp/call-tool', (req, res) => {
      const { name, arguments: args } = req.body;
      
      try {
        switch (name) {
          case 'get_agent_status':
            const agent = this.agents.get(args.agentId);
            res.json({ result: agent || null });
            break;
          case 'update_agent_status':
            const existingAgent = this.agents.get(args.agentId);
            if (existingAgent) {
              existingAgent.status = args.status;
              existingAgent.progress = args.progress || existingAgent.progress;
              existingAgent.currentTask = args.currentTask || existingAgent.currentTask;
              existingAgent.lastSeen = new Date();
              this.agents.set(args.agentId, existingAgent);
              this.emit('agentStatusUpdated', existingAgent);
              res.json({ result: existingAgent });
            } else {
              res.status(404).json({ error: 'Agent not found' });
            }
            break;
          case 'get_project_context':
            const project = this.projects.get(args.projectId);
            res.json({ result: project || null });
            break;
          case 'update_project_context':
            const existingProject = this.projects.get(args.projectId);
            if (existingProject) {
              Object.assign(existingProject, args.context);
              this.projects.set(args.projectId, existingProject);
              this.emit('projectContextUpdated', existingProject);
              res.json({ result: existingProject });
            } else {
              res.status(404).json({ error: 'Project not found' });
            }
            break;
          case 'assign_task':
            const taskId = uuidv4();
            const task: TaskAssignment = {
              id: taskId,
              projectId: args.task.projectId,
              agentId: args.agentId,
              title: args.task.title,
              description: args.task.description,
              type: args.task.type,
              priority: args.task.priority,
              status: 'pending',
              estimatedHours: args.task.estimatedHours,
              dependencies: args.task.dependencies || [],
              blockers: [],
              acceptanceCriteria: args.task.acceptanceCriteria || [],
              createdDate: new Date(),
              dueDate: new Date(Date.now() + args.task.estimatedHours * 60 * 60 * 1000),
              quality: {
                codeReview: false,
                testing: false,
                documentation: false,
                performance: false,
                security: false
              },
              context: {
                requirements: [],
                design: [],
                implementation: [],
                testing: [],
                deployment: []
              }
            };
            this.tasks.set(taskId, task);
            this.emit('taskAssigned', task);
            res.json({ result: task });
            break;
          case 'sync_context':
            const contextId = uuidv4();
            const contextSync: ContextSync = {
              id: contextId,
              projectId: args.projectId,
              agentId: args.agentId,
              timestamp: new Date(),
              context: args.context,
              shared: args.context.shared || {},
              quality: args.context.quality || {}
            };
            this.contextSyncs.set(contextId, contextSync);
            this.emit('contextSynced', contextSync);
            res.json({ result: contextSync });
            break;
          default:
            res.status(400).json({ error: 'Unknown tool' });
        }
      } catch (error) {
        logger.error('Error calling tool:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    this.app.post('/mcp/list-resources', (req, res) => {
      res.json({
        resources: [
          {
            uri: 'agents://all',
            name: 'All Agents',
            description: 'List of all registered AI agents',
            mimeType: 'application/json'
          },
          {
            uri: 'projects://all',
            name: 'All Projects',
            description: 'List of all active projects',
            mimeType: 'application/json'
          },
          {
            uri: 'tasks://all',
            name: 'All Tasks',
            description: 'List of all assigned tasks',
            mimeType: 'application/json'
          },
          {
            uri: 'handoffs://all',
            name: 'All Handoffs',
            description: 'List of all sprint handoffs',
            mimeType: 'application/json'
          },
          {
            uri: 'context-syncs://all',
            name: 'All Context Syncs',
            description: 'List of all context synchronizations',
            mimeType: 'application/json'
          }
        ]
      });
    });

    this.app.post('/mcp/read-resource', (req, res) => {
      const { uri } = req.body;
      
      try {
        switch (uri) {
          case 'agents://all':
            res.json({ contents: Array.from(this.agents.values()) });
            break;
          case 'projects://all':
            res.json({ contents: Array.from(this.projects.values()) });
            break;
          case 'tasks://all':
            res.json({ contents: Array.from(this.tasks.values()) });
            break;
          case 'handoffs://all':
            res.json({ contents: Array.from(this.handoffs.values()) });
            break;
          case 'context-syncs://all':
            res.json({ contents: Array.from(this.contextSyncs.values()) });
            break;
          default:
            res.status(404).json({ error: 'Resource not found' });
        }
      } catch (error) {
        logger.error('Error reading resource:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws, req) => {
      const clientId = uuidv4();
      logger.info(`WebSocket client connected: ${clientId}`);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(clientId, message, ws);
        } catch (error) {
          logger.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        logger.info(`WebSocket client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        logger.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        clientId,
        timestamp: new Date().toISOString(),
        message: 'Connected to Universal AI Expert Orchestration MCP Server'
      }));
    });
  }

  private setupSocketIO(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Socket.IO client connected: ${socket.id}`);

      socket.on('join-project', (projectId) => {
        socket.join(`project-${projectId}`);
        logger.info(`Client ${socket.id} joined project ${projectId}`);
      });

      socket.on('leave-project', (projectId) => {
        socket.leave(`project-${projectId}`);
        logger.info(`Client ${socket.id} left project ${projectId}`);
      });

      socket.on('agent-status-update', (data) => {
        this.io.to(`project-${data.projectId}`).emit('agent-status-updated', data);
      });

      socket.on('context-sync', (data) => {
        this.io.to(`project-${data.projectId}`).emit('context-synced', data);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket.IO client disconnected: ${socket.id}`);
      });
    });
  }

  private handleWebSocketMessage(clientId: string, message: any, ws: any): void {
    switch (message.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        break;
      case 'get-agents':
        ws.send(JSON.stringify({ type: 'agents', data: Array.from(this.agents.values()) }));
        break;
      case 'get-projects':
        ws.send(JSON.stringify({ type: 'projects', data: Array.from(this.projects.values()) }));
        break;
      case 'get-tasks':
        ws.send(JSON.stringify({ type: 'tasks', data: Array.from(this.tasks.values()) }));
        break;
      default:
        ws.send(JSON.stringify({ error: 'Unknown message type' }));
    }
  }

  private setupCronJobs(): void {
    // Health check every minute
    cron.schedule('* * * * *', () => {
      this.performHealthCheck();
    });

    // Cleanup old data every hour
    cron.schedule('0 * * * *', () => {
      this.cleanupOldData();
    });

    // Performance monitoring every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      this.monitorPerformance();
    });

    // Context synchronization every 2 minutes
    cron.schedule('*/2 * * * *', () => {
      this.synchronizeContext();
    });
  }

  private setupQueueProcessing(): void {
    taskQueue.process('agent-task', async (job) => {
      const { taskId, agentId, action } = job.data;
      logger.info(`Processing task ${taskId} for agent ${agentId}: ${action}`);
      
      try {
        switch (action) {
          case 'assign':
            await this.assignTaskToAgent(taskId, agentId);
            break;
          case 'update':
            await this.updateTaskStatus(taskId, job.data.status);
            break;
          case 'complete':
            await this.completeTask(taskId, job.data.result);
            break;
          default:
            logger.warn(`Unknown task action: ${action}`);
        }
      } catch (error) {
        logger.error(`Error processing task ${taskId}:`, error);
        throw error;
      }
    });

    taskQueue.on('completed', (job) => {
      logger.info(`Task ${job.id} completed successfully`);
    });

    taskQueue.on('failed', (job, err) => {
      logger.error(`Task ${job.id} failed:`, err);
    });
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Check Redis connection
      await redis.ping();
      
      // Check PostgreSQL connection
      const client = await pgPool.connect();
      await client.query('SELECT 1');
      client.release();
      
      // Check MongoDB connection
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      }
      
      logger.info('Health check passed');
    } catch (error) {
      logger.error('Health check failed:', error);
    }
  }

  private async cleanupOldData(): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      
      // Cleanup old context syncs
      for (const [id, sync] of this.contextSyncs) {
        if (sync.timestamp < cutoffDate) {
          this.contextSyncs.delete(id);
        }
      }
      
      // Cleanup old completed tasks
      for (const [id, task] of this.tasks) {
        if (task.status === 'completed' && task.completedDate && task.completedDate < cutoffDate) {
          this.tasks.delete(id);
        }
      }
      
      logger.info('Data cleanup completed');
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }

  private async monitorPerformance(): Promise<void> {
    try {
      const stats = {
        agents: this.agents.size,
        projects: this.projects.size,
        tasks: this.tasks.size,
        handoffs: this.handoffs.size,
        contextSyncs: this.contextSyncs.size,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };
      
      logger.info('Performance stats:', stats);
      
      // Store in Redis for monitoring
      await redis.setex('mcp-server-stats', 300, JSON.stringify(stats));
    } catch (error) {
      logger.error('Error monitoring performance:', error);
    }
  }

  private async synchronizeContext(): Promise<void> {
    try {
      // Synchronize context between agents
      for (const [projectId, project] of this.projects) {
        if (project.status === 'development') {
          // Emit context sync event
          this.io.to(`project-${projectId}`).emit('context-sync-required', {
            projectId,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      logger.error('Error synchronizing context:', error);
    }
  }

  private async assignTaskToAgent(taskId: string, agentId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    const agent = this.agents.get(agentId);
    
    if (task && agent) {
      task.agentId = agentId;
      task.status = 'in_progress';
      this.tasks.set(taskId, task);
      
      agent.currentTask = task.title;
      agent.status = 'busy';
      this.agents.set(agentId, agent);
      
      this.emit('taskAssigned', { task, agent });
    }
  }

  private async updateTaskStatus(taskId: string, status: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status as any;
      this.tasks.set(taskId, task);
      this.emit('taskStatusUpdated', task);
    }
  }

  private async completeTask(taskId: string, result: any): Promise<void> {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'completed';
      task.completedDate = new Date();
      task.actualHours = result.actualHours;
      this.tasks.set(taskId, task);
      
      // Update agent status
      const agent = this.agents.get(task.agentId);
      if (agent) {
        agent.status = 'active';
        agent.currentTask = undefined;
        agent.performance.tasksCompleted++;
        this.agents.set(task.agentId, agent);
      }
      
      this.emit('taskCompleted', task);
    }
  }

  private async gracefulShutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    
    logger.info('Starting graceful shutdown...');
    
    try {
      // Close WebSocket connections
      this.wss.close();
      
      // Close Socket.IO
      this.io.close();
      
      // Close HTTP server
      this.server.close();
      
      // Close database connections
      await pgPool.end();
      await mongoose.connection.close();
      await redis.quit();
      
      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  public start(port: number = 3001): void {
    this.server.listen(port, () => {
      logger.info(`Universal AI Expert Orchestration MCP Server running on port ${port}`);
      logger.info(`WebSocket server available at ws://localhost:${port}`);
      logger.info(`Socket.IO server available at http://localhost:${port}`);
      logger.info(`Health check available at http://localhost:${port}/health`);
    });
  }
}

// Start the server
const server = new UniversalAIMCPServer();
server.start(parseInt(process.env.PORT || '3001'));

export default UniversalAIMCPServer;
