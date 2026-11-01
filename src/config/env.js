import 'dotenv/config';

const REQUIRED_VARIABLES = ['MONGODB_URI', 'JWT_SECRET'];

// Mejor fallar al arrancar que descubrirlo en el primer login
REQUIRED_VARIABLES.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
});

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const PORT = Number(process.env.PORT) || 4000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
export const SEED_PASSWORD = process.env.SEED_PASSWORD;
export const CLIENT_URLS = (process.env.CLIENT_URLS || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim());
