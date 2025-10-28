# Operations Manual & Coordination Protocols

## Lifecycle Overview
- **Plan → Build → Validate → Scale** sequencing with required artifacts and exit gates (`MASTER_SYSTEM_MANUAL.md` §4).
- Ownership transitions only via formal handoff packets; progress blocked without completed packet (`MASTER_SYSTEM_MANUAL.md` §5).
- Git worktrees used to parallelize pods while preserving deterministic ownership (`OPERATIONS_MANUAL.md`).

## Operational Quick Start
1. **Environment Preparation**
   ```bash
   git clone <repo> && cd <repo>
   npm run deswaltech:powerhouse
   npm run deswaltech:status
   ```
2. **Knowledge Load**
   ```bash
   # Pending MCP server availability
   byterover-retrieve-knowledge "deswaltech-expert-team"
   ```
   - If server unavailable, log pending retrieval in progress journal.
3. **Orchestrator Setup**
   ```bash
   # Create pod worktree
   git worktree add ../pod-<mission> origin/main
   # Install dependencies inside pod
   (cd ../pod-<mission> && npm install)
   ```
4. **Quality Guard Setup**
   ```bash
   npm run lint
   npm run test
   npm run test:integration
   npm run security:scan
   ```
5. **Load Knowledge Assets**
   - Reference `KNOWLEDGE_ASSETS.md` to select BMAD templates/checklists and Contains Studio prompts required for the mission.
   - Example (when source libraries are retained):
     ```bash
     cat bmad-code-org-bmad-method/bmad-core/checklists/story-dod-checklist.md
     cat contains-studio-agents/engineering/backend-architect.md
     ```

## Session Initialization Protocol
- **Context sync**: Load sprint objectives, decision/ADM logs, progress journal, and risk register before assigning work.
- **Priority briefing**: Reconfirm daily focus, unresolved blockers, dependency owners, and upcoming integration checkpoints.
- **Agent activation**: Issue role-specific prompts (see `AGENT_PLAYBOOK.md`) and ensure each specialist confirms mandatory quality gates and logging duties.
- **Quality guard reminder**: Restate required tests (unit/integration/accessibility/performance/security) prior to execution.
- **Logging readiness**: Prepare MCP context entries and progress journal sections for continuous updates.

## Daily Operating Cycle
- **Morning stand-up (~30 min)**: Round-robin updates, blocker triage, integration scheduling, and risk review.
- **Focus blocks (2 h)**: Execute planned work, run automated tests, update MCP/shared context, perform integration checks, document decisions.
- **Mid-day coordination (every 4 h)**: Pull snapshots via MCP or progress logs; orchestrator escalates critical blockers immediately.
- **Evening wrap (~15 min)**: Commit/push with descriptive messages, update progress journal and handoff packets, capture next-day priorities.
- **Weekly review (≥2 h)**: Inspect quality metrics, business alignment, technical debt, and performance results; adjust upcoming sprint backlog.

## Reporting & Dashboards
- **Daily automation**: Broadcast feature progress, blockers, gate status, integration health, and risk summary.
- **Weekly recap**: Share sprint goal attainment, milestone progress, quality gate compliance, planned priorities.
- **Monthly strategic brief**: Summarise platform stability, user/revenue growth, ROI outlook, and technical debt position.
- Maintain simplified stakeholder dashboard (overall health, business progress, risk posture, next milestones).

## Context Management Pattern (MCP)
- Host shared project state via MCP servers using schemas (e.g., `ProjectState`, `AgentAssignment`, `IntegrationContract`) captured in `KNOWLEDGE_ASSETS.md`.
- Maintain context caches with rotation/summarisation so combined payloads remain <150 K tokens; target >95 % agent sync success and <500 ms update latency.
- Daily routine: morning sync, progressive summarisation of completed work, domain-specific isolation, scheduled integration refreshes.
- Troubleshooting: verify connectivity, refresh caches, restart MCP services, restore from backup when necessary, and notify agents of recovery steps.

## Environment Pipeline & Deployment Strategy
- **Development**: automatic deploy on commits, synthetic data, developer-only access.
- **Staging**: manual promotion after quality gates, anonymised production-like data, QA/stakeholder verification.
- **Production**: manual approval post-staging validation, encrypted real data, observability dashboards and alerts active.
- Support zero-downtime deployment patterns, maintain rollback scripts, and log every release with metrics/approvals.

## Example Orchestrator Prompt
```
Take the Meta-Orchestrator role from advanced-ai-team/MASTER_SYSTEM_MANUAL.md,
consult CLAUDE_AGENT_INTEGRATION_GUIDE.md for subagent/plugin logistics, and
CLAUDE_PLATFORM_REFERENCE.md for model/caching/streaming constraints.

Mission: Build ReviewRadar v2 landing page (hero, feature grid, testimonials, CTA),
wire CMS via Supabase, enforce WCAG AA, <200ms p95, integrate analytics.

Apply PBVS lifecycle, issue story packets per AGENT_PLAYBOOK.md, and respect
quality gates from QA_AND_VALIDATION.md. Log decisions for Byterover sync.
```
- **Expected Workflow**: Orchestrator → plan (PBVS) → assign pods → run heartbeats → collect gate evidence → produce release packet → queue knowledge sync.

## Daily Cadence
| Time Block | Duration | Participants | Activities | Outputs | Source |
| --- | --- | --- | --- | --- | --- |
| Morning Sync | 45 min | Orchestrator + Active Agents | Load MCP/Byterover context, review overnight progress, refresh integration contracts, prioritize work, identify risks | Daily mission brief, updated dependency matrix | `MASTER_SYSTEM_MANUAL.md` §4.2 |
| Development Loops | 2h heartbeat | Orchestrator + Pods | Progress update, blocker review, integration checkpoint, quality status, knowledge capture | Heartbeat log, updated risk register, action list | `MASTER_SYSTEM_MANUAL.md` §4.2 |
| Integration Checkpoints | Event-driven | Relevant pods + QA | Validate cross-agent flows, run targeted tests, capture evidence | Integration report, gate status | `MASTER_SYSTEM_MANUAL.md` §4.1 |
| Evening Consolidation | 30 min | Orchestrator + Agents | Summarize progress, document decisions, prep handoffs, store knowledge | Daily summary, next-day plan, Byterover update | `MASTER_SYSTEM_MANUAL.md` §4.2 |

## Communication Protocols
1. **Daily Standup Template** (`MASTER_SYSTEM_MANUAL.md` §4.3):
   - Progress since last sync
   - Blockers & escalation needs
   - Dependencies requiring coordination
   - Next focus window
   - Quality gate status
2. **Integration Review**:
   - Participants: Owning pod, dependent pods, QA, DevOps
   - Inputs: Test reports, logs, performance data
   - Decisions: Proceed, fix required, escalate
3. **Escalation Ladder** (`MASTER_SYSTEM_MANUAL.md` §4):
   - Specialist → Orchestrator (after self-mitigation attempt)
   - Orchestrator → Council role based on issue domain
   - Council → Human administrator if impact high or SLA breach
4. **Crisis Protocols** (`MASTER_SYSTEM_MANUAL.md` §6):
   - Security/outage/compliance/quality failure → immediate containment, notify orchestrator + CCO/CTO
   - Root cause analysis scheduled post-recovery

## Handoff Packet Specification
```
From: <agent-id>
To: <agent-id>
Context Digest: <summary + links>
Decisions: <trade-offs, ADR refs>
Acceptance: <tests/specs executed>
Open Questions: <owner + due date>
Deadline: <handoff deadline>
```
Packets stored in progress log and validated before ownership shift (`MASTER_SYSTEM_MANUAL.md` §5).

## Context Synchronization
- **Shared Layer**: Project vision, sprint goals, quality gates, contracts (orchestrator maintained).
- **Domain Layer**: Specialist knowledge, implementation patterns, best practices (department leads manage).
- **Session Layer**: Current tasks, decisions, blockers, next steps (updated every heartbeat) (`MASTER_SYSTEM_MANUAL.md` §5).
- **Knowledge Storage**: Persist patterns, decisions, mitigations to Byterover after each milestone; pending MCP availability note required (`MASTER_SYSTEM_MANUAL.md` §5, §10).

## Planning & Tracking Methods
1. **Sprint Planning Interface** (`MASTER_SYSTEM_MANUAL.md` §4.1):
   - Objectives → validation → tracking → adjustment strategy.
   - Priorities balancing business value, technical debt, dependencies, and risk.
   - Agent assignments by expertise, workload, dependency chain, quality gate readiness.
2. **Progress Reporting JSON** (`MASTER_SYSTEM_MANUAL.md` §4.2):
   - `overallStatus`: ON_TRACK/AT_RISK/BLOCKED
   - `sprintProgress`: completed/in-progress/blocked/next + % complete
   - `agentPerformance`: department status, blockers, quality metrics
   - `integrationStatus`: cross-domain readiness
   - `qualityGates`: Level 1/2/3 pass rates
   - `risks`, `keyDecisions`, `escalations`, `nextDayPriorities`
3. **Risk Management Protocol** (`MASTER_SYSTEM_MANUAL.md` §6.2):
   - Identification → assessment → mitigation → monitoring with 24–48h SLAs.
   - Document in risk register; escalate per ladder if mitigation lags.
   - Supplement risk and QA activities with BMAD tasks (`bmad-core/tasks/qa-gate.md`, `bmad-core/tasks/risk-profile.md`) and checklists as referenced in `KNOWLEDGE_ASSETS.md`.
4. **Token & Cache Discipline**:
   - Before large operations, use `messages/count_tokens` to estimate token usage and prevent context overflow.
   - Identify reusable instruction/context blocks and mark with `cache_control` for prompt caching (5 min or 1 h TTL). Track cache hits in progress reports to quantify savings.

## Worktree Operations
| Stage | Command | Owner | Notes |
| --- | --- | --- | --- |
| Create pod tree | `git worktree add ../pod-<mission> origin/main` | Tech Lead | Record in worktree ledger (`OPERATIONS_MANUAL.md`) |
| Operate | `(cd ../pod-<mission> && <build/test suites>)` | Pod Members | Keep branch isolated; share results via handoff |
| List | `git worktree list` | Orchestrator | Review during daily sync |
| Cleanup | `git worktree remove ../pod-<mission>` | Tech Lead + Orchestrator sign-off | Forced removal requires recorded approval |

## Command Cookbook
| Scenario | Command(s) | Purpose |
| --- | --- | --- |
| Initialize DeswalTech stack | `npm run deswaltech:init` | Bootstraps MCP configs, infrastructure manifests |
| Launch multi-service env | `npm run deswaltech:powerhouse` | Starts Docker Compose services (Postgres, Redis, MinIO, Grafana) |
| Ask orchestrated build | `npm run deswaltech:ask "Build <feature spec>"` | Sends structured request for Claude-led execution |
| Verify health | `npm run deswaltech:status` | Reports service availability and MCP readiness |
| Development loop | `npm run dev` / `npm run lint` / `npm run test` | Run local server and Level 1 quality gates |
| Integration & perf | `npm run test:integration` / `npm run test:performance` | Satisfy Level 2 benchmarks |
| Security posture | `npm run security:scan` | Executes OWASP-focused scans before release |
| Deployment | `railway deploy` | Pushes release artefacts to production |
| Update settings | `claude --model opusplan` / `/model sonnet` / edit `.claude/settings*.json` | Adjust model routing, permissions, plugins per `CLAUDE_PLATFORM_REFERENCE.md` |
| Manage agents | `/agents` | Create/edit/delete subagents, adjust tool scopes, inspect plugin agents |
| Manage plugins | `/plugin marketplace add <source>` / `/plugin install <name>` | Configure shared marketplaces and plugin bundles |
| Token estimation | `claude --count-tokens` or API `messages/count_tokens` | Pre-flight check to avoid context violations |
| Streaming debug | `claude --debug` | Inspect plugin/agent loading, hook executions, streaming events |

## Meeting & Decision Rituals
- **PBVS Gate Reviews**: At each lifecycle transition, orchestrator + relevant council roles validate required artifacts before proceeding (`MASTER_SYSTEM_MANUAL.md` §4).
- **Quality Board**: Weekly session reviewing Level 2 and Level 3 metrics; chaired by CTO + QA leads.
- **Experiment Review**: Growth team reviews experiments weekly, aligning with CGO metrics (`MASTER_SYSTEM_MANUAL.md` §4).
- **Retrospective**: Post-sprint retrospective capturing lessons into Byterover knowledge base.

## Tool & Access Governance
- Role-based tool scopes from specialist files; orchestrator enforces isolation to prevent context bleed (`MASTER_SYSTEM_MANUAL.md` §5).
- MCP accelerators (Supabase, shadcn, Stripe) leveraged per architecture guidance (`MASTER_SYSTEM_MANUAL.md` §1, §8).
- Grafana operated autonomously; alerts piped to DevOps and orchestrator dashboards (`MASTER_SYSTEM_MANUAL.md` §6).

## Compliance & Documentation
- **Traceability Matrix**: Every story links to PRD and architecture entries (`MASTER_SYSTEM_MANUAL.md` §5).
- **Decision Logs**: Major trade-offs captured in ADR; absence blocks release.
- **Progress Journal**: Daily logs capturing status, blockers, mitigation, knowledge storage.
- **Audit Trail**: CCO maintains compliance documentation; releases require audit checklist sign-off.
- **Settings Governance**: Apply configuration hierarchy (managed policy → CLI → local/project → user). Update `.claude/settings.json` with permissions, env vars, `enabledPlugins`, and `extraKnownMarketplaces`; store personal overrides in `.claude/settings.local.json`. Use `permissions.deny` to shield secrets and restrict WebFetch/Bash scopes.

## Human-in-the-Loop Touchpoints
- Stakeholder updates delivered via orchestrator progress report.
- Council members approve gates aligned with their mandates.
- Human admin resolves escalations exceeding AI authority.

## Shutdown & Recovery
- For production incidents: initiate crisis plan, isolate impact, recover, run post-mortem, update mitigations (`MASTER_SYSTEM_MANUAL.md` §6).
- For compliance incidents: halt release, involve CCO, document remediation before resuming.

This manual must be referenced at sprint inception, during every planning session, and whenever onboarding new agents or pods to guarantee consistent, enterprise-grade execution.
