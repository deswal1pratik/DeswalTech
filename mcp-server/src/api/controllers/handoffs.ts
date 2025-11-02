import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SprintHandoff } from '../../core/models/SprintHandoff';
import dataStore from '../../core/services/DataStore';

export const getHandoffs = (req: Request, res: Response) => {
  res.json(Array.from(dataStore.handoffs.values()));
};

export const createHandoff = (req: Request, res: Response) => {
  const handoffData = req.body;
  const handoffId = uuidv4();
  const handoff: SprintHandoff = {
    id: handoffId,
    projectId: handoffData.projectId,
    fromSprint: handoffData.fromSprint,
    toSprint: handoffData.toSprint,
    handoffDate: new Date(),
    status: 'pending',
    deliverables: {
      completed: [],
      inProgress: [],
      blocked: [],
      next: []
    },
    context: {
      progress: 0,
      blockers: [],
      dependencies: [],
      risks: [],
      lessons: []
    },
    quality: {
      codeReview: false,
      testing: false,
      documentation: false,
      performance: false,
      security: false
    },
    approval: {
      technical: false,
      business: false,
      stakeholder: false
    }
  };
  dataStore.handoffs.set(handoffId, handoff);
  dataStore.emit('handoffCreated', handoff);
  res.json(handoff);
};
