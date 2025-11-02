import { Router } from 'express';
import * as mcpController from '../controllers/mcp';

const router = Router();

router.post('/list-tools', mcpController.listTools);
router.post('/call-tool', mcpController.callTool);
router.post('/list-resources', mcpController.listResources);
router.post('/read-resource', mcpController.readResource);

export default router;
