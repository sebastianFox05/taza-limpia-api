import app from './app.js';
import { PORT } from './config/env.js';
import { logger } from './utils/logger.js';

app.listen(PORT, () => {
  logger.info(`API escuchando en el puerto ${PORT}`);
});
