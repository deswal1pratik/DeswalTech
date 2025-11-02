import { Router } from 'express';
import * as contextSyncController from '../controllers/contextSyncs';

const router = Router();

router.get('/', contextSyncController.getContextSyncs);
router.post('/', contextSyncController.createContextSync);

export default router;
