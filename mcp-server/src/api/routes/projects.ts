import { Router } from 'express';
import * as projectController from '../controllers/projects';

const router = Router();

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);

export default router;
