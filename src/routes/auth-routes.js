import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { getCurrentUser, login } from '../controllers/auth-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: 'Demasiados intentos, espera unos minutos' },
});

router.post('/login', loginLimiter, login);
router.get('/me', requireAuth, getCurrentUser);

export default router;
