export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'deployment' | 'completed' | 'paused';
  phase: 'requirements' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';
  sprint: {
    current: number;
    total: number;
    startDate: Date;
    endDate: Date;
    goals: string[];
    progress: number;
  };
  team: {
    orchestrator: string;
    backend: string;
    frontend: string;
    mobile: string;
    devops: string;
    qa: string;
    security: string;
    business: string;
  };
  requirements: {
    functional: string[];
    nonFunctional: string[];
    technical: string[];
    business: string[];
  };
  architecture: {
    backend: string;
    frontend: string;
    mobile: string;
    database: string;
    infrastructure: string;
  };
  progress: {
    overall: number;
    backend: number;
    frontend: number;
    mobile: number;
    testing: number;
    deployment: number;
  };
  quality: {
    codeQuality: number;
    testCoverage: number;
    performance: number;
    security: number;
    usability: number;
  };
  risks: {
    technical: string[];
    business: string[];
    timeline: string[];
    resource: string[];
  };
  metrics: {
    velocity: number;
    burndown: number;
    quality: number;
    satisfaction: number;
  };
}
