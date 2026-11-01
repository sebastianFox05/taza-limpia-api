import { Router } from 'express';

import { getActivity, getStats } from '../controllers/stats-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';

const router = Router();

router.get('/', getStats);
router.get('/activity', requireAuth, getActivity);

export default router;
