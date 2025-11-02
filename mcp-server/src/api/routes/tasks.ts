import { Router } from 'express';
import * as taskController from '../controllers/tasks';

const router = Router();

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);

export default router;
