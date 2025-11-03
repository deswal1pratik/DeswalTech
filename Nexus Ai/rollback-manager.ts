/**
 * Strategic Rollback Management System
 *
 * Supervisor-orchestrated rollback handling with comprehensive documentation,
 * error logging, and future reference records.
 *
 * CRITICAL: This is NOT automated - requires supervisor approval at every step.
 *
 * @version 4.1.0
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Rollback types
 */
export type RollbackType =
  | 'git-commit'
  | 'database-migration'
  | 'deployment'
  | 'configuration'
  | 'dependency';

/**
 * Rollback severity
 */
export type RollbackSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Rollback request (created by specialist agent)
 */
export interface RollbackRequest {
  id: string; // Format: RB-YYYYMMDD-HHMMSS
  timestamp: string;
  type: RollbackType;
  severity: RollbackSeverity;
  requestedBy: string; // Agent name
  reason: string;
  affectedSystems: string[];
  currentState: string;
  targetState: string;
  estimatedDowntime: string; // e.g., "<5 minutes", "none"
  riskAssessment: string;
  approvalRequired: boolean;
}

/**
 * Rollback execution plan
 */
export interface RollbackPlan {
  request: RollbackRequest;
  steps: RollbackStep[];
  preChecks: RollbackCheck[];
  postChecks: RollbackCheck[];
  rollbackOfRollback?: string; // How to undo this rollback
}

/**
 * Individual rollback step
 */
export interface RollbackStep {
  stepNumber: number;
  description: string;
  command?: string;
  manualAction?: string;
  expectedResult: string;
  verificationCommand?: string;
  estimatedDuration: string; // seconds
}

/**
 * Pre/post rollback checks
 */
export interface RollbackCheck {
  name: string;
  description: string;
  command?: string;
  expectedResult: string;
  passed?: boolean;
}

/**
 * Rollback execution result
 */
export interface RollbackResult {
  request: RollbackRequest;
  plan: RollbackPlan;
  executedAt: string;
  executedBy: string; // "supervisor" or agent name
  approvedBy: string; // User who said "yes"
  steps: RollbackStepResult[];
  totalDuration: number; // seconds
  success: boolean;
  errors: string[];
  postChecksStatus: 'passed' | 'failed' | 'partial';
}

/**
 * Rollback step execution result
 */
export interface RollbackStepResult extends RollbackStep {
  executed: boolean;
  success: boolean;
  output?: string;
  error?: string;
  duration: number; // seconds
}

/**
 * Create a new rollback request
 */
export function createRollbackRequest(params: {
  type: RollbackType;
  severity: RollbackSeverity;
  requestedBy: string;
  reason: string;
  affectedSystems: string[];
  currentState: string;
  targetState: string;
  estimatedDowntime: string;
  riskAssessment: string;
}): RollbackRequest {
  const timestamp = new Date().toISOString();
  const id = `RB-${timestamp.slice(0, 10).replace(/-/g, '')}-${timestamp.slice(11, 19).replace(/:/g, '')}`;

  return {
    id,
    timestamp,
    ...params,
    approvalRequired: params.severity === 'high' || params.severity === 'critical',
  };
}

/**
 * Generate rollback plan based on type
 */
export function generateRollbackPlan(request: RollbackRequest): RollbackPlan {
  const plan: RollbackPlan = {
    request,
    steps: [],
    preChecks: [],
    postChecks: [],
  };

  // Common pre-checks
  plan.preChecks = [
    {
      name: 'Git Status Clean',
      description: 'Ensure no uncommitted changes',
      command: 'git status --porcelain',
      expectedResult: 'Empty output (no uncommitted changes)',
    },
    {
      name: 'Backup Exists',
      description: 'Verify recent backup is available',
      command: 'ls -lh backups/ | tail -5',
      expectedResult: 'Backup file from last 24 hours exists',
    },
    {
      name: 'Services Running',
      description: 'Check all services are operational',
      command: 'docker compose ps',
      expectedResult: 'All services in "Up" state',
    },
  ];

  // Type-specific rollback steps
  switch (request.type) {
    case 'git-commit':
      plan.steps = generateGitRollbackSteps(request);
      break;

    case 'database-migration':
      plan.steps = generateDatabaseRollbackSteps(request);
      break;

    case 'deployment':
      plan.steps = generateDeploymentRollbackSteps(request);
      break;

    case 'configuration':
      plan.steps = generateConfigRollbackSteps(request);
      break;

    case 'dependency':
      plan.steps = generateDependencyRollbackSteps(request);
      break;
  }

  // Common post-checks
  plan.postChecks = [
    {
      name: 'Application Health',
      description: 'Verify application is responding',
      command: 'curl -f http://localhost:3000/health || echo "FAILED"',
      expectedResult: 'HTTP 200 response',
    },
    {
      name: 'Database Connectivity',
      description: 'Check database connection',
      command: 'psql -U postgres -c "SELECT 1;" -d myapp',
      expectedResult: 'Connection successful',
    },
    {
      name: 'Test Suite (Critical)',
      description: 'Run critical test subset',
      command: 'npm run test:critical',
      expectedResult: 'All critical tests passing',
    },
  ];

  // Rollback of rollback
  plan.rollbackOfRollback = `If this rollback causes issues, re-apply original change using documented procedure in logs/${request.id}.md`;

  return plan;
}

/**
 * Git commit rollback steps
 */
function generateGitRollbackSteps(request: RollbackRequest): RollbackStep[] {
  return [
    {
      stepNumber: 1,
      description: 'Check current commit',
      command: 'git log -1 --oneline',
      expectedResult: 'Current commit hash displayed',
      verificationCommand: 'git log -1 --oneline',
      estimatedDuration: '1',
    },
    {
      stepNumber: 2,
      description: 'Create safety branch',
      command: `git branch rollback-safety-${request.id}`,
      expectedResult: 'Safety branch created',
      verificationCommand: `git branch | grep rollback-safety-${request.id}`,
      estimatedDuration: '1',
    },
    {
      stepNumber: 3,
      description: 'Revert to target state',
      command: `git revert ${request.targetState} --no-commit`,
      expectedResult: 'Changes reverted in working directory',
      verificationCommand: 'git status',
      estimatedDuration: '2',
    },
    {
      stepNumber: 4,
      description: 'Review revert changes',
      command: 'git diff --cached',
      expectedResult: 'Revert changes shown',
      verificationCommand: 'git diff --cached | wc -l',
      estimatedDuration: '5',
    },
    {
      stepNumber: 5,
      description: 'Commit revert',
      command: `git commit -m "revert: ${request.reason}

Rollback ID: ${request.id}
Original commit: ${request.currentState}
Reason: ${request.reason}
Approved by: [Supervisor will fill]"`,
      expectedResult: 'Revert committed',
      verificationCommand: 'git log -1 --oneline',
      estimatedDuration: '1',
    },
  ];
}

/**
 * Database migration rollback steps
 */
function generateDatabaseRollbackSteps(request: RollbackRequest): RollbackStep[] {
  return [
    {
      stepNumber: 1,
      description: 'Create database backup',
      command: 'pg_dump -U postgres myapp > backups/pre-rollback-$(date +%Y%m%d-%H%M%S).sql',
      expectedResult: 'Backup file created',
      verificationCommand: 'ls -lh backups/ | tail -1',
      estimatedDuration: '30',
    },
    {
      stepNumber: 2,
      description: 'Check current migration status',
      command: 'npm run migrate:status',
      expectedResult: 'Current migration version shown',
      estimatedDuration: '2',
    },
    {
      stepNumber: 3,
      description: 'Run migration rollback',
      command: `npm run migrate:down -- ${request.targetState}`,
      expectedResult: 'Migration rolled back successfully',
      verificationCommand: 'npm run migrate:status',
      estimatedDuration: '10',
    },
    {
      stepNumber: 4,
      description: 'Verify data integrity',
      command: 'npm run db:verify',
      expectedResult: 'Data integrity checks pass',
      estimatedDuration: '5',
    },
  ];
}

/**
 * Deployment rollback steps
 */
function generateDeploymentRollbackSteps(request: RollbackRequest): RollbackStep[] {
  return [
    {
      stepNumber: 1,
      description: 'Check current deployment',
      command: 'kubectl get deployment myapp -o jsonpath="{.spec.template.spec.containers[0].image}"',
      expectedResult: 'Current image tag shown',
      estimatedDuration: '2',
    },
    {
      stepNumber: 2,
      description: 'Rollback Kubernetes deployment',
      command: 'kubectl rollout undo deployment/myapp',
      expectedResult: 'Rollback initiated',
      verificationCommand: 'kubectl rollout status deployment/myapp',
      estimatedDuration: '30',
    },
    {
      stepNumber: 3,
      description: 'Verify pod health',
      command: 'kubectl get pods -l app=myapp',
      expectedResult: 'All pods in Running state',
      estimatedDuration: '10',
    },
    {
      stepNumber: 4,
      description: 'Check application logs',
      command: 'kubectl logs -l app=myapp --tail=50 | grep -i error',
      expectedResult: 'No critical errors in logs',
      estimatedDuration: '5',
    },
  ];
}

/**
 * Configuration rollback steps
 */
function generateConfigRollbackSteps(request: RollbackRequest): RollbackStep[] {
  return [
    {
      stepNumber: 1,
      description: 'Backup current configuration',
      command: `cp ${request.currentState} backups/config-backup-$(date +%Y%m%d-%H%M%S).json`,
      expectedResult: 'Configuration backed up',
      estimatedDuration: '1',
    },
    {
      stepNumber: 2,
      description: 'Restore previous configuration',
      command: `git checkout ${request.targetState} -- ${request.currentState}`,
      expectedResult: 'Configuration restored',
      estimatedDuration: '1',
    },
    {
      stepNumber: 3,
      description: 'Restart affected services',
      command: 'docker compose restart',
      expectedResult: 'Services restarted successfully',
      verificationCommand: 'docker compose ps',
      estimatedDuration: '15',
    },
  ];
}

/**
 * Dependency rollback steps
 */
function generateDependencyRollbackSteps(request: RollbackRequest): RollbackStep[] {
  return [
    {
      stepNumber: 1,
      description: 'Backup package lock',
      command: 'cp package-lock.json backups/package-lock-backup-$(date +%Y%m%d-%H%M%S).json',
      expectedResult: 'Package lock backed up',
      estimatedDuration: '1',
    },
    {
      stepNumber: 2,
      description: 'Restore previous package versions',
      command: `git checkout ${request.targetState} -- package.json package-lock.json`,
      expectedResult: 'Package files restored',
      estimatedDuration: '1',
    },
    {
      stepNumber: 3,
      description: 'Clean node_modules',
      command: 'rm -rf node_modules',
      expectedResult: 'node_modules removed',
      estimatedDuration: '5',
    },
    {
      stepNumber: 4,
      description: 'Reinstall dependencies',
      command: 'npm ci',
      expectedResult: 'Dependencies installed from lockfile',
      estimatedDuration: '60',
    },
    {
      stepNumber: 5,
      description: 'Run test suite',
      command: 'npm test',
      expectedResult: 'All tests passing',
      estimatedDuration: '30',
    },
  ];
}

/**
 * Log rollback request for supervisor review
 */
export function logRollbackRequest(request: RollbackRequest, plan: RollbackPlan): string {
  const logDir = path.join(process.cwd(), 'logs', 'rollbacks');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logPath = path.join(logDir, `${request.id}.md`);

  const logContent = `# Rollback Request: ${request.id}

**Status:** PENDING APPROVAL
**Created:** ${request.timestamp}
**Requested By:** ${request.requestedBy} agent
**Severity:** ${request.severity.toUpperCase()}

---

## Summary

**Reason:** ${request.reason}

**Type:** ${request.type}
**Affected Systems:** ${request.affectedSystems.join(', ')}
**Estimated Downtime:** ${request.estimatedDowntime}

---

## Current vs. Target State

**Current State:**
\`\`\`
${request.currentState}
\`\`\`

**Target State (rollback to):**
\`\`\`
${request.targetState}
\`\`\`

---

## Risk Assessment

${request.riskAssessment}

---

## Pre-Execution Checks

${plan.preChecks.map((check, i) => `
### ${i + 1}. ${check.name}
- **Description:** ${check.description}
- **Command:** \`${check.command || 'Manual check'}\`
- **Expected:** ${check.expectedResult}
- **Status:** [ ] Not checked
`).join('\n')}

---

## Rollback Steps

${plan.steps.map(step => `
### Step ${step.stepNumber}: ${step.description}

${step.command ? `**Command:**
\`\`\`bash
${step.command}
\`\`\`` : ''}

${step.manualAction ? `**Manual Action:**
${step.manualAction}` : ''}

**Expected Result:** ${step.expectedResult}

${step.verificationCommand ? `**Verification:**
\`\`\`bash
${step.verificationCommand}
\`\`\`` : ''}

**Estimated Duration:** ${step.estimatedDuration} seconds

**Status:** [ ] Not executed
`).join('\n')}

---

## Post-Execution Checks

${plan.postChecks.map((check, i) => `
### ${i + 1}. ${check.name}
- **Description:** ${check.description}
- **Command:** \`${check.command || 'Manual check'}\`
- **Expected:** ${check.expectedResult}
- **Status:** [ ] Not checked
`).join('\n')}

---

## Rollback of Rollback

${plan.rollbackOfRollback}

---

## Approval

⚠️ **${request.approvalRequired ? 'APPROVAL REQUIRED' : 'Low-risk rollback'}**

**Supervisor Decision:** [ ] Pending

**Approved By:** _______________
**Approval Time:** _______________

---

## Execution Log

_This section will be filled during execution_

**Executed At:** _______________
**Executed By:** _______________
**Total Duration:** _______________
**Success:** [ ] Yes [ ] No

**Notes:**

`;

  fs.writeFileSync(logPath, logContent, 'utf-8');

  return logPath;
}

/**
 * Log rollback result
 */
export function logRollbackResult(result: RollbackResult): void {
  const logDir = path.join(process.cwd(), 'logs', 'rollbacks');
  const logPath = path.join(logDir, `${result.request.id}.md`);

  // Append result to existing log
  let content = fs.readFileSync(logPath, 'utf-8');

  // Update status
  content = content.replace('**Status:** PENDING APPROVAL', `**Status:** ${result.success ? 'COMPLETED ✅' : 'FAILED ❌'}`);
  content = content.replace('**Executed At:** _______________', `**Executed At:** ${result.executedAt}`);
  content = content.replace('**Executed By:** _______________', `**Executed By:** ${result.executedBy}`);
  content = content.replace('**Total Duration:** _______________', `**Total Duration:** ${result.totalDuration} seconds`);

  // Add execution details
  const executionLog = `

---

## Detailed Execution Log

${result.steps.map(step => `
### Step ${step.stepNumber}: ${step.description}

- **Executed:** ${step.executed ? 'Yes' : 'No'}
- **Success:** ${step.success ? '✅' : '❌'}
- **Duration:** ${step.duration}s

${step.output ? `**Output:**
\`\`\`
${step.output.slice(0, 500)}${step.output.length > 500 ? '...' : ''}
\`\`\`` : ''}

${step.error ? `**Error:**
\`\`\`
${step.error}
\`\`\`` : ''}
`).join('\n')}

---

## Post-Checks Result: ${result.postChecksStatus.toUpperCase()}

${result.errors.length > 0 ? `
### Errors Encountered:
${result.errors.map((err, i) => `${i + 1}. ${err}`).join('\n')}
` : ''}

---

## Conclusion

${result.success
    ? '✅ Rollback completed successfully. All systems operational.'
    : '❌ Rollback encountered errors. Manual intervention required.'}

**Approved By:** ${result.approvedBy}
**Supervisor:** ${result.executedBy}
`;

  content += executionLog;

  fs.writeFileSync(logPath, content, 'utf-8');

  // Also log to errors directory if failed
  if (!result.success) {
    const errorDir = path.join(process.cwd(), 'logs', 'errors');
    if (!fs.existsSync(errorDir)) {
      fs.mkdirSync(errorDir, { recursive: true });
    }

    const errorLogPath = path.join(errorDir, `${result.request.id}-ERROR.md`);
    fs.writeFileSync(errorLogPath, content, 'utf-8');
  }
}

/**
 * Example usage for Supervisor
 */
export function printSupervisorInstructions(): void {
  console.log(`
═══════════════════════════════════════════════════════════════
🔄 ROLLBACK MANAGER - SUPERVISOR INSTRUCTIONS
═══════════════════════════════════════════════════════════════

When a specialist agent requests a rollback:

1. Agent creates rollback request:
   \`\`\`typescript
   const request = createRollbackRequest({
     type: 'git-commit',
     severity: 'high',
     requestedBy: 'backend',
     reason: 'Authentication bug causing login failures',
     affectedSystems: ['API', 'Database'],
     currentState: 'commit abc123',
     targetState: 'commit def456',
     estimatedDowntime: '<5 minutes',
     riskAssessment: 'Low risk - well-tested previous state',
   });
   \`\`\`

2. Generate rollback plan:
   \`\`\`typescript
   const plan = generateRollbackPlan(request);
   \`\`\`

3. Log request for review:
   \`\`\`typescript
   const logPath = logRollbackRequest(request, plan);
   console.log(\`Rollback request logged: \${logPath}\`);
   \`\`\`

4. Supervisor reviews log and asks user:
   \`\`\`
   ⚠️ ROLLBACK REQUEST: \${request.id}

   Reason: \${request.reason}
   Severity: \${request.severity}
   Downtime: \${request.estimatedDowntime}

   Review full plan: \${logPath}

   Approve rollback? (Reply "yes" to proceed)
   \`\`\`

5. After "yes", supervisor executes plan step-by-step

6. Log results:
   \`\`\`typescript
   logRollbackResult(result);
   \`\`\`

═══════════════════════════════════════════════════════════════

All rollback logs stored in: logs/rollbacks/
All error logs stored in: logs/errors/

═══════════════════════════════════════════════════════════════
`);
}
