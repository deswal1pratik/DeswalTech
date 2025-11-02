import { Router } from 'express';
import agentRoutes from './agents';
import projectRoutes from './projects';
import taskRoutes from './tasks';
import handoffRoutes from './handoffs';
import contextSyncRoutes from './contextSyncs';
import mcpRoutes from './mcp';

const router = Router();

router.use('/agents', agentRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/handoffs', handoffRoutes);
router.use('/context-syncs', contextSyncRoutes);
router.use('/mcp', mcpRoutes);

export default router;
