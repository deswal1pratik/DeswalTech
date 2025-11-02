import { EventEmitter } from 'events';
import { AgentStatus } from '../models/AgentStatus';
import { ProjectContext } from '../models/ProjectContext';
import { TaskAssignment } from '../models/TaskAssignment';
import { SprintHandoff } from '../models/SprintHandoff';
import { ContextSync } from '../models/ContextSync';

class DataStore extends EventEmitter {
  private static instance: DataStore;
  public agents: Map<string, AgentStatus> = new Map();
  public projects: Map<string, ProjectContext> = new Map();
  public tasks: Map<string, TaskAssignment> = new Map();
  public handoffs: Map<string, SprintHandoff> = new Map();
  public contextSyncs: Map<string, ContextSync> = new Map();

  private constructor() {
    super();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }
}

export default DataStore.getInstance();
