/**
 * Batch Processing for Non-Critical Tasks
 *
 * Provides 50% cost savings for non-interactive operations like test suites,
 * documentation generation, and code analysis.
 *
 * @version 4.1.0
 */

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { TaskOutput, TaskOutputSchema } from './schemas';

/**
 * Initialize Anthropic client
 */
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Batch task input
 */
export interface BatchTaskInput {
  customId: string;
  agentName: 'qa-tester' | 'backend' | 'frontend' | 'security' | 'devops';
  instruction: string;
  schema?: z.ZodType;
}

/**
 * Batch task result
 */
export interface BatchTaskResult {
  customId: string;
  status: 'completed' | 'failed' | 'processing';
  result?: any;
  error?: string;
}

/**
 * Batch processing status
 */
export interface BatchStatus {
  batchId: string;
  status: 'in_progress' | 'completed' | 'failed';
  requestCounts: {
    total: number;
    succeeded: number;
    errored: number;
    canceled: number;
    expired: number;
  };
  createdAt: string;
  estimatedCompletionTime?: string;
}

/**
 * Submit batch tasks for processing
 *
 * Use this for non-critical, non-interactive tasks that can wait 5-15 minutes.
 *
 * @param tasks - Array of batch task inputs
 * @returns Batch ID for tracking
 *
 * @example
 * ```typescript
 * const batchId = await submitBatchTasks([
 *   {
 *     customId: 'test-suite-1',
 *     agentName: 'qa-tester',
 *     instruction: 'Run full test suite (350 tests)',
 *   },
 *   {
 *     customId: 'security-audit-1',
 *     agentName: 'security',
 *     instruction: 'Run security audit with Semgrep',
 *   },
 * ]);
 *
 * // Check status later
 * const status = await checkBatchStatus(batchId);
 * if (status.status === 'completed') {
 *   const results = await retrieveBatchResults(batchId);
 * }
 * ```
 */
export async function submitBatchTasks(tasks: BatchTaskInput[]): Promise<string> {
  console.log(`[Batch] Submitting ${tasks.length} tasks for batch processing...`);

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required for batch processing');
  }

  // Build batch requests
  const requests = tasks.map((task) => ({
    custom_id: task.customId,
    params: {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      messages: [
        {
          role: 'user' as const,
          content: buildBatchInstruction(task),
        },
      ],
    },
  }));

  try {
    // Submit batch via Anthropic API
    const batch = await client.messages.batches.create({ requests });

    console.log(`[Batch] Batch submitted successfully!`);
    console.log(`  Batch ID: ${batch.id}`);
    console.log(`  Total tasks: ${requests.length}`);
    console.log(`  Expected completion: 5-15 minutes`);
    console.log(`  Cost savings: 50% compared to real-time`);

    return batch.id;
  } catch (error: any) {
    console.error(`[Batch] Failed to submit batch:`, error.message);
    throw error;
  }
}

/**
 * Check batch processing status
 *
 * @param batchId - Batch ID returned from submitBatchTasks
 * @returns Current batch status
 */
export async function checkBatchStatus(batchId: string): Promise<BatchStatus> {
  console.log(`[Batch] Checking status for batch ${batchId}...`);

  try {
    const batch = await client.messages.batches.retrieve(batchId);

    const status: BatchStatus = {
      batchId: batch.id,
      status: batch.processing_status === 'ended' ? 'completed' :
              batch.processing_status === 'in_progress' ? 'in_progress' : 'failed',
      requestCounts: {
        total: batch.request_counts?.total || 0,
        succeeded: batch.request_counts?.succeeded || 0,
        errored: batch.request_counts?.errored || 0,
        canceled: batch.request_counts?.canceled || 0,
        expired: batch.request_counts?.expired || 0,
      },
      createdAt: batch.created_at,
    };

    console.log(`[Batch] Status: ${status.status}`);
    console.log(`  Succeeded: ${status.requestCounts.succeeded}/${status.requestCounts.total}`);
    console.log(`  Errored: ${status.requestCounts.errored}`);

    return status;
  } catch (error: any) {
    console.error(`[Batch] Failed to check status:`, error.message);
    throw error;
  }
}

/**
 * Retrieve batch processing results
 *
 * @param batchId - Batch ID
 * @returns Array of batch results
 */
export async function retrieveBatchResults(batchId: string): Promise<BatchTaskResult[]> {
  console.log(`[Batch] Retrieving results for batch ${batchId}...`);

  try {
    const batch = await client.messages.batches.retrieve(batchId);

    if (batch.processing_status !== 'ended') {
      throw new Error(`Batch is still processing (status: ${batch.processing_status})`);
    }

    // Retrieve results
    const resultsStream = await client.messages.batches.results(batchId);
    const results: BatchTaskResult[] = [];

    for await (const result of resultsStream) {
      if (result.result.type === 'succeeded') {
        results.push({
          customId: result.custom_id,
          status: 'completed',
          result: result.result.message,
        });
      } else if (result.result.type === 'errored') {
        results.push({
          customId: result.custom_id,
          status: 'failed',
          error: result.result.error?.message || 'Unknown error',
        });
      }
    }

    console.log(`[Batch] Retrieved ${results.length} results`);
    console.log(`  Completed: ${results.filter(r => r.status === 'completed').length}`);
    console.log(`  Failed: ${results.filter(r => r.status === 'failed').length}`);

    return results;
  } catch (error: any) {
    console.error(`[Batch] Failed to retrieve results:`, error.message);
    throw error;
  }
}

/**
 * Wait for batch completion
 *
 * Polls batch status until completion.
 *
 * @param batchId - Batch ID
 * @param pollInterval - Poll interval in milliseconds (default: 30000 = 30 seconds)
 * @param maxWaitTime - Maximum wait time in milliseconds (default: 1800000 = 30 minutes)
 * @returns Array of batch results
 */
export async function waitForBatchCompletion(
  batchId: string,
  pollInterval: number = 30000,
  maxWaitTime: number = 1800000
): Promise<BatchTaskResult[]> {
  console.log(`[Batch] Waiting for batch ${batchId} to complete...`);
  console.log(`  Poll interval: ${pollInterval / 1000}s`);
  console.log(`  Max wait time: ${maxWaitTime / 1000 / 60} minutes`);

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const status = await checkBatchStatus(batchId);

    if (status.status === 'completed') {
      console.log(`[Batch] Batch completed!`);
      return await retrieveBatchResults(batchId);
    } else if (status.status === 'failed') {
      throw new Error('Batch processing failed');
    }

    // Wait before next poll
    console.log(`[Batch] Still processing... checking again in ${pollInterval / 1000}s`);
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Batch processing timed out after ${maxWaitTime / 1000 / 60} minutes`);
}

/**
 * Helper: Build batch instruction
 */
function buildBatchInstruction(task: BatchTaskInput): string {
  return `
You are the ${task.agentName} agent for DeswalTech.

Execute the following task:
${task.instruction}

**IMPORTANT:**
1. This is a batch processing task (non-interactive)
2. Complete the task fully without waiting for user input
3. Return a valid TaskOutput matching the TaskOutputSchema
4. Include all files changed, tests added, and a comprehensive summary

Your response will be validated automatically. Ensure it matches the expected schema exactly.
  `.trim();
}

/**
 * Decision helper: Should this task use batch processing?
 *
 * @param task - Task description
 * @returns true if batch processing is recommended
 */
export function shouldUseBatchProcessing(task: {
  description: string;
  estimatedDuration: number; // minutes
  isUserInteractive: boolean;
  isTimeServe: boolean;
  isCritical: boolean;
}): boolean {
  // Never batch if user-interactive
  if (task.isUserInteractive) return false;

  // Never batch if time-sensitive or critical
  if (task.isTimeSensitive || task.isCritical) return false;

  // Batch if suitable for async processing
  const batchKeywords = [
    'test suite',
    'full tests',
    'security audit',
    'dependency audit',
    'documentation generation',
    'code analysis',
    'linting all files',
    'formatting all files',
  ];

  const matchesBatchKeyword = batchKeywords.some((keyword) =>
    task.description.toLowerCase().includes(keyword)
  );

  return matchesBatchKeyword && task.estimatedDuration >= 5;
}

/**
 * Example: Batch test suite execution
 */
export async function batchTestSuiteExecution(testCommand: string): Promise<BatchTaskResult[]> {
  console.log('[Batch] Starting batch test suite execution...');

  const batchId = await submitBatchTasks([
    {
      customId: 'test-suite-unit',
      agentName: 'qa-tester',
      instruction: `Run unit tests: ${testCommand} --scope=unit\n\nReturn test results with coverage.`,
    },
    {
      customId: 'test-suite-integration',
      agentName: 'qa-tester',
      instruction: `Run integration tests: ${testCommand} --scope=integration\n\nReturn test results.`,
    },
    {
      customId: 'test-suite-e2e',
      agentName: 'qa-tester',
      instruction: `Run E2E tests: ${testCommand} --scope=e2e\n\nReturn test results.`,
    },
  ]);

  return await waitForBatchCompletion(batchId);
}
