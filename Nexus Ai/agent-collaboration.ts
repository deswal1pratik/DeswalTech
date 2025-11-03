/**
 * Agent Collaboration Protocol
 *
 * Enables cross-domain expertise consultation while maintaining:
 * - Clear workflow continuation and hand-offs
 * - No conflicts or confusion between agents
 * - Progress documentation at every step
 * - Supervisor orchestration and oversight
 * - Better cross-domain solutions
 * - Reduced back-and-forth iterations
 *
 * CRITICAL: This is NOT parallel execution. Agents consult peers under supervisor guidance.
 *
 * @version 4.1.0
 */

import fs from 'fs';
import path from 'path';
import { TaskOutput } from './schemas';

/**
 * Consultation request types
 */
export type ConsultationType =
  | 'architecture-review'     // Architect reviews design
  | 'security-review'         // Security reviews implementation
  | 'performance-review'      // DevOps reviews performance
  | 'ui-ux-guidance'          // Frontend advises on UX
  | 'data-modeling'           // Architect advises on database design
  | 'testing-strategy'        // QA advises on test approach
  | 'deployment-strategy'     // DevOps advises on deployment
  | 'api-design';             // Backend advises on API contracts

/**
 * Consultation request
 */
export interface ConsultationRequest {
  id: string; // Format: CONSULT-YYYYMMDD-HHMMSS
  timestamp: string;
  requestedBy: string; // Agent name (e.g., 'backend')
  consultant: string; // Agent to consult (e.g., 'frontend')
  type: ConsultationType;
  context: {
    taskId: string;
    currentProgress: string;
    problemStatement: string;
    attemptedSolutions?: string[];
    constraints?: string[];
  };
  question: string; // Specific question for consultant
  urgency: 'low' | 'medium' | 'high';
  expectedResponseTime: string; // e.g., "immediate", "within 1 hour"
}

/**
 * Consultation response
 */
export interface ConsultationResponse {
  consultationId: string;
  timestamp: string;
  consultant: string;
  recommendation: string;
  reasoning: string;
  alternativeApproaches?: string[];
  risks?: string[];
  additionalConsiderations?: string[];
  followUpNeeded: boolean;
  confidence: 'low' | 'medium' | 'high'; // Consultant's confidence in recommendation
}

/**
 * Collaboration session
 */
export interface CollaborationSession {
  id: string; // Format: COLLAB-YYYYMMDD-HHMMSS
  taskId: string;
  primaryAgent: string; // Agent responsible for task
  participants: string[]; // All agents involved
  consultations: Array<{
    request: ConsultationRequest;
    response: ConsultationResponse;
  }>;
  status: 'active' | 'completed' | 'blocked';
  startTime: string;
  endTime?: string;
  outcome: string;
  lessonsLearned: string[];
}

/**
 * Create consultation request
 */
export function createConsultationRequest(params: {
  requestedBy: string;
  consultant: string;
  type: ConsultationType;
  taskId: string;
  currentProgress: string;
  problemStatement: string;
  question: string;
  urgency?: 'low' | 'medium' | 'high';
  attemptedSolutions?: string[];
  constraints?: string[];
}): ConsultationRequest {
  const timestamp = new Date().toISOString();
  const id = `CONSULT-${timestamp.slice(0, 10).replace(/-/g, '')}-${timestamp.slice(11, 19).replace(/:/g, '')}`;

  return {
    id,
    timestamp,
    requestedBy: params.requestedBy,
    consultant: params.consultant,
    type: params.type,
    context: {
      taskId: params.taskId,
      currentProgress: params.currentProgress,
      problemStatement: params.problemStatement,
      attemptedSolutions: params.attemptedSolutions,
      constraints: params.constraints,
    },
    question: params.question,
    urgency: params.urgency || 'medium',
    expectedResponseTime: params.urgency === 'high' ? 'immediate' : 'within 1 hour',
  };
}

/**
 * Validate consultation is appropriate (prevent misuse)
 */
export function validateConsultation(request: ConsultationRequest): {
  valid: boolean;
  reason?: string;
} {
  // 1. Check if consultation type matches consultant expertise
  const validCombinations: Record<ConsultationType, string[]> = {
    'architecture-review': ['architect'],
    'security-review': ['security'],
    'performance-review': ['devops'],
    'ui-ux-guidance': ['frontend'],
    'data-modeling': ['architect', 'backend'],
    'testing-strategy': ['qa-tester'],
    'deployment-strategy': ['devops'],
    'api-design': ['backend', 'architect'],
  };

  if (!validCombinations[request.type].includes(request.consultant)) {
    return {
      valid: false,
      reason: `Consultation type "${request.type}" requires ${validCombinations[request.type].join(' or ')}, not ${request.consultant}`,
    };
  }

  // 2. Check requestor is not consulting themselves
  if (request.requestedBy === request.consultant) {
    return {
      valid: false,
      reason: 'Agent cannot consult itself',
    };
  }

  // 3. Check question is specific enough
  if (request.question.length < 20) {
    return {
      valid: false,
      reason: 'Question must be specific (at least 20 characters)',
    };
  }

  // 4. Check context is provided
  if (!request.context.problemStatement || request.context.problemStatement.length < 20) {
    return {
      valid: false,
      reason: 'Problem statement must be clear and specific',
    };
  }

  return { valid: true };
}

/**
 * Log consultation request for supervisor review
 */
export function logConsultationRequest(request: ConsultationRequest): string {
  const logDir = path.join(process.cwd(), 'logs', 'collaborations');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logPath = path.join(logDir, `${request.id}.md`);

  const logContent = `# Agent Consultation: ${request.id}

**Status:** PENDING RESPONSE
**Created:** ${request.timestamp}
**Urgency:** ${request.urgency.toUpperCase()}

---

## Consultation Details

**Requested By:** ${request.requestedBy} agent
**Consultant:** ${request.consultant} agent
**Type:** ${request.type}

**Task ID:** ${request.context.taskId}

---

## Context

### Current Progress
${request.context.currentProgress}

### Problem Statement
${request.context.problemStatement}

${request.context.attemptedSolutions ? `### Attempted Solutions
${request.context.attemptedSolutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : ''}

${request.context.constraints ? `### Constraints
${request.context.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}` : ''}

---

## Question for ${request.consultant.toUpperCase()}

${request.question}

**Expected Response Time:** ${request.expectedResponseTime}

---

## Response

_This section will be filled by the ${request.consultant} agent_

**Recommendation:**

**Reasoning:**

**Alternative Approaches:**

**Risks:**

**Additional Considerations:**

**Follow-up Needed:** [ ] Yes [ ] No

**Confidence Level:** [ ] Low [ ] Medium [ ] High

---

## Supervisor Notes

**Approved:** [ ] Yes [ ] No
**Supervisor:** _______________
**Notes:**

`;

  fs.writeFileSync(logPath, logContent, 'utf-8');

  return logPath;
}

/**
 * Log consultation response
 */
export function logConsultationResponse(
  request: ConsultationRequest,
  response: ConsultationResponse
): void {
  const logPath = path.join(process.cwd(), 'logs', 'collaborations', `${request.id}.md`);

  let content = fs.readFileSync(logPath, 'utf-8');

  // Update status
  content = content.replace('**Status:** PENDING RESPONSE', '**Status:** COMPLETED ✅');

  // Add response
  const responseSection = `

---

## ${response.consultant.toUpperCase()} RESPONSE

**Timestamp:** ${response.timestamp}

### Recommendation

${response.recommendation}

### Reasoning

${response.reasoning}

${response.alternativeApproaches ? `### Alternative Approaches

${response.alternativeApproaches.map((a, i) => `${i + 1}. ${a}`).join('\n')}` : ''}

${response.risks ? `### Risks

${response.risks.map((r, i) => `${i + 1}. ${r}`).join('\n')}` : ''}

${response.additionalConsiderations ? `### Additional Considerations

${response.additionalConsiderations.map((c, i) => `${i + 1}. ${c}`).join('\n')}` : ''}

**Follow-up Needed:** ${response.followUpNeeded ? 'Yes' : 'No'}

**Confidence Level:** ${response.confidence.toUpperCase()}

---

## Implementation by ${request.requestedBy.toUpperCase()}

_This section will be filled after implementing the recommendation_

**Implemented:** [ ] Yes [ ] No [ ] Partially

**Changes Made:**

**Result:**

**Lessons Learned:**
`;

  content += responseSection;

  fs.writeFileSync(logPath, content, 'utf-8');
}

/**
 * Create collaboration session
 */
export function createCollaborationSession(params: {
  taskId: string;
  primaryAgent: string;
}): CollaborationSession {
  const timestamp = new Date().toISOString();
  const id = `COLLAB-${timestamp.slice(0, 10).replace(/-/g, '')}-${timestamp.slice(11, 19).replace(/:/g, '')}`;

  return {
    id,
    taskId: params.taskId,
    primaryAgent: params.primaryAgent,
    participants: [params.primaryAgent],
    consultations: [],
    status: 'active',
    startTime: timestamp,
    outcome: '',
    lessonsLearned: [],
  };
}

/**
 * Common consultation scenarios with templates
 */
export const CONSULTATION_TEMPLATES = {
  /**
   * Backend consults Frontend about real-time updates
   */
  backendToFrontend: {
    type: 'ui-ux-guidance' as ConsultationType,
    questionTemplate: 'What is the best way to handle [feature] in React? Context: [context]',
    example: `What is the best way to handle real-time notifications in React?

Context:
- Building a notification system for user activities
- Backend sends events via WebSocket
- Need to show toast notifications without disrupting UX
- Must support notification history and read/unread states

Constraints:
- Must work with React 19 Server Components
- Should not cause unnecessary re-renders
- Must be accessible (screen readers)`,
  },

  /**
   * Frontend consults Backend about API design
   */
  frontendToBackend: {
    type: 'api-design' as ConsultationType,
    questionTemplate: 'How should the API be structured for [feature]? UI needs: [needs]',
    example: `How should the API be structured for user search with filters?

UI needs:
- Real-time search as user types (debounced)
- Multiple filters (name, email, role, date range)
- Pagination (infinite scroll)
- Sort by multiple columns
- Export results to CSV

What's the optimal API design considering performance and UX?`,
  },

  /**
   * Any agent consults Security about sensitive data
   */
  anyToSecurity: {
    type: 'security-review' as ConsultationType,
    questionTemplate: 'Is [implementation] secure? Concerns: [concerns]',
    example: `Is this password reset implementation secure?

Implementation:
- Generate random 32-byte token
- Store bcrypt hash in database with expiry (1 hour)
- Send reset link via email
- Validate token, check expiry, allow one-time use

Concerns:
- Is bcrypt appropriate for tokens?
- Should we rate-limit reset requests?
- How to prevent token enumeration?`,
  },

  /**
   * Backend consults Architect about data modeling
   */
  backendToArchitect: {
    type: 'data-modeling' as ConsultationType,
    questionTemplate: 'What is the best database schema for [feature]? Requirements: [requirements]',
    example: `What is the best database schema for multi-tenant SaaS?

Requirements:
- Strict data isolation between tenants
- Shared authentication service
- Some tenants need custom fields
- Must support 10,000+ tenants
- Query performance critical

Should we use: shared schema with tenant_id? Separate schemas? Separate databases?`,
  },

  /**
   * Any agent consults DevOps about deployment
   */
  anyToDevOps: {
    type: 'deployment-strategy' as ConsultationType,
    questionTemplate: 'How should we deploy [feature] to production? Concerns: [concerns]',
    example: `How should we deploy database schema changes to production?

Schema changes:
- Adding 3 new columns to users table (5M rows)
- Creating 2 new tables for notifications
- Adding indexes on existing columns

Concerns:
- Zero downtime required
- Migration could take 10+ minutes
- How to handle rollback if issues occur?`,
  },
};

/**
 * Supervisor instructions for managing collaborations
 */
export function printSupervisorCollaborationGuide(): void {
  console.log(`
═══════════════════════════════════════════════════════════════
🤝 AGENT COLLABORATION PROTOCOL - SUPERVISOR GUIDE
═══════════════════════════════════════════════════════════════

## When Agents Should Collaborate

Collaboration is appropriate when:

1. **Cross-Domain Complexity**
   - Backend needs UI/UX guidance from Frontend
   - Frontend needs API design guidance from Backend
   - Any agent needs security review from Security

2. **Specialized Expertise Needed**
   - DevOps input on deployment strategy
   - Architect input on database design
   - QA input on testing approach

3. **Risk Mitigation**
   - Security review before implementing auth changes
   - Performance review before deploying at scale
   - Architecture review before major refactoring

## When Collaboration is NOT Appropriate

❌ DO NOT allow collaboration for:

1. Agent trying to delegate their responsibility
2. Trivial questions answerable by documentation
3. Avoid doing the work themselves
4. Parallel execution (only one agent works at a time)

═══════════════════════════════════════════════════════════════

## Collaboration Workflow

### Step 1: Agent Requests Consultation

Agent creates consultation request:

\`\`\`typescript
const request = createConsultationRequest({
  requestedBy: 'backend',
  consultant: 'frontend',
  type: 'ui-ux-guidance',
  taskId: 'TASK-001',
  currentProgress: 'Implemented WebSocket server for real-time updates',
  problemStatement: 'Need to decide best React pattern for displaying real-time notifications',
  question: 'What is the best way to handle real-time notifications in React 19 with Server Components?',
  urgency: 'medium',
  attemptedSolutions: ['Tried useEffect with polling', 'Considered Server-Sent Events'],
  constraints: ['Must support Server Components', 'No client-side polling'],
});
\`\`\`

### Step 2: Supervisor Validates

Supervisor validates the consultation:

\`\`\`typescript
const validation = validateConsultation(request);

if (!validation.valid) {
  // Reject and explain why
  console.log(\`❌ Invalid consultation: \${validation.reason}\`);
  return;
}
\`\`\`

### Step 3: Supervisor Logs Request

\`\`\`typescript
const logPath = logConsultationRequest(request);
console.log(\`📋 Consultation logged: \${logPath}\`);
\`\`\`

### Step 4: Supervisor Invokes Consultant

Supervisor presents context to consultant agent:

\`\`\`
You are the {consultant} agent.

The {requestedBy} agent has requested your expertise:

CONSULTATION REQUEST: {request.id}
TYPE: {request.type}
URGENCY: {request.urgency}

CONTEXT:
{request.context.problemStatement}

QUESTION:
{request.question}

Please provide:
1. Your recommendation (specific, actionable)
2. Reasoning (why this approach is best)
3. Alternative approaches (if any)
4. Risks (what could go wrong)
5. Additional considerations

Be honest about your confidence level.
\`\`\`

### Step 5: Consultant Responds

Consultant provides structured response:

\`\`\`typescript
const response: ConsultationResponse = {
  consultationId: request.id,
  timestamp: new Date().toISOString(),
  consultant: 'frontend',
  recommendation: 'Use React Context + useEffect with WebSocket connection...',
  reasoning: 'Server Components cannot maintain WebSocket connections...',
  alternativeApproaches: ['Server-Sent Events with EventSource', 'HTTP polling with SWR'],
  risks: ['WebSocket disconnections need retry logic', 'State management complexity'],
  additionalConsiderations: ['Consider notification batching', 'Add offline support'],
  followUpNeeded: false,
  confidence: 'high',
};
\`\`\`

### Step 6: Supervisor Logs Response

\`\`\`typescript
logConsultationResponse(request, response);
\`\`\`

### Step 7: Original Agent Implements

Original agent implements recommendation and documents outcome:

\`\`\`
IMPLEMENTATION RESULT:

Implemented: Yes
Changes Made:
- Created NotificationContext with WebSocket connection
- Added useNotifications hook for components
- Implemented retry logic with exponential backoff

Result: Working perfectly, notifications appear in real-time

Lessons Learned:
- Context API works well for global WebSocket state
- Retry logic is critical for connection stability
\`\`\`

═══════════════════════════════════════════════════════════════

## Conflict Prevention Rules

1. **One Primary Agent per Task**
   - Only one agent is responsible for implementation
   - Consultants provide advice only, never code

2. **Clear Hand-offs**
   - If consultant suggests major changes, return to Supervisor
   - Supervisor decides if task should be reassigned

3. **Documentation is Mandatory**
   - Every consultation logged in logs/collaborations/
   - Implementation results documented
   - Lessons learned captured

4. **Supervisor Oversight**
   - Supervisor approves all consultations
   - Supervisor ensures no duplicate work
   - Supervisor maintains task ownership clarity

5. **Workflow Continuation**
   - Original agent continues after consultation
   - No parallel execution
   - Wait-for-yes protocol maintained

═══════════════════════════════════════════════════════════════

## Example: Full Collaboration Session

TASK: Implement JWT authentication with refresh tokens

PRIMARY AGENT: Backend

CONSULTATION 1:
  Backend → Security: "Is this JWT refresh token strategy secure?"
  Security Response: "Add token rotation and family detection"

CONSULTATION 2:
  Backend → Frontend: "How should frontend handle token refresh?"
  Frontend Response: "Use axios interceptors with queue"

CONSULTATION 3:
  Backend → DevOps: "Best way to deploy auth changes without downtime?"
  DevOps Response: "Blue-green deployment with backward compatibility"

OUTCOME:
  Secure, user-friendly authentication system deployed without issues

LESSONS LEARNED:
  - Token rotation prevents replay attacks
  - Frontend interceptors provide seamless UX
  - Backward compatibility critical for zero-downtime

═══════════════════════════════════════════════════════════════

All collaboration logs stored in: logs/collaborations/

═══════════════════════════════════════════════════════════════
`);
}

/**
 * Export for use in other modules
 */
export {
  ConsultationType,
  ConsultationRequest,
  ConsultationResponse,
  CollaborationSession,
};
