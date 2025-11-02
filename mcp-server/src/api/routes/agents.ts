import { Router } from 'express';
import * as agentController from '../controllers/agents';

const router = Router();

router.get('/', agentController.getAgents);
router.get('/:id', agentController.getAgentById);
router.post('/', agentController.createAgent);
router.put('/:id/status', agentController.updateAgentStatus);

export default router;
