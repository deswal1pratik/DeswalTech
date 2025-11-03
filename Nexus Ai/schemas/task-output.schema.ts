/**
 * Task Output Schema - Vercel AI SDK Type-Safe Validation
 *
 * This schema ensures all agent task outputs are validated and type-safe.
 * Used by all 7 specialist agents when completing tasks.
 *
 * @module TaskOutputSchema
 * @version 4.1.0
 */

import { z } from 'zod';

/**
 * Task Status Enum
 */
export const TaskStatus = z.enum([
  'complete',        // Task successfully completed
  'blocked',         // Task blocked by dependencies or issues
  'failed',          // Task failed with errors
  'needs_approval',  // Task needs human approval before proceeding
]);

/**
 * Error Details Schema
 */
export const ErrorDetailsSchema = z.object({
  type: z.string().describe('Error type (e.g., TypeError, ValidationError, DatabaseError)'),
  message: z.string().describe('Human-readable error message'),
  stackTrace: z.string().optional().describe('Full stack trace for debugging'),
  component: z.string().optional().describe('Component/module where error occurred'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

export type ErrorDetails = z.infer<typeof ErrorDetailsSchema>;

/**
 * Task Output Schema - Complete structure for agent task results
 */
export const TaskOutputSchema = z.object({
  // Core identification
  taskId: z.string().uuid('Task ID must be a valid UUID'),
  agentName: z.enum([
    'supervisor',
    'architect',
    'backend',
    'frontend',
    'qa-tester',
    'devops',
    'security',
  ]).describe('Agent that executed the task'),

  // Status and completion
  status: TaskStatus,
  completedAt: z.string().datetime().optional().describe('ISO 8601 timestamp of completion'),

  // File changes
  filesChanged: z.array(z.string()).describe('Array of file paths modified'),
  filesCreated: z.array(z.string()).optional().describe('Array of file paths created'),
  filesDeleted: z.array(z.string()).optional().describe('Array of file paths deleted'),

  // Testing
  testsAdded: z.array(z.string()).optional().describe('Array of test file paths added'),
  testsPassed: z.boolean().optional().describe('Whether all tests passed'),
  testCoverage: z.number().min(0).max(100).optional().describe('Test coverage percentage'),

  // Task flow
  nextTaskId: z.string().uuid().optional().describe('UUID of next task to execute'),
  blockers: z.array(z.string()).optional().describe('Array of blocking issues'),
  dependencies: z.array(z.string().uuid()).optional().describe('Task IDs this task depends on'),

  // Error handling
  errorDetails: ErrorDetailsSchema.optional(),
  rollbackRequired: z.boolean().describe('Whether rollback is needed'),
  rollbackSteps: z.array(z.string()).optional().describe('Steps to rollback changes'),

  // Approval and safety
  approvalNeeded: z.boolean().describe('Whether human approval is needed'),
  approvalReason: z.string().optional().describe('Why approval is needed'),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),

  // Documentation
  summary: z.string().describe('Brief summary of what was accomplished'),
  notes: z.array(z.string()).optional().describe('Additional notes or observations'),

  // Knowledge management (ByteRover MCP)
  knowledgeStored: z.boolean().optional().describe('Whether knowledge was stored in ByteRover'),
  learnings: z.array(z.string()).optional().describe('Key learnings to store'),
});

export type TaskOutput = z.infer<typeof TaskOutputSchema>;

/**
 * Helper function to create a successful task output
 */
export function createSuccessOutput(params: {
  taskId: string;
  agentName: TaskOutput['agentName'];
  filesChanged: string[];
  summary: string;
  nextTaskId?: string;
}): TaskOutput {
  return {
    taskId: params.taskId,
    agentName: params.agentName,
    status: 'complete',
    completedAt: new Date().toISOString(),
    filesChanged: params.filesChanged,
    testsAdded: [],
    rollbackRequired: false,
    approvalNeeded: false,
    summary: params.summary,
    nextTaskId: params.nextTaskId,
  };
}

/**
 * Helper function to create a blocked task output
 */
export function createBlockedOutput(params: {
  taskId: string;
  agentName: TaskOutput['agentName'];
  blockers: string[];
  summary: string;
}): TaskOutput {
  return {
    taskId: params.taskId,
    agentName: params.agentName,
    status: 'blocked',
    filesChanged: [],
    blockers: params.blockers,
    rollbackRequired: false,
    approvalNeeded: true,
    approvalReason: `Task blocked: ${params.blockers.join(', ')}`,
    summary: params.summary,
  };
}

/**
 * Helper function to create a failed task output
 */
export function createFailedOutput(params: {
  taskId: string;
  agentName: TaskOutput['agentName'];
  error: ErrorDetails;
  filesChanged: string[];
  summary: string;
  rollbackRequired?: boolean;
}): TaskOutput {
  return {
    taskId: params.taskId,
    agentName: params.agentName,
    status: 'failed',
    filesChanged: params.filesChanged,
    errorDetails: params.error,
    rollbackRequired: params.rollbackRequired ?? true,
    approvalNeeded: true,
    approvalReason: `Task failed: ${params.error.message}`,
    summary: params.summary,
    riskLevel: params.error.severity,
  };
}
