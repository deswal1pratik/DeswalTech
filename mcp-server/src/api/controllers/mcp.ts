import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AgentStatus } from '../../core/models/AgentStatus';
import { ProjectContext } from '../../core/models/ProjectContext';
import { TaskAssignment } from '../../core/models/TaskAssignment';
import { ContextSync } from '../../core/models/ContextSync';
import logger from '../../config/logger';
import dataStore from '../../core/services/DataStore';

export const listTools = (req: Request, res: Response) => {
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
};

export const callTool = (req: Request, res: Response) => {
  const { name, arguments: args } = req.body;
  
  try {
    switch (name) {
      case 'get_agent_status':
        const agent = dataStore.agents.get(args.agentId);
        res.json({ result: agent || null });
        break;
      case 'update_agent_status':
        const existingAgent = dataStore.agents.get(args.agentId);
        if (existingAgent) {
          existingAgent.status = args.status;
          existingAgent.progress = args.progress || existingAgent.progress;
          existingAgent.currentTask = args.currentTask || existingAgent.currentTask;
          existingAgent.lastSeen = new Date();
          dataStore.agents.set(args.agentId, existingAgent);
          dataStore.emit('agentStatusUpdated', existingAgent);
          res.json({ result: existingAgent });
        } else {
          res.status(404).json({ error: 'Agent not found' });
        }
        break;
      case 'get_project_context':
        const project = dataStore.projects.get(args.projectId);
        res.json({ result: project || null });
        break;
      case 'update_project_context':
        const existingProject = dataStore.projects.get(args.projectId);
        if (existingProject) {
          Object.assign(existingProject, args.context);
          dataStore.projects.set(args.projectId, existingProject);
          dataStore.emit('projectContextUpdated', existingProject);
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
        dataStore.tasks.set(taskId, task);
        dataStore.emit('taskAssigned', task);
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
        dataStore.contextSyncs.set(contextId, contextSync);
        dataStore.emit('contextSynced', contextSync);
        res.json({ result: contextSync });
        break;
      default:
        res.status(400).json({ error: 'Unknown tool' });
    }
  } catch (error) {
    logger.error('Error calling tool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listResources = (req: Request, res: Response) => {
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
};

export const readResource = (req: Request, res: Response) => {
  const { uri } = req.body;
  
  try {
    switch (uri) {
      case 'agents://all':
        res.json({ contents: Array.from(dataStore.agents.values()) });
        break;
      case 'projects://all':
        res.json({ contents: Array.from(dataStore.projects.values()) });
        break;
      case 'tasks://all':
        res.json({ contents: Array.from(dataStore.tasks.values()) });
        break;
      case 'handoffs://all':
        res.json({ contents: Array.from(dataStore.handoffs.values()) });
        break;
      case 'context-syncs://all':
        res.json({ contents: Array.from(dataStore.contextSyncs.values()) });
        break;
      default:
        res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    logger.error('Error reading resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
