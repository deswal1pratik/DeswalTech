import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

export const gracefulShutdown = () => {
  // This needs to be adapted to the new structure
  // logger.info('Starting graceful shutdown...');
  // process.exit(0);
};
