import { WebSocketServer, WebSocket } from 'ws';
import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger';
import DataStore from '../core/services/DataStore';
import http from 'http';

export const setupWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    const clientId = uuidv4();
    logger.info(`WebSocket client connected: ${clientId}`);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        handleWebSocketMessage(clientId, message, ws);
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

    ws.send(JSON.stringify({
      type: 'welcome',
      clientId,
      timestamp: new Date().toISOString(),
      message: 'Connected to DeswalTech MCP Server'
    }));
  });
};

const handleWebSocketMessage = (clientId: string, message: any, ws: WebSocket) => {
  switch (message.type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
      break;
    case 'get-agents':
      ws.send(JSON.stringify({ type: 'agents', data: Array.from(DataStore.agents.values()) }));
      break;
    case 'get-projects':
      ws.send(JSON.stringify({ type: 'projects', data: Array.from(DataStore.projects.values()) }));
      break;
    case 'get-tasks':
      ws.send(JSON.stringify({ type: 'tasks', data: Array.from(DataStore.tasks.values()) }));
      break;
    default:
      ws.send(JSON.stringify({ error: 'Unknown message type' }));
  }
};

export const setupSocketIO = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
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
      io.to(`project-${data.projectId}`).emit('agent-status-updated', data);
    });

    socket.on('context-sync', (data) => {
      io.to(`project-${data.projectId}`).emit('context-synced', data);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket.IO client disconnected: ${socket.id}`);
    });
  });
};
