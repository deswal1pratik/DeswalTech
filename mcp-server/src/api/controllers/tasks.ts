import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TaskAssignment } from '../../core/models/TaskAssignment';
import dataStore from '../../core/services/DataStore';

export const getTasks = (req: Request, res: Response) => {
  res.json(Array.from(dataStore.tasks.values()));
};

export const getTaskById = (req: Request, res: Response) => {
  const task = dataStore.tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};

export const createTask = (req: Request, res: Response) => {
  const taskData = req.body;
  const taskId = uuidv4();
  const task: TaskAssignment = {
    id: taskId,
    projectId: taskData.projectId,
    agentId: taskData.agentId,
    title: taskData.title,
    description: taskData.description,
    type: taskData.type,
    priority: taskData.priority,
    status: 'pending',
    estimatedHours: taskData.estimatedHours,
    dependencies: taskData.dependencies || [],
    blockers: [],
    acceptanceCriteria: taskData.acceptanceCriteria || [],
    createdDate: new Date(),
    dueDate: new Date(Date.now() + taskData.estimatedHours * 60 * 60 * 1000),
    quality: {
      codeReview: false,
      testing: false,
      documentation: false,
      performance: false,
      security: false
    },
    context: {
      requirements: [],
      design: [],
      implementation: [],
      testing: [],
      deployment: []
    }
  };
  dataStore.tasks.set(taskId, task);
  dataStore.emit('taskCreated', task);
  res.json(task);
};
