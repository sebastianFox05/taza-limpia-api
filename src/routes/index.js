import express, { Router } from 'express';

import { databaseReady } from '../middlewares/database-ready.js';
import { notFound } from '../middlewares/not-found.js';
import { serverError } from '../middlewares/server-error.js';
import authRoutes from './auth-routes.js';
import coffeeRoutes from './coffee-routes.js';
import statsRoutes from './stats-routes.js';

const router = Router();

// Van aqui y no en app.js para que sus errores tambien lleguen a serverError
router.use(express.json({ limit: '100kb' }));
router.use(databaseReady);

router.get('/', (req, res) => {
  res.status(200).json({ name: 'Taza Limpia API', status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/coffees', coffeeRoutes);
router.use('/stats', statsRoutes);

// Siempre al final o se comen las rutas de arriba
router.use(notFound);
router.use(serverError);

export default router;
