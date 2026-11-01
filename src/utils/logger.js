import winston from 'winston';

import { IS_PRODUCTION } from '../config/env.js';

export const logger = winston.createLogger({
  level: IS_PRODUCTION ? 'info' : 'http',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
  transports: [new winston.transports.Console()],
});
