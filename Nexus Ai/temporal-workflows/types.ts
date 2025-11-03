/**
 * Temporal Workflow Types for DeswalTech PBVS
 *
 * Type definitions for durable workflow execution across the Plan-Build-Validate-Scale lifecycle.
 *
 * @version 4.1.0
 */

import { PRD, TaskOutput } from '../schemas';

/**
 * PBVS Project Input
 */
export interface PBVSProjectInput {
  projectGoal: string;
  stakeholder: string;
  timeline?: {
    targetLaunchDate?: string;
    estimatedDuration?: string;
  };
  qualityRequirements?: {
    testCoverage?: number;
    performanceTargets?: string[];
    securityStandards?: string[];
  };
}

/**
 * Project State (persisted across workflow execution)
 */
export interface ProjectState {
  projectId: string;
  status: 'planning' | 'parsing' | 'building' | 'validating' | 'scaling' | 'completed' | 'failed';
  currentPhase: 'plan' | 'build' | 'validate' | 'scale';
  startedAt: string;
  updatedAt: string;

  // Phase outputs
  prd?: PRD;
  tasks?: Task[];
  buildResults?: BuildResult[];
  validationResults?: ValidationResult;
  deploymentResult?: DeploymentResult;

  // Progress tracking
  completedTasks: string[];      // Task IDs
  failedTasks: string[];          // Task IDs
  blockedTasks: string[];         // Task IDs

  // Metrics
  totalTasks: number;
  completedTasksCount: number;
  estimatedHours: number;
  actualHours?: number;
}

/**
 * Task representation for PBVS execution
 */
export interface Task {
  id: string;
  description: string;
  agent: 'architect' | 'backend' | 'frontend' | 'qa-tester' | 'devops' | 'security';
  phase: number;
  dependencies: string[];        // Task IDs
  estimatedHours: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
  output?: TaskOutput;
}

/**
 * Build Result for each task
 */
export interface BuildResult {
  taskId: string;
  output: TaskOutput;
  completedAt: string;
  duration: number;              // milliseconds
}

/**
 * Validation Result (Quality Gates)
 */
export interface ValidationResult {
  level1_automated: {
    passed: boolean;
    tests: {
      total: number;
      passed: number;
      failed: number;
      coverage: number;
    };
    linting: { passed: boolean; errors: number };
    security: { passed: boolean; vulnerabilities: number };
    performance: { passed: boolean; metrics: Record<string, number> };
  };
  level2_integration: {
    passed: boolean;
    e2e_tests: { passed: boolean; scenarios: number };
    api_contracts: { passed: boolean };
    cross_component: { passed: boolean };
  };
  level3_business: {
    passed: boolean;
    feature_completeness: boolean;
    user_acceptance: boolean;
    stakeholder_approval: boolean;
  };
  overallPassed: boolean;
}

/**
 * Deployment Result
 */
export interface DeploymentResult {
  environment: 'staging' | 'production';
  deployedAt: string;
  version: string;
  status: 'success' | 'failed' | 'rolled_back';
  url?: string;
  healthCheck?: {
    passed: boolean;
    endpoints: Array<{ url: string; status: number }>;
  };
}

/**
 * PBVS Workflow Result
 */
export interface PBVSResult {
  projectId: string;
  status: 'completed' | 'failed' | 'partially_completed';
  prd: PRD;
  tasks: Task[];
  buildResults: BuildResult[];
  validationResults: ValidationResult;
  deploymentResult?: DeploymentResult;

  // Metrics
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  estimatedHours: number;
  actualHours: number;
  startedAt: string;
  completedAt: string;
  duration: number;              // milliseconds
}

/**
 * Workflow Checkpoint (for resume capability)
 */
export interface WorkflowCheckpoint {
  projectId: string;
  phase: 'plan' | 'build' | 'validate' | 'scale';
  taskIndex: number;
  state: ProjectState;
  timestamp: string;
}
