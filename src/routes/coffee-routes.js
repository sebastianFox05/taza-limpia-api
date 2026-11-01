import { Router } from 'express';

import {
  createCoffee,
  deleteCoffee,
  getCoffeeById,
  getCoffees,
  updateCoffee,
} from '../controllers/coffee-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';

const router = Router();

// Leer es publico, para cambiar algo hay que entrar
router.get('/', getCoffees);
router.get('/:id', getCoffeeById);
router.post('/', requireAuth, createCoffee);
router.put('/:id', requireAuth, updateCoffee);
router.delete('/:id', requireAuth, deleteCoffee);

export default router;
