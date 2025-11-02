import Redis from 'ioredis';
import logger from './logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

export default redis;
