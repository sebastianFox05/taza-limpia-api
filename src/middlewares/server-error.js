import { logger } from '../utils/logger.js';

// Express reconoce este middleware por tener cuatro parametros, next no se puede quitar
// eslint-disable-next-line no-unused-vars
export const serverError = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    const [firstError] = Object.values(error.errors);
    return res.status(400).json({ message: firstError.message });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: `El valor de ${error.path} no es válido` });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El JSON enviado no es válido' });
  }

  logger.error(error.stack ?? error.message);
  return res.status(500).json({ message: 'Algo ha fallado en el servidor' });
};
