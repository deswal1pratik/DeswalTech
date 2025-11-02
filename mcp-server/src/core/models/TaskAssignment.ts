export interface TaskAssignment {
  id: string;
  projectId: string;
  agentId: string;
  title: string;
  description: string;
  type: 'development' | 'testing' | 'deployment' | 'analysis' | 'coordination';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  blockers: string[];
  acceptanceCriteria: string[];
  createdDate: Date;
  dueDate: Date;
  completedDate?: Date;
  quality: {
    codeReview: boolean;
    testing: boolean;
    documentation: boolean;
    performance: boolean;
    security: boolean;
  };
  context: {
    requirements: string[];
    design: string[];
    implementation: string[];
    testing: string[];
    deployment: string[];
  };
}
