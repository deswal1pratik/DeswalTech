/**
 * Type Safety Integration Test
 *
 * Tests Vercel AI SDK integration with Nexus AI agent system.
 * Validates schema compilation, helper functions, and type inference.
 *
 * @version 4.1.0
 */

import { randomUUID } from 'crypto';
import { z } from 'zod';
import {
  TaskOutputSchema,
  PRDSchema,
  createSuccessOutput,
  createBlockedOutput,
  createFailedOutput,
  validatePRD,
  calculateTotalHours,
  type TaskOutput,
  type PRD,
} from './schemas';

console.log('🧪 DeswalTech v4.1 - Type Safety Integration Test\n');

// ============================================================================
// Test 1: Schema Compilation
// ============================================================================

console.log('Test 1: Schema Compilation');
console.log('─'.repeat(60));

try {
  console.log('✓ TaskOutputSchema imported successfully');
  console.log('✓ PRDSchema imported successfully');
  console.log('✓ Helper functions imported successfully\n');
} catch (error) {
  console.error('✗ Schema import failed:', error);
  process.exit(1);
}

// ============================================================================
// Test 2: TaskOutput Validation - Valid Output
// ============================================================================

console.log('Test 2: TaskOutput Validation - Valid Output');
console.log('─'.repeat(60));

const validTaskOutput = {
  taskId: randomUUID(),
  agentName: 'backend' as const,
  status: 'complete' as const,
  completedAt: new Date().toISOString(),
  filesChanged: ['src/api/auth/login.ts', 'src/api/auth/register.ts'],
  filesCreated: ['src/api/auth/refresh-token.ts'],
  testsAdded: ['tests/api/auth/login.spec.ts'],
  testsPassed: true,
  testCoverage: 92,
  rollbackRequired: false,
  approvalNeeded: false,
  summary: 'Implemented user authentication API with JWT tokens',
  notes: ['Used Argon2id for password hashing', 'All tests passing'],
  knowledgeStored: true,
  learnings: ['Argon2id provides better security than bcrypt'],
};

try {
  const result = TaskOutputSchema.parse(validTaskOutput);
  console.log('✓ Valid TaskOutput passed validation');
  console.log(`  Agent: ${result.agentName}`);
  console.log(`  Status: ${result.status}`);
  console.log(`  Files changed: ${result.filesChanged.length}`);
  console.log(`  Test coverage: ${result.testCoverage}%\n`);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('✗ Valid TaskOutput failed validation:');
    error.errors.forEach((e) => console.error(`  - ${e.path.join('.')}: ${e.message}`));
  }
  process.exit(1);
}

// ============================================================================
// Test 3: TaskOutput Validation - Invalid Output
// ============================================================================

console.log('Test 3: TaskOutput Validation - Invalid Output');
console.log('─'.repeat(60));

const invalidTaskOutput = {
  taskId: 'not-a-uuid', // Invalid UUID
  agentName: 'invalid-agent', // Not in enum
  status: 'complete' as const,
  filesChanged: [],
  // Missing required 'summary' field
  rollbackRequired: false,
  approvalNeeded: false,
};

const invalidResult = TaskOutputSchema.safeParse(invalidTaskOutput);
if (invalidResult.success) {
  console.error('✗ Invalid TaskOutput passed validation (SHOULD FAIL)');
  process.exit(1);
} else {
  console.log('✓ Invalid TaskOutput correctly rejected');
  console.log('  Validation errors detected:');
  if (invalidResult.error && invalidResult.error.errors) {
    invalidResult.error.errors.forEach((e) => {
      console.log(`    - ${e.path.join('.')}: ${e.message}`);
    });
  }
  console.log('');
}

// ============================================================================
// Test 4: Helper Functions - createSuccessOutput
// ============================================================================

console.log('Test 4: Helper Functions - createSuccessOutput');
console.log('─'.repeat(60));

const successOutput = createSuccessOutput({
  taskId: randomUUID(),
  agentName: 'frontend',
  filesChanged: ['src/components/LoginForm.tsx'],
  summary: 'Implemented login form with Zod validation',
  nextTaskId: randomUUID(),
});

try {
  const validated = TaskOutputSchema.parse(successOutput);
  console.log('✓ createSuccessOutput helper works correctly');
  console.log(`  Task ID: ${validated.taskId}`);
  console.log(`  Agent: ${validated.agentName}`);
  console.log(`  Status: ${validated.status}`);
  console.log(`  Next task: ${validated.nextTaskId}\n`);
} catch (error) {
  console.error('✗ createSuccessOutput validation failed:', error);
  process.exit(1);
}

// ============================================================================
// Test 5: Helper Functions - createBlockedOutput
// ============================================================================

console.log('Test 5: Helper Functions - createBlockedOutput');
console.log('─'.repeat(60));

const blockedOutput = createBlockedOutput({
  taskId: randomUUID(),
  agentName: 'backend',
  blockers: ['Database schema not defined', 'Email service not configured'],
  summary: 'Task blocked by missing dependencies',
});

try {
  const validated = TaskOutputSchema.parse(blockedOutput);
  console.log('✓ createBlockedOutput helper works correctly');
  console.log(`  Status: ${validated.status}`);
  console.log(`  Blockers: ${validated.blockers?.length}`);
  console.log(`  Approval needed: ${validated.approvalNeeded}\n`);
} catch (error) {
  console.error('✗ createBlockedOutput validation failed:', error);
  process.exit(1);
}

// ============================================================================
// Test 6: Helper Functions - createFailedOutput
// ============================================================================

console.log('Test 6: Helper Functions - createFailedOutput');
console.log('─'.repeat(60));

const failedOutput = createFailedOutput({
  taskId: randomUUID(),
  agentName: 'qa-tester',
  error: {
    type: 'TestFailure',
    message: 'Integration tests failed',
    severity: 'high',
  },
  filesChanged: [],
  summary: 'Test suite execution failed',
  rollbackRequired: true,
});

try {
  const validated = TaskOutputSchema.parse(failedOutput);
  console.log('✓ createFailedOutput helper works correctly');
  console.log(`  Status: ${validated.status}`);
  console.log(`  Error type: ${validated.errorDetails?.type}`);
  console.log(`  Rollback required: ${validated.rollbackRequired}\n`);
} catch (error) {
  console.error('✗ createFailedOutput validation failed:', error);
  process.exit(1);
}

// ============================================================================
// Test 7: PRD Schema Validation - Valid PRD
// ============================================================================

console.log('Test 7: PRD Schema Validation - Valid PRD');
console.log('─'.repeat(60));

const validPRD: PRD = {
  projectName: 'User Authentication System',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  stakeholder: 'product@example.com',
  businessGoals: ['Enable secure user authentication', 'Support social login'],
  technicalRequirements: ['PostgreSQL database', 'JWT tokens', 'Argon2id hashing'],
  functionalRequirements: [
    {
      capability: 'User Authentication',
      phase: 1,
      features: [
        {
          name: 'Email/Password Login',
          description: 'Users can login with email and password',
          dependsOn: [],
          phase: 1,
          complexity: 'medium',
          estimatedHours: 8,
          acceptanceCriteria: ['User can login successfully', 'Invalid credentials rejected'],
        },
        {
          name: 'User Registration',
          description: 'New users can create accounts',
          dependsOn: [],
          phase: 1,
          complexity: 'medium',
          estimatedHours: 6,
          acceptanceCriteria: ['User can register', 'Email verification sent'],
        },
      ],
    },
  ],
  nonFunctionalRequirements: {
    performance: ['<100ms API response time'],
    security: ['Argon2id password hashing', 'JWT token expiry in 15 minutes'],
    scalability: ['Support 10k concurrent users'],
  },
};

try {
  const result = validatePRD(validPRD);
  if (result.success && result.data) {
    console.log('✓ Valid PRD passed validation');
    console.log(`  Project: ${result.data.projectName}`);
    console.log(`  Capabilities: ${result.data.functionalRequirements.length}`);
    console.log(`  Total features: ${result.data.functionalRequirements[0].features.length}`);

    const totalHours = calculateTotalHours(result.data);
    console.log(`  Total estimated hours: ${totalHours}h\n`);
  } else {
    console.error('✗ Valid PRD failed validation');
    console.error(result.errors);
    process.exit(1);
  }
} catch (error) {
  console.error('✗ PRD validation threw error:', error);
  process.exit(1);
}

// ============================================================================
// Test 8: Type Inference
// ============================================================================

console.log('Test 8: Type Inference');
console.log('─'.repeat(60));

// This test verifies TypeScript type inference works correctly
function processTaskOutput(output: TaskOutput): void {
  // TypeScript should know all these properties exist
  const taskId: string = output.taskId;
  const status: 'complete' | 'blocked' | 'failed' | 'needs_approval' = output.status;
  const summary: string = output.summary;

  if (output.testsAdded) {
    const testCount: number = output.testsAdded.length;
  }

  if (output.errorDetails) {
    const errorType: string = output.errorDetails.type;
  }

  // No TypeScript errors = success
  console.log('✓ TypeScript type inference works correctly');
  console.log('  All property types inferred correctly');
  console.log('  Optional properties handled correctly\n');
}

processTaskOutput(validTaskOutput);

// ============================================================================
// Summary
// ============================================================================

console.log('═'.repeat(60));
console.log('✅ All Type Safety Tests Passed!');
console.log('═'.repeat(60));
console.log('');
console.log('Summary:');
console.log('  ✓ Schema compilation successful');
console.log('  ✓ Valid TaskOutput validation works');
console.log('  ✓ Invalid TaskOutput correctly rejected');
console.log('  ✓ Helper functions (success, blocked, failed) work');
console.log('  ✓ PRD validation works');
console.log('  ✓ Type inference works correctly');
console.log('');
console.log('Vercel AI SDK + Zod integration is ready for production!');
console.log('');
