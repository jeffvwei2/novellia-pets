import { Router } from 'express';
import { getAnalytics } from './services.js';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const analytics = await getAnalytics();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
});

export default router;

