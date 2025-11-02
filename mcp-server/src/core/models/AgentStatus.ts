export interface AgentStatus {
  id: string;
  name: string;
  type: 'orchestrator' | 'backend' | 'frontend' | 'mobile' | 'devops' | 'qa' | 'security' | 'business';
  status: 'active' | 'idle' | 'busy' | 'error' | 'offline';
  currentTask?: string;
  progress: number;
  lastSeen: Date;
  capabilities: string[];
  performance: {
    tasksCompleted: number;
    averageTaskTime: number;
    successRate: number;
    qualityScore: number;
  };
  context: {
    currentProject?: string;
    currentSprint?: string;
    currentPhase?: string;
    dependencies?: string[];
    blockers?: string[];
  };
}
