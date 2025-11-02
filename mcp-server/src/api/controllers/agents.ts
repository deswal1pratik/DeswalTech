import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AgentStatus } from '../../core/models/AgentStatus';
import dataStore from '../../core/services/DataStore';

export const getAgents = (req: Request, res: Response) => {
  res.json(Array.from(dataStore.agents.values()));
};

export const getAgentById = (req: Request, res: Response) => {
  const agent = dataStore.agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
};

export const createAgent = (req: Request, res: Response) => {
  const agentData = req.body;
  const agentId = uuidv4();
  const agent: AgentStatus = {
    id: agentId,
    name: agentData.name,
    type: agentData.type,
    status: 'active',
    progress: 0,
    lastSeen: new Date(),
    capabilities: agentData.capabilities || [],
    performance: {
      tasksCompleted: 0,
      averageTaskTime: 0,
      successRate: 100,
      qualityScore: 100
    },
    context: {}
  };
  dataStore.agents.set(agentId, agent);
  dataStore.emit('agentRegistered', agent);
  res.json(agent);
};

export const updateAgentStatus = (req: Request, res: Response) => {
  const agent = dataStore.agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  agent.status = req.body.status;
  agent.lastSeen = new Date();
  dataStore.agents.set(req.params.id, agent);
  dataStore.emit('agentStatusUpdated', agent);
  res.json(agent);
};
