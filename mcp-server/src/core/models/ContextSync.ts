export interface ContextSync {
  id: string;
  projectId: string;
  agentId: string;
  timestamp: Date;
  context: {
    currentTask: string;
    progress: number;
    blockers: string[];
    dependencies: string[];
    decisions: string[];
    learnings: string[];
  };
  shared: {
    requirements: string[];
    design: string[];
    implementation: string[];
    testing: string[];
    deployment: string[];
  };
  quality: {
    codeQuality: number;
    testCoverage: number;
    performance: number;
    security: number;
    documentation: number;
  };
}
