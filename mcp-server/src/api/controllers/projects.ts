import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ProjectContext } from '../../core/models/ProjectContext';
import dataStore from '../../core/services/DataStore';

export const getProjects = (req: Request, res: Response) => {
  res.json(Array.from(dataStore.projects.values()));
};

export const getProjectById = (req: Request, res: Response) => {
  const project = dataStore.projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
};

export const createProject = (req: Request, res: Response) => {
  const projectData = req.body;
  const projectId = uuidv4();
  const project: ProjectContext = {
    id: projectId,
    name: projectData.name,
    description: projectData.description,
    status: 'planning',
    phase: 'requirements',
    sprint: {
      current: 1,
      total: projectData.totalSprints || 4,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      goals: projectData.goals || [],
      progress: 0
    },
    team: projectData.team || {},
    requirements: projectData.requirements || { functional: [], nonFunctional: [], technical: [], business: [] },
    architecture: projectData.architecture || { backend: '', frontend: '', mobile: '', database: '', infrastructure: '' },
    progress: { overall: 0, backend: 0, frontend: 0, mobile: 0, testing: 0, deployment: 0 },
    quality: { codeQuality: 0, testCoverage: 0, performance: 0, security: 0, usability: 0 },
    risks: { technical: [], business: [], timeline: [], resource: [] },
    metrics: { velocity: 0, burndown: 0, quality: 0, satisfaction: 0 }
  };
  dataStore.projects.set(projectId, project);
  dataStore.emit('projectCreated', project);
  res.json(project);
};
