#!/usr/bin/env node

import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import logger from './config/logger';
import connectDB from './config/mongoose';
import { setupMiddleware } from './api/middlewares';
import { setupWebSocket, setupSocketIO } from './websocket';
import { setupCronJobs, setupQueueProcessing } from './jobs';
import { errorHandler } from './api/middlewares/errorHandler';
import apiRoutes from './api/routes';

// Load environment variables
dotenv.config();

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  const server = createServer(app);

  // Setup middleware
  setupMiddleware(app);

  // Setup routes
  app.use('/api', apiRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });

  // Setup WebSocket and Socket.IO
  setupWebSocket(server);
  setupSocketIO(server);

  // Setup cron jobs and queue processing
  setupCronJobs();
  setupQueueProcessing();

  // Setup error handling
  app.use(errorHandler);

  // Start the server
  const port = process.env.PORT || '3001';
  server.listen(port, () => {
    logger.info(`DeswalTech MCP Server running on port ${port}`);
    logger.info(`WebSocket server available at ws://localhost:${port}`);
    logger.info(`Socket.IO server available at http://localhost:${port}`);
    logger.info(`Health check available at http://localhost:${port}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
};

startServer();