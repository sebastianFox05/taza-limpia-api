import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { CLIENT_URLS, IS_PRODUCTION } from './config/env.js';
import router from './routes/index.js';
import { logger } from './utils/logger.js';

const app = express();

// Vercel va detras de un proxy y sin esto el rate limit ve siempre la misma IP
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: CLIENT_URLS }));
app.use(
  morgan(IS_PRODUCTION ? 'combined' : 'dev', {
    stream: { write: (line) => logger.http(line.trim()) },
  }),
);
app.use(router);

export default app;
