## DeswalTech v4.1 - Integration Guide

**Type-Safe Agent Orchestration + Durable Workflow Execution**

This guide explains how to use the new Vercel AI SDK and Temporal integrations in DeswalTech v4.1.

---

## Overview

DeswalTech v4.1 introduces two major enhancements:

1. **Type-Safe Agent Orchestration** (Vercel AI SDK + Zod)
2. **Durable Workflow Execution** (Temporal)

Both work together to provide enterprise-grade reliability for multi-agent AI systems.

---

## 1. Type-Safe Agent Orchestration

### What It Does

- Validates all agent outputs against TypeScript schemas
- Provides automatic retries with correction prompts (up to 3x)
- Eliminates malformed responses
- Enables programmatic task tracking

### Quick Start

```typescript
import { safeInvokeAgent } from './agent-wrapper';
import { TaskOutputSchema } from './schemas';

// Invoke an agent with type safety
const result = await safeInvokeAgent(
  'backend',                    // Agent name
  'Implement user authentication API',
  TaskOutputSchema,             // Expected output schema
  {
    extendedThinking: true,     // Enable extended thinking
    thinkingBudget: 1024        // Token budget
  }
);

// Handle result (fully typed!)
if (result.success) {
  console.log('Task completed:', result.data.summary);
  console.log('Files changed:', result.data.filesChanged);
} else {
  console.error('Task failed:', result.message);
  console.error('Validation errors:', result.validationErrors);
}
```

### Available Schemas

#### TaskOutputSchema
Every specialist agent returns this structure:

```typescript
{
  taskId: string (UUID)
  agentName: "backend" | "frontend" | "architect" | ...
  status: "complete" | "blocked" | "failed" | "needs_approval"
  filesChanged: string[]
  summary: string
  rollbackRequired: boolean
  approvalNeeded: boolean

  // Optional fields
  testsAdded?: string[]
  testsPassed?: boolean
  testCoverage?: number
  nextTaskId?: string
  blockers?: string[]
  errorDetails?: ErrorDetails
  notes?: string[]
  learnings?: string[]
}
```

#### PRDSchema
Supervisor creates PRDs matching this structure:

```typescript
{
  projectName: string
  version: string
  stakeholder: string
  businessGoals: string[]
  technicalRequirements: string[]
  functionalRequirements: Capability[]  // RPG structure
  nonFunctionalRequirements: {
    performance: string[]
    security: string[]
    scalability: string[]
  }
}
```

### Helper Functions

```typescript
import {
  createSuccessOutput,
  createBlockedOutput,
  createFailedOutput,
} from './schemas';

// Create a success output
const output = createSuccessOutput({
  taskId: 'task-uuid',
  agentName: 'backend',
  filesChanged: ['src/api/auth.ts'],
  summary: 'Implemented authentication',
  nextTaskId: 'next-task-uuid',
});

// Create a blocked output
const blocked = createBlockedOutput({
  taskId: 'task-uuid',
  agentName: 'backend',
  blockers: ['Database schema not defined'],
  summary: 'Cannot proceed without schema',
});

// Create a failed output
const failed = createFailedOutput({
  taskId: 'task-uuid',
  agentName: 'qa-tester',
  error: {
    type: 'TestFailure',
    message: 'Integration tests failed',
    severity: 'high',
  },
  filesChanged: [],
  summary: 'Test suite failed',
});
```

### Error Handling

The system automatically:
1. Catches validation errors
2. Builds correction prompts with specific field errors
3. Retries up to 3 times with exponential backoff
4. Logs detailed error reports

```typescript
// Errors are handled automatically
const result = await safeInvokeAgent(...);

if (!result.success) {
  // Detailed error information available
  console.error('Error type:', result.errorType);
  console.error('Attempts:', result.attempts);

  if (result.validationErrors) {
    result.validationErrors.errors.forEach(error => {
      console.error(`${error.path}: ${error.message}`);
    });
  }
}
```

---

## 2. Temporal Durable Execution

### What It Does

- Workflows survive crashes and restarts
- Multi-day projects maintain state automatically
- Automatic retries for transient failures
- Full visibility into execution via Temporal UI
- Pause/resume capability

### Starting Temporal Infrastructure

```bash
cd Infrastructure
./start-services.sh

# Temporal services available at:
# - Temporal UI:   http://localhost:8080
# - Temporal gRPC: localhost:7233
```

### Running a PBVS Workflow

```typescript
import { Connection, Client } from '@temporalio/client';
import { pbvsWorkflow } from './temporal-workflows/pbvs-workflow';

// Connect to Temporal
const connection = await Connection.connect({
  address: 'localhost:7233',
});

const client = new Client({ connection });

// Start workflow
const handle = await client.workflow.start(pbvsWorkflow, {
  taskQueue: 'deswaltech-agents',
  workflowId: `project-${Date.now()}`,
  args: [{
    projectGoal: 'Build a SaaS authentication system',
    stakeholder: 'product@example.com',
    timeline: {
      targetLaunchDate: '2025-12-31',
    },
  }],
});

console.log('Workflow started:', handle.workflowId);

// Get workflow state (real-time)
const state = await handle.query('getState');
console.log('Current phase:', state.currentPhase);
console.log('Completed tasks:', state.completedTasksCount);

// Get progress
const progress = await handle.query('getProgress');
console.log(`Progress: ${progress.completed}/${progress.total}`);

// Wait for completion
const result = await handle.result();
console.log('Project completed!');
console.log('Total tasks:', result.totalTasks);
console.log('Duration:', result.duration);
```

### Pause/Resume Workflows

```typescript
// Pause workflow
await handle.signal('pause');

// Resume workflow
await handle.signal('resume');

// Approve a task
await handle.signal('approveTask', 'task-uuid');
```

### Monitoring Workflows

Visit **http://localhost:8080** to see:
- All running workflows
- Workflow execution history
- Task results and errors
- Performance metrics
- Event timeline (every step recorded)

---

## 3. Integration: Type-Safe + Durable

The two systems work together seamlessly:

```typescript
// In activities.ts
export async function executeTask(task: Task): Promise<TaskOutput> {
  // Type-safe agent invocation
  const output = await safeInvokeAgentForTask(
    task.agent,
    task.id,
    instruction,
    { extendedThinking: true, thinkingBudget: 1024 }
  );

  // Returns validated TaskOutput
  return output;
}

// In pbvs-workflow.ts
export async function pbvsWorkflow(input: PBVSProjectInput) {
  // All tasks are durable
  for (const task of tasks) {
    const output = await executeTask(task);  // Type-safe + durable

    // Update state
    if (output.status === 'complete') {
      state.completedTasks.push(task.id);
    }

    // Checkpoint every 5 tasks
    if (tasksCompleted % 5 === 0) {
      await storeCheckpoint(state);  // State persisted
    }
  }
}
```

### Benefits

✅ **Type Safety**: All agent outputs validated automatically
✅ **Durability**: Workflows survive crashes and restarts
✅ **Reliability**: Automatic retries for failures
✅ **Visibility**: Full execution history in Temporal UI
✅ **Control**: Pause/resume/approve workflows dynamically
✅ **Scalability**: Handle multi-day projects effortlessly

---

## 4. Testing

### Type Safety Tests

```bash
cd "Nexus Ai"
npx tsx test-type-safety.ts
```

Expected output:
```
✅ All Type Safety Tests Passed!

Summary:
  ✓ Schema compilation successful
  ✓ Valid TaskOutput validation works
  ✓ Invalid TaskOutput correctly rejected
  ✓ Helper functions (success, blocked, failed) work
  ✓ PRD validation works
  ✓ Type inference works correctly
```

### Temporal Workflow Tests

(Coming in next session - requires worker setup)

---

## 5. Agent File Updates

All 7 agent files now include "🔒 Type-Safe Output Validation" sections:

- `backend.md` - Lines 138-293 (complete schema documentation)
- `frontend.md` - Frontend-specific output examples
- `architect.md` - Architecture design outputs
- `qa-tester.md` - Test result outputs
- `devops.md` - Deployment outputs with rollback
- `security.md` - Security audit outputs
- `supervisor.md` - Type-safe orchestration guide (lines 353-534)

Each agent knows exactly how to structure their outputs for validation.

---

## 6. File Structure

```
DeswalTech/
├── Nexus Ai/
│   ├── schemas/
│   │   ├── task-output.schema.ts      # TaskOutput + helpers
│   │   ├── prd-output.schema.ts       # PRD schema
│   │   └── index.ts                   # Exports
│   ├── temporal-workflows/
│   │   ├── types.ts                   # Workflow types
│   │   ├── activities.ts              # PBVS activities
│   │   └── pbvs-workflow.ts           # Main workflow
│   ├── agent-wrapper.ts               # Type-safe agent invocation
│   ├── error-handler.ts               # Retry logic
│   ├── test-type-safety.ts            # Integration tests
│   └── INTEGRATION_GUIDE.md           # This file
├── Infrastructure/
│   └── docker-compose.yml             # Includes Temporal
└── package.json                        # AI SDK + Temporal deps
```

---

## 7. Production Checklist

Before deploying:

- [ ] Set ANTHROPIC_API_KEY environment variable
- [ ] Configure Temporal for production (PostgreSQL backend)
- [ ] Set up monitoring (Prometheus + Grafana already configured)
- [ ] Test rollback procedures
- [ ] Configure notification MCPs (Resend, Twilio)
- [ ] Set up backup for Temporal state
- [ ] Test multi-day workflow persistence
- [ ] Verify all 7 agents return valid TaskOutputs

---

## 8. Next Steps

### Coming in Future Sessions:

1. **Plugin Packaging** - Convert Nexus AI to official Claude Code Plugin
2. **Agent Skills Migration** - Move to Anthropic Agent Skills API
3. **Batch Processing** - 50% cost savings for test suites
4. **Safety Notes** - Add to backend/devops/security agents

---

## Support

- **Documentation**: See agent file "🔒 Type-Safe Output Validation" sections
- **Temporal UI**: http://localhost:8080 for workflow monitoring
- **Tests**: Run `npx tsx test-type-safety.ts` to verify setup

---

**DeswalTech v4.1** - Enterprise-Grade AI Agent System with Type Safety + Durability
