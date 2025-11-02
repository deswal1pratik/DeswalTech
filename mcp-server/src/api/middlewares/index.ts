import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import logger from '../../config/logger';

export const setupMiddleware = (app: express.Application) => {
  // Security middleware
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use(limiter);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, { 
      ip: req.ip, 
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    next();
  });
};
