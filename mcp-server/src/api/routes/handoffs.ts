import { Router } from 'express';
import * as handoffController from '../controllers/handoffs';

const router = Router();

router.get('/', handoffController.getHandoffs);
router.post('/', handoffController.createHandoff);

export default router;
