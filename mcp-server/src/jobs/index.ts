import cron from 'node-cron';
import logger from '../config/logger';
import taskQueue from '../config/queue';
import DataStore from '../core/services/DataStore';
import redis from '../config/redis';
import pgPool from '../config/postgres';
import mongoose from 'mongoose';

export const setupCronJobs = () => {
  // Health check every minute
  cron.schedule('* * * * *', () => {
    performHealthCheck();
  });

  // Cleanup old data every hour
  cron.schedule('0 * * * *', () => {
    cleanupOldData();
  });

  // Performance monitoring every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    monitorPerformance();
  });

  // Context synchronization every 2 minutes
  cron.schedule('*/2 * * * *', () => {
    synchronizeContext();
  });
};

export const setupQueueProcessing = () => {
  taskQueue.process('agent-task', async (job) => {
    const { taskId, agentId, action } = job.data;
    logger.info(`Processing task ${taskId} for agent ${agentId}: ${action}`);
    
    try {
      switch (action) {
        case 'assign':
          await assignTaskToAgent(taskId, agentId);
          break;
        case 'update':
          await updateTaskStatus(taskId, job.data.status);
          break;
        case 'complete':
          await completeTask(taskId, job.data.result);
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
};

const performHealthCheck = async () => {
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
};

const cleanupOldData = async () => {
  try {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    // Cleanup old context syncs
    for (const [id, sync] of DataStore.contextSyncs) {
      if (sync.timestamp < cutoffDate) {
        DataStore.contextSyncs.delete(id);
      }
    }
    
    // Cleanup old completed tasks
    for (const [id, task] of DataStore.tasks) {
      if (task.status === 'completed' && task.completedDate && task.completedDate < cutoffDate) {
        DataStore.tasks.delete(id);
      }
    }
    
    logger.info('Data cleanup completed');
  } catch (error) {
    logger.error('Error during cleanup:', error);
  }
};

const monitorPerformance = async () => {
  try {
    const stats = {
      agents: DataStore.agents.size,
      projects: DataStore.projects.size,
      tasks: DataStore.tasks.size,
      handoffs: DataStore.handoffs.size,
      contextSyncs: DataStore.contextSyncs.size,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    logger.info('Performance stats:', stats);
    
    // Store in Redis for monitoring
    await redis.setex('mcp-server-stats', 300, JSON.stringify(stats));
  } catch (error) {
    logger.error('Error monitoring performance:', error);
  }
};

const synchronizeContext = async () => {
  try {
    // Synchronize context between agents
    for (const [projectId, project] of DataStore.projects) {
      if (project.status === 'development') {
        // Emit context sync event
        // this.io.to(`project-${projectId}`).emit('context-sync-required', {
        //   projectId,
        //   timestamp: new Date().toISOString()
        // });
      }
    }
  } catch (error) {
    logger.error('Error synchronizing context:', error);
  }
};

const assignTaskToAgent = async (taskId: string, agentId: string) => {
  const task = DataStore.tasks.get(taskId);
  const agent = DataStore.agents.get(agentId);
  
  if (task && agent) {
    task.agentId = agentId;
    task.status = 'in_progress';
    DataStore.tasks.set(taskId, task);
    
    agent.currentTask = task.title;
    agent.status = 'busy';
    DataStore.agents.set(agentId, agent);
    
    DataStore.emit('taskAssigned', { task, agent });
  }
};

const updateTaskStatus = async (taskId: string, status: string) => {
  const task = DataStore.tasks.get(taskId);
  if (task) {
    task.status = status as any;
    DataStore.tasks.set(taskId, task);
    DataStore.emit('taskStatusUpdated', task);
  }
};

const completeTask = async (taskId: string, result: any) => {
  const task = DataStore.tasks.get(taskId);
  if (task) {
    task.status = 'completed';
    task.completedDate = new Date();
    task.actualHours = result.actualHours;
    DataStore.tasks.set(taskId, task);
    
    // Update agent status
    const agent = DataStore.agents.get(task.agentId);
    if (agent) {
      agent.status = 'active';
      agent.currentTask = undefined;
      agent.performance.tasksCompleted++;
      DataStore.agents.set(task.agentId, agent);
    }
    
    DataStore.emit('taskCompleted', task);
  }
};
