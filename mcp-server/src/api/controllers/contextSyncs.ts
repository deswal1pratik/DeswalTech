import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ContextSync } from '../../core/models/ContextSync';
import dataStore from '../../core/services/DataStore';

export const getContextSyncs = (req: Request, res: Response) => {
  res.json(Array.from(dataStore.contextSyncs.values()));
};

export const createContextSync = (req: Request, res: Response) => {
  const contextData = req.body;
  const contextId = uuidv4();
  const contextSync: ContextSync = {
    id: contextId,
    projectId: contextData.projectId,
    agentId: contextData.agentId,
    timestamp: new Date(),
    context: contextData.context,
    shared: contextData.shared,
    quality: contextData.quality
  };
  dataStore.contextSyncs.set(contextId, contextSync);
  dataStore.emit('contextSynced', contextSync);
  res.json(contextSync);
};
