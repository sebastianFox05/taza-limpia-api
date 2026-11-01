import createDebug from 'debug';
import mongoose from 'mongoose';

import { MONGODB_URI } from './env.js';

const debug = createDebug('taza:database');

let connectionPromise = null;

// En Vercel cada funcion puede reutilizarse, asi que guardo la conexion
export const connectDatabase = () => {
  if (!connectionPromise) {
    debug('abriendo conexion');
    connectionPromise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};
