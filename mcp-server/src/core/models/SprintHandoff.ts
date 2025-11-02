export interface SprintHandoff {
  id: string;
  projectId: string;
  fromSprint: number;
  toSprint: number;
  handoffDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  deliverables: {
    completed: string[];
    inProgress: string[];
    blocked: string[];
    next: string[];
  };
  context: {
    progress: number;
    blockers: string[];
    dependencies: string[];
    risks: string[];
    lessons: string[];
  };
  quality: {
    codeReview: boolean;
    testing: boolean;
    documentation: boolean;
    performance: boolean;
    security: boolean;
  };
  approval: {
    technical: boolean;
    business: boolean;
    stakeholder: boolean;
  };
}
