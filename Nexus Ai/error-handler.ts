/**
 * Nexus AI Error Handler - Automatic Retry with Validation Correction
 *
 * Provides robust error handling with automatic retries for agent invocations.
 * Includes special handling for Zod validation errors with correction prompts.
 *
 * @module ErrorHandler
 * @version 4.1.0
 */

import { z } from 'zod';
import { invokeAgent, AgentName, ModelOptions } from './agent-wrapper';
import { TaskOutput, ErrorDetails, createFailedOutput } from './schemas';

/**
 * Error report for failed agent invocations
 */
export interface ErrorReport {
  success: false;
  agent: AgentName;
  message: string;
  errorType: 'validation' | 'api' | 'timeout' | 'unknown';
  attempts: number;
  validationErrors?: z.ZodError;
  originalError?: Error;
  timestamp: string;
}

/**
 * Success result wrapper
 */
export interface SuccessResult<T> {
  success: true;
  data: T;
  attempts: number;
}

/**
 * Result type that can be either success or error
 */
export type AgentResult<T> = SuccessResult<T> | ErrorReport;

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    'RATE_LIMIT',
    'TIMEOUT',
    'NETWORK_ERROR',
    'SERVICE_UNAVAILABLE',
  ],
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Safe invoke agent with automatic retries and error handling
 *
 * This is the recommended way to invoke agents in production code.
 * It handles validation errors, API errors, and provides automatic retries.
 *
 * @template T - Zod schema type
 * @param agentName - Name of the agent to invoke
 * @param instruction - Instruction/prompt for the agent
 * @param schema - Zod schema to validate output against
 * @param options - Model configuration options
 * @param retryConfig - Retry configuration (optional)
 * @returns AgentResult with either data or error report
 *
 * @example
 * ```typescript
 * const result = await safeInvokeAgent(
 *   'backend',
 *   'Implement task TASK-023...',
 *   TaskOutputSchema,
 *   { extendedThinking: true }
 * );
 *
 * if (result.success) {
 *   console.log('Task completed:', result.data.summary);
 * } else {
 *   console.error('Task failed:', result.message);
 *   if (result.validationErrors) {
 *     console.error('Validation errors:', result.validationErrors.errors);
 *   }
 * }
 * ```
 */
export async function safeInvokeAgent<T extends z.ZodType>(
  agentName: AgentName,
  instruction: string,
  schema: T,
  options?: ModelOptions,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<AgentResult<z.infer<T>>> {
  let currentInstruction = instruction;
  let lastError: Error | undefined;
  let lastValidationError: z.ZodError | undefined;

  for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      console.log(`[${agentName}] Attempt ${attempt}/${retryConfig.maxRetries}`);

      // Invoke agent
      const result = await invokeAgent(agentName, currentInstruction, schema, options);

      // Success!
      return {
        success: true,
        data: result,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error as Error;

      // Handle Zod validation errors specially
      if (error instanceof z.ZodError) {
        lastValidationError = error;

        console.error(
          `[${agentName}] Validation failed (attempt ${attempt}):`,
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        );

        // For validation errors, provide correction prompt
        if (attempt < retryConfig.maxRetries) {
          currentInstruction = buildCorrectionPrompt(instruction, error);
          console.log(`[${agentName}] Retrying with correction prompt...`);
          await sleep(calculateDelay(attempt, retryConfig));
          continue;
        }
      }

      // Handle API errors
      if (isRetryableError(error, retryConfig)) {
        console.error(`[${agentName}] Retryable error (attempt ${attempt}):`, error.message);

        if (attempt < retryConfig.maxRetries) {
          const delay = calculateDelay(attempt, retryConfig);
          console.log(`[${agentName}] Retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        }
      }

      // Non-retryable error or max retries reached
      console.error(`[${agentName}] Non-retryable error or max retries reached:`, error.message);
      break;
    }
  }

  // All retries failed - return error report
  return {
    success: false,
    agent: agentName,
    message: lastValidationError
      ? `Validation failed after ${retryConfig.maxRetries} attempts`
      : `Agent invocation failed: ${lastError?.message || 'Unknown error'}`,
    errorType: lastValidationError ? 'validation' : determineErrorType(lastError),
    attempts: retryConfig.maxRetries,
    validationErrors: lastValidationError,
    originalError: lastError,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Build a correction prompt for validation errors
 */
function buildCorrectionPrompt(originalInstruction: string, error: z.ZodError): string {
  const errorMessages = error.errors.map((e) => {
    const path = e.path.length > 0 ? e.path.join('.') : 'root';
    return `  - Field "${path}": ${e.message}`;
  });

  return `${originalInstruction}

⚠️ PREVIOUS OUTPUT WAS INVALID - VALIDATION FAILED

Please correct the following validation errors:
${errorMessages.join('\n')}

IMPORTANT: Provide a response that matches the expected schema exactly. Pay special attention to:
1. Required fields must be present
2. Field types must match (string, number, boolean, array, etc.)
3. Enums must use exact values specified
4. UUIDs must be valid UUID format
5. Arrays must contain the correct item types

Please try again with a correctly formatted response.`;
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: unknown, config: RetryConfig): boolean {
  if (!(error instanceof Error)) return false;

  const errorMessage = error.message.toUpperCase();

  return config.retryableErrors.some((retryableError) =>
    errorMessage.includes(retryableError)
  );
}

/**
 * Determine error type from error object
 */
function determineErrorType(error: Error | undefined): ErrorReport['errorType'] {
  if (!error) return 'unknown';

  const message = error.message.toLowerCase();

  if (message.includes('timeout')) return 'timeout';
  if (message.includes('rate limit') || message.includes('429')) return 'api';
  if (message.includes('network') || message.includes('fetch')) return 'api';

  return 'unknown';
}

/**
 * Safe invoke agent for task execution with TaskOutput
 *
 * Specialized version that returns TaskOutput on both success and failure.
 * On failure, returns a properly formatted failed TaskOutput.
 */
export async function safeInvokeAgentForTask(
  agentName: AgentName,
  taskId: string,
  taskInstruction: string,
  options?: ModelOptions,
  retryConfig?: RetryConfig
): Promise<TaskOutput> {
  const result = await safeInvokeAgent(
    agentName,
    taskInstruction,
    // Import TaskOutputSchema from schemas
    (await import('./schemas')).TaskOutputSchema,
    options,
    retryConfig
  );

  if (result.success) {
    return result.data;
  }

  // Convert error report to failed TaskOutput
  const errorDetails: ErrorDetails = {
    type: result.errorType,
    message: result.message,
    stackTrace: result.originalError?.stack,
    severity: 'high',
  };

  return createFailedOutput({
    taskId,
    agentName,
    error: errorDetails,
    filesChanged: [],
    summary: `Task execution failed after ${result.attempts} attempts: ${result.message}`,
    rollbackRequired: true,
  });
}

/**
 * Log error report to console (structured)
 */
export function logErrorReport(report: ErrorReport): void {
  console.error('\n╔════════════════════════════════════════════════════════════════╗');
  console.error('║                    AGENT INVOCATION FAILED                     ║');
  console.error('╚════════════════════════════════════════════════════════════════╝\n');
  console.error(`Agent:        ${report.agent}`);
  console.error(`Error Type:   ${report.errorType}`);
  console.error(`Attempts:     ${report.attempts}`);
  console.error(`Timestamp:    ${report.timestamp}`);
  console.error(`Message:      ${report.message}\n`);

  if (report.validationErrors) {
    console.error('Validation Errors:');
    report.validationErrors.errors.forEach((error) => {
      console.error(`  - ${error.path.join('.')}: ${error.message}`);
    });
    console.error('');
  }

  if (report.originalError) {
    console.error('Original Error:');
    console.error(report.originalError.stack || report.originalError.message);
  }

  console.error('\n════════════════════════════════════════════════════════════════\n');
}

/**
 * Save error report to file
 */
export async function saveErrorReport(report: ErrorReport, outputPath: string): Promise<void> {
  const fs = await import('fs/promises');

  const reportContent = `# Agent Invocation Error Report

**Agent:** ${report.agent}
**Error Type:** ${report.errorType}
**Attempts:** ${report.attempts}
**Timestamp:** ${report.timestamp}

## Error Message

${report.message}

${
  report.validationErrors
    ? `## Validation Errors

${report.validationErrors.errors.map((e) => `- **${e.path.join('.')}**: ${e.message}`).join('\n')}
`
    : ''
}

${
  report.originalError
    ? `## Stack Trace

\`\`\`
${report.originalError.stack || report.originalError.message}
\`\`\`
`
    : ''
}

---
*Generated by DeswalTech v4.1 Error Handler*
`;

  await fs.writeFile(outputPath, reportContent, 'utf-8');
  console.log(`Error report saved to: ${outputPath}`);
}
