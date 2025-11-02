import { Pool } from 'pg';
import logger from './logger';

const pgPool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'deswaltech_orchestration',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on('error', (err, client) => {
  logger.error('PostgreSQL error:', err);
});

export default pgPool;
