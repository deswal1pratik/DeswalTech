import Queue from 'bull';
import logger from './logger';

const taskQueue = new Queue('ai agent tasks', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

taskQueue.on('error', (error) => {
  logger.error('Bull queue error:', error);
});

export default taskQueue;
