/**
 * Nexus AI Agent Wrapper - Vercel AI SDK Integration
 *
 * Provides type-safe agent invocation using Vercel AI SDK with Anthropic Claude.
 * All agent outputs are validated against Zod schemas to ensure correctness.
 *
 * @module AgentWrapper
 * @version 4.1.0
 */

import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { TaskOutput, TaskOutputSchema } from './schemas';

/**
 * Agent names supported by the system
 */
export type AgentName = 'supervisor' | 'architect' | 'backend' | 'frontend' | 'qa-tester' | 'devops' | 'security';

/**
 * Model configuration options
 */
export interface ModelOptions {
  extendedThinking?: boolean;
  thinkingBudget?: number;
  temperature?: number;
  maxTokens?: number;
  cacheControl?: 'ephemeral' | 'static';
}

/**
 * Invoke an agent with type-safe output validation
 *
 * @template T - Zod schema type
 * @param agentName - Name of the agent to invoke
 * @param instruction - Instruction/prompt for the agent
 * @param schema - Zod schema to validate output against
 * @param options - Model configuration options
 * @returns Type-safe output matching the schema
 *
 * @example
 * ```typescript
 * const result = await invokeAgent(
 *   'backend',
 *   'Implement task TASK-023: Create user authentication API',
 *   TaskOutputSchema,
 *   { extendedThinking: true, thinkingBudget: 1024 }
 * );
 *
 * // result is fully typed as TaskOutput
 * if (result.status === 'complete') {
 *   console.log(`Files changed: ${result.filesChanged.join(', ')}`);
 * }
 * ```
 */
export async function invokeAgent<T extends z.ZodType>(
  agentName: AgentName,
  instruction: string,
  schema: T,
  options?: ModelOptions
): Promise<z.infer<T>> {
  // Configure Claude Sonnet 4.5 with extended thinking if requested
  const modelConfig: any = {
    // Note: Extended thinking configuration
    // When Anthropic releases extended thinking API, configure here:
    // extendedThinking: options?.extendedThinking || false,
    // thinkingBudget: options?.thinkingBudget || 0,
  };

  const model = anthropic('claude-sonnet-4-5-20250929', modelConfig);

  // Generate structured output with validation
  const { object, finishReason, usage } = await generateObject({
    model,
    schema,
    prompt: instruction,
    temperature: options?.temperature ?? 1.0,
    maxTokens: options?.maxTokens ?? 8192,
  });

  // Log usage for monitoring
  if (usage) {
    console.log(`[${agentName}] Token usage:`, {
      prompt: usage.promptTokens,
      completion: usage.completionTokens,
      total: usage.totalTokens,
    });
  }

  // Type-safe output guaranteed by Zod
  return object;
}

/**
 * Invoke an agent specifically for task execution
 *
 * Convenience wrapper around invokeAgent for the common case of task execution.
 *
 * @param agentName - Name of the agent to invoke
 * @param taskInstruction - Task instruction
 * @param options - Model configuration options
 * @returns Type-safe TaskOutput
 *
 * @example
 * ```typescript
 * const result = await invokeAgentForTask(
 *   'backend',
 *   'Task TASK-023: Implement user authentication API endpoint...',
 *   { extendedThinking: true, thinkingBudget: 1024 }
 * );
 * ```
 */
export async function invokeAgentForTask(
  agentName: AgentName,
  taskInstruction: string,
  options?: ModelOptions
): Promise<TaskOutput> {
  return invokeAgent(agentName, taskInstruction, TaskOutputSchema, options);
}

/**
 * Batch invoke multiple agents in parallel
 *
 * Useful for parallel task execution when tasks are independent.
 *
 * @param invocations - Array of agent invocations
 * @returns Array of type-safe outputs
 *
 * @example
 * ```typescript
 * const results = await batchInvokeAgents([
 *   { agentName: 'backend', instruction: 'Task 1...', schema: TaskOutputSchema },
 *   { agentName: 'frontend', instruction: 'Task 2...', schema: TaskOutputSchema },
 * ]);
 * ```
 */
export async function batchInvokeAgents<T extends z.ZodType>(
  invocations: Array<{
    agentName: AgentName;
    instruction: string;
    schema: T;
    options?: ModelOptions;
  }>
): Promise<Array<z.infer<T>>> {
  return Promise.all(
    invocations.map((inv) =>
      invokeAgent(inv.agentName, inv.instruction, inv.schema, inv.options)
    )
  );
}

/**
 * Stream agent output (for future use)
 *
 * Note: Currently a placeholder. Streaming will be implemented when needed.
 */
export async function streamAgentOutput(
  agentName: AgentName,
  instruction: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  throw new Error('Streaming not yet implemented. Use invokeAgent for standard requests.');
}

/**
 * Get agent identity and capabilities
 *
 * Helper to load agent markdown files and extract capabilities.
 */
export async function getAgentCapabilities(agentName: AgentName): Promise<{
  name: string;
  role: string;
  capabilities: string[];
}> {
  // This would read the agent's .md file and extract capabilities
  // For now, return basic info
  const capabilities: Record<AgentName, string[]> = {
    supervisor: ['Project orchestration', 'Task delegation', 'Risk management'],
    architect: ['System design', 'Database schemas', 'API contracts'],
    backend: ['API development', 'Database implementation', 'Authentication'],
    frontend: ['UI components', 'React/Next.js', 'Styling with Tailwind'],
    'qa-tester': ['Unit testing', 'Integration testing', 'E2E testing'],
    devops: ['Docker', 'Kubernetes', 'CI/CD pipelines'],
    security: ['Security audits', 'OWASP compliance', 'Vulnerability scanning'],
  };

  return {
    name: agentName,
    role: agentName.charAt(0).toUpperCase() + agentName.slice(1),
    capabilities: capabilities[agentName] || [],
  };
}

/**
 * Validate agent output manually
 *
 * Useful for debugging or manual validation.
 */
export function validateAgentOutput<T extends z.ZodType>(
  output: unknown,
  schema: T
): { success: boolean; data?: z.infer<T>; errors?: z.ZodError } {
  const result = schema.safeParse(output);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}
