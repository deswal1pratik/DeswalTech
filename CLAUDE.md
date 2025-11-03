# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

| Task | Command |
|------|---------|
| Start infrastructure | `cd Infrastructure && ./start-services.sh` |
| Stop infrastructure | `cd Infrastructure && ./stop-services.sh` |
| Check service status | `cd Infrastructure && docker compose ps` |
| Validate skills | `cd "Nexus Ai" && npx tsx skill-validator.ts` |
| Check test coverage | `cd "Nexus Ai" && npx tsx coverage-enforcer.ts` |
| Development server | `npm run dev` |
| Build production | `npm run build` |
| Run tests | `npm test` |
| Lint code | `npm run lint` or `npm run lint:fix` |
| Start project | `/agent supervisor` → Provide requirements |

## Overview

**DeswalTech v4.1.1 (Nexus)** - The world's most advanced AI multi-agent system for enterprise-grade full-stack applications.

**Core Components**:
- 7 specialized agents with cross-domain collaboration
- Agent skills with quality validation
- "Wait-for-yes" execution protocol (human oversight)
- Strategic rollback management
- Industry-standard 95% test coverage enforcement
- Type-safe orchestration with Vercel AI SDK + Zod
- Durable execution with Temporal workflows

**Operational System**: `Nexus Ai/nexus-ai-team/` - 7 agents (`agents/`) + reusable skills (`skills/`)

## Core Architecture

### PBVS Project Lifecycle (Strict Workflow)

| Phase | Action | Output |
|-------|--------|--------|
| **PLAN** | Socratic discovery → PRD creation | RPG-structured PRD |
| **BUILD** | Task execution (one at a time) | Working code |
| **VALIDATE** | 3-level quality gates + 95% coverage | Verified features |
| **SCALE** | Production deployment | Live system |

### Critical Execution Protocol

**"Wait-for-Yes" Loop** (NON-NEGOTIABLE):
1. Agent completes ONE sub-task
2. STOPS and waits for user approval
3. User responds "yes" → commit and continue
4. Hand back to supervisor for next task

### 7 Expert Agents

| Agent | Start With | Responsibility |
|-------|------------|----------------|
| **supervisor** ⭐ | `/agent supervisor` | **START HERE** - Orchestration, quality guardian, collaboration facilitator |
| **architect** | `/agent architect` | Database schema, system design, API contracts |
| **backend** | `/agent backend` | APIs, auth, business logic, database ops |
| **frontend** | `/agent frontend` | React/Next.js UI, components, styling |
| **qa-tester** | `/agent qa-tester` | Unit, integration, E2E, load testing + 95% coverage enforcement |
| **devops** | `/agent devops` | Docker, K8s, CI/CD, deployment + rollback management |
| **security** | `/agent security` | Security audits, OWASP, vulnerability scans |

**Agent Skills** (`skills/`):
- `core/` - Delegation, task management
- `workflow/` - PRD creation, task parsing, task execution

### Agent Collaboration Protocol (v4.1.1)

**Enables cross-domain expertise without conflicts:**

| Scenario | Primary Agent | Consultant | Purpose |
|----------|---------------|------------|---------|
| Real-time UI patterns | Backend | Frontend | React patterns for WebSocket/SSE |
| API design for UX | Frontend | Backend/Architect | API contracts optimized for UI |
| Security review | Any | Security | Review implementation security |
| Performance review | Any | DevOps | Review performance implications |
| Data modeling | Backend | Architect | Database schema optimization |

**Workflow**:
1. Agent requests consultation via supervisor
2. Supervisor validates and logs request (`logs/collaborations/`)
3. Supervisor invokes consultant agent with full context
4. Consultant provides: recommendation, reasoning, alternatives, risks, confidence level
5. Supervisor logs response
6. Original agent implements with guidance
7. Agent documents implementation result and lessons learned

**Rules**: One agent works at a time • Clear task ownership • Consultants advise only (don't implement) • Supervisor approves all consultations • All interactions documented • No parallel execution

### Temporal Workflow Engine

Pre-configured for durable workflow execution:
- **Purpose**: Orchestrate long-running, reliable multi-agent workflows
- **Use Cases**: Multi-day projects, agent coordination, retry logic, state management
- **Access**: UI at `localhost:8080`, gRPC at `localhost:7233`
- **Persistence**: PostgreSQL-backed for workflow state
- **Integration**: Type-safe workflows with Vercel AI SDK

## Technology Stack (2025 Standards)

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js 20 LTS, TypeScript 5.3+ (strict), Fastify 4.x \| NestJS 10.x, PostgreSQL 16+ (pgvector) |
| **Frontend** | Next.js 15+ (App Router), React 19+ (Server Components), TailwindCSS 4+ + shadcn/ui |
| **Security** | **Argon2id** (NOT bcrypt), JWTs (15min access, 7day refresh), AES-256-GCM, TLS 1.3 |
| **DevOps** | Docker 25+, Kubernetes 1.29+, GitHub Actions, ArgoCD (GitOps) |
| **Quality** | OWASP Top 10 2025, NIST SSDF, 95% coverage (critical code), Semgrep, Trivy |
| **Workflows** | Temporal (durable execution), PostgreSQL-backed state persistence |
| **Orchestration** | Vercel AI SDK 5.0+, Zod validation, batch processing (50% cost savings) |

## Commands

### Development
```bash
npm run dev           # ts-node development server
npm run watch         # TypeScript watch mode
npm run build         # Build to dist/ (cleans first)
npm start             # Run compiled code
```

### Quality & Testing
```bash
npm test              # Jest test suite
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix linting issues
npm run verify        # Package verification (pre-publish)
```

### Quality Enforcement (v4.1.1)
```bash
cd "Nexus Ai"
npx tsx skill-validator.ts     # Validate agent skills, detect conflicts
npx tsx coverage-enforcer.ts   # Enforce 95% test coverage for critical code
```

### Infrastructure Services
```bash
cd Infrastructure
./start-services.sh   # Start all services
./stop-services.sh    # Stop all services
./restart-services.sh # Restart services
docker compose ps     # Service status
docker compose logs -f # View logs
```

**Service Endpoints** (localhost, development only):
- PostgreSQL: `:5432` (postgres/postgres)
- Redis: `:6379` (password: redispass)
- MinIO API: `:9000`, Console: `:9001` (minioadmin/minioadmin123)
- pgAdmin: `:5050` (admin@deswal.tech/admin123)
- Prometheus: `:9090`
- Grafana: `:3001` (admin/admin123)
- Temporal UI: `:8080` (workflow visualization)
- Temporal gRPC: `:7233` (workflow execution)

## MCP Integration

20+ Model Context Protocol servers configured in `mcp.json`. Simply mention them in requirements (e.g., "Deploy to Vercel", "Use Stripe for payments").

**Key Services**:
- **Design/UI**: Figma, shadcn, magicui
- **Development**: Ref (patterns), 21st-dev, Expo
- **Testing**: Playwright
- **Deployment**: Vercel, GitHub
- **Database**: Supabase, supadata
- **Payments**: Stripe
- **Communication**: Resend, Twilio
- **Code Quality**: Semgrep
- **Project Mgmt**: Linear
- **AI Services**: Perplexity, Parallel AI, Sudo
- **Cloud**: AWS (S3, Lambda, EC2)

### ByteRover MCP (CRITICAL - Always Use)

**MUST use `byterover-store-knowledge` after**:
- Learning patterns/APIs/architectural decisions
- Solving errors or discovering debugging techniques
- Finding reusable code patterns/utilities
- Completing significant tasks
- Agent collaborations (store lessons learned)

**MUST use `byterover-retrieve-knowledge` before**:
- Starting new tasks or implementations
- Making architectural decisions
- Requesting agent consultations
- Debugging issues
- Working with unfamiliar codebase areas

## Quality Standards

### 3-Level Quality Gates

| Level | Timing | Checks |
|-------|--------|--------|
| **L1: Automated** | Real-time | ESLint, 95% coverage (critical), Semgrep, Trivy, performance budgets |
| **L2: Integration** | Daily | E2E tests, API contracts, cross-component integration |
| **L3: Business** | Pre-launch | Feature completeness, UX validation, stakeholder approval |

### Industry-Standard Test Coverage (v4.1.1)

**Enforced via** `coverage-enforcer.ts` - Honest, real-world measurement (no false positives)

| Code Category | Files | Statements | Branches | Functions | Lines |
|---------------|-------|------------|----------|-----------|-------|
| **Critical** | auth, payment, security, encryption | 95% | 90% | 95% | 95% |
| **High** | business logic, APIs, services | 90% | 85% | 90% | 90% |
| **Standard** | application code | 85% | 80% | 85% | 85% |
| **Utilities** | helpers, utils, config | 80% | 75% | 80% | 80% |

**Auto-Classification**: Files automatically categorized by name patterns (auth*, payment*, service*, etc.)

**Enforcement**: QA-Tester runs coverage enforcer after tests. Task completion blocked until thresholds met. Report shows uncovered lines for immediate action.

**Industry Standards**: Based on Google (80%+), Microsoft (90%+), Stripe (95%+ for payments)

### Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| API Response (p95) | <100ms | k6 |
| DB Query (p95) | <50ms | Query profiling |
| Page Load (LCP) | <2.5s | Lighthouse |
| Lighthouse Score | >95 | CI/CD |
| Uptime | 99.9% | Prometheus |

## Strategic Rollback Management (v4.1.1)

**Supervisor-orchestrated rollback system** with full documentation and error logging.

**Supported Types**: Git commits, database migrations, deployments (K8s, Docker, ArgoCD), configuration, dependencies

**Workflow**:
1. Specialist agent requests rollback with: severity, reason, affected systems, target state, risk assessment
2. Supervisor generates rollback plan with pre-checks, execution steps, post-checks
3. Supervisor logs request to `logs/rollbacks/`
4. User approves ("yes")
5. Supervisor executes step-by-step
6. Supervisor logs result, errors, lessons learned

**Safety**: Pre-checks (git status, backups, health) • Detailed execution steps • Post-checks (app health, DB connectivity, tests) • Rollback-of-rollback procedure • Comprehensive logging • Never automated without approval

**File**: `Nexus Ai/rollback-manager.ts` (800+ lines)

## Repository Structure

```
DeswalTech/
├── Nexus Ai/
│   ├── nexus-ai-team/          ⭐ OPERATIONAL SYSTEM (7 agents + skills)
│   ├── skill-validator.ts      Validate agent skills, detect conflicts
│   ├── coverage-enforcer.ts    Enforce 95% test coverage
│   ├── rollback-manager.ts     Strategic rollback management
│   ├── agent-collaboration.ts  Cross-domain consultation system
│   ├── agent-wrapper.ts        Type-safe agent orchestration
│   ├── error-handler.ts        Comprehensive error handling
│   ├── batch-processor.ts      50% cost savings via batching
│   ├── temporal-workflows/     Durable workflow definitions
│   └── schemas/                Zod validation schemas
├── Infrastructure/              Docker Compose services (Postgres, Redis, etc.)
├── mcp-server/                  MCP server implementation
├── scripts/                     Utility scripts (verify-package.js)
├── logs/
│   ├── collaborations/          Agent consultation logs
│   ├── rollbacks/               Rollback operation logs
│   └── errors/                  Error logs for learning
├── mcp.json                     MCP configurations
├── package.json                 Dependencies & scripts
└── PROJECT_CONTEXT_TEMPLATE.md  Template for new projects
```

## Critical Guidelines

1. **Human-in-the-Loop**: Never skip "wait-for-yes" approval protocol
2. **Quality First**: All code passes 3-level quality gates + 95% coverage for critical code
3. **Security by Default**: Argon2id, JWTs, encryption everywhere
4. **Use MCPs**: Leverage MCP servers instead of building from scratch
5. **Dependency Awareness**: Follow TASKS.md order (topologically sorted)
6. **TypeScript Strict**: All code compiles with strict mode
7. **Test Coverage**: 95% critical, 90% high, 85% standard, 80% utilities
8. **Production-Ready Only**: Enterprise-grade standards mandatory
9. **Supervisor Coordinates**: Supervisor orchestrates, validates, logs all major operations
10. **Collaboration Protocol**: Cross-domain consultations via supervisor only (one agent works at a time)
11. **Rollback Safety**: All rollbacks require supervisor approval and full documentation
12. **PRD RPG Structure**: Functional requirements MUST use: `### Capability`, `#### Feature`, `Depends on:`, `Phase:`
13. **Agent Files**: Reference `Nexus Ai/nexus-ai-team/agents/` for domain-specific best practices
14. **Development Only**: Infrastructure credentials are NOT for production use
15. **Skill Quality**: Run `skill-validator.ts` before project start to prevent conflicts
16. **ByteRover Integration**: Store learnings after tasks, retrieve before starting new work

## Pre-Project Checklist

**Before starting any project, run**:
```bash
# 1. Start infrastructure
cd Infrastructure && ./start-services.sh

# 2. Validate agent skills
cd "Nexus Ai" && npx tsx skill-validator.ts

# 3. Verify all services healthy
cd Infrastructure && docker compose ps
```

**Expected Output**:
- All infrastructure services: ✅ healthy
- Skill validation: ✅ 0 conflicts, all valid
- Ready to invoke supervisor

## Starting a Project

**Always begin with Supervisor**:
```
/agent supervisor

Build a [feature description]:
- Requirement 1
- Requirement 2
- Requirement 3

Timeline: [timeframe]
Quality: Production-ready
```

**Supervisor will**:
1. Ask clarifying questions (Socratic discovery)
2. Create RPG-structured PRD
3. Parse into dependency-aware TASKS.md
4. Delegate tasks to specialists (one at a time)
5. Coordinate "wait-for-yes" execution
6. Facilitate agent collaborations when needed
7. Enforce quality gates (skills, coverage, security)
8. Manage rollbacks if issues occur
9. Document lessons learned

**During Execution**:
- **One agent at a time** completes sub-task → STOPS → waits for "yes"
- **Cross-domain help**: Agent requests consultation → Supervisor validates → Consultant advises → Original agent implements
- **Quality checks**: QA runs `coverage-enforcer.ts` → Task blocked until 95% met for critical code
- **Issues**: Agent requests rollback → Supervisor generates plan → User approves → Supervisor executes

**Completion Criteria**:
- ✅ All tasks in TASKS.md complete
- ✅ 95% test coverage for critical code (enforced)
- ✅ All quality gates passed (L1, L2, L3)
- ✅ Agent skills validated (no conflicts)
- ✅ All collaborations documented
- ✅ Lessons learned captured in ByteRover
