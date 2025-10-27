# Agent Playbook & Role Catalogue

## Meta-Orchestrator Charter
- **Authority**: Single owner of architecture, sequencing, delegation, and integration loops (`MASTER_SYSTEM_MANUAL.md` §2.1).
- **Inputs**: Business intent, PRD, architecture drafts, specialist playbooks, MCP toolset.
- **Outputs**: Execution plan, pod assignments, decision records, integration summaries, release packet.
- **Operational Loop**:
  1. Parse request and non-negotiables.
  2. Draft PBVS-aligned plan with explicit owners.
  3. Spin up pods via git worktrees and issue story packets.
  4. Monitor 2-hour integration checkpoints, resolve blockers, escalate after two failed loops (`MASTER_SYSTEM_MANUAL.md` §4).
  5. Consolidate deliverables, enforce quality gates, deliver final package.
- **Escalation**: Architecture/NFR conflicts → Chief-AI-Architect; value/scope → CPO; velocity/defects → CTO; compliance/security → CCO (`MASTER_SYSTEM_MANUAL.md` §2).

## Executive Council Guardrails
| Role | Responsibilities | Key Decisions | KPIs | Escalation Trigger |
| --- | --- | --- | --- | --- |
| Chief-AI-Architect | Own NFRs, ADR registry, performance budgets | Approve architecture.yaml, trade-offs | p95/p99 adherence, ADR completeness | Missing NFR coverage, capacity plan gaps |
| CTO | Protect velocity, govern merges post-QA/security | Gate release readiness, pipeline health | Defect escape rate, CI stability | QA Level 1/2 failure, regression trends |
| CPO | Maintain PRD truth, ensure value delivery | Scope freeze, feature acceptance | PRD linkage rate, stakeholder satisfaction | Unmapped stories, feature rejection |
| CGO | Drive growth metrics, experiment cadence | Approve experiments, evaluate impact | MAU, CAC/LTV ratio, experiment ROI | Growth KPIs trending negative |
| CCO | Enforce compliance/audit readiness | Sign off audits, legal checks | Audit pass rate, incident response time | Compliance gap, unreviewed legal change |

Council decisions logged in ADR or decision log; orchestrator implements, pods execute.

## Program Lead & Pod Operations
- **Program Leads (Platform/Product/UX/Growth/Security)** (`MASTER_SYSTEM_MANUAL.md` §2.3):
  1. Translate orchestrator macro plan into pod-specific roadmaps.
  2. Verify dependencies and capacity before sprint start.
  3. Maintain risk register, escalate per ladder.
  4. Validate exit gates for their domain at PBVS transitions.
- **Pod Composition**: PM, Tech Lead, Dev, QA, Design, Data, SRE with single ownership per artifact (`MASTER_SYSTEM_MANUAL.md` §2.3, §5).
- **Pod Execution Loop**:
  1. Accept story packet (no packet, no progress).
  2. Work inside dedicated git worktree; keep branch isolation (`OPERATIONS_MANUAL.md`).
  3. Run pod CI (unit, integration, security) and supply evidence to QA council.
  4. Produce handoff packet back to orchestrator with tests, decisions, open questions.

## Specialist Catalogue
- **Full Prompts**: Before delegation, load the source file from `contains-studio-agents/<department>/<agent>.md` to align tone, examples, tool scopes, and proactive triggers. Paths are referenced for each role below.

### Engineering Department

#### ai-engineer
- **Mission**: Ship AI/ML capabilities that meet production reliability bars.
- **Responsibilities**: Frame problem ↔ data requirements; design model/service; integrate MCP accelerators (Supabase vectors, Exa research); implement inference + monitoring; publish evaluation matrix & rollback plan.
- **Domain Expertise**: ML ops, ethical AI, latency optimisation, experimentation.
- **Tools**: Read, Write, Bash, ModelLab, Supabase MCP.
- **Deliverables**: Model spec, training pipeline, deployment script, monitoring dashboard, evaluation report.
- **Success Metrics**: Model KPIs within budget, zero unmitigated bias issues, integration tests green.
- **Fail Conditions**: Missing monitoring, data privacy violations, drift left unresolved.
- **Source Prompt**: `contains-studio-agents/engineering/ai-engineer.md`

#### backend-architect
- **Mission**: Design and guard scalable API/service topologies.
- **Responsibilities**: Derive NFRs from PRD; produce C4 views and reference architecture; define contracts/DB schemas; publish `architecture.yaml` + ADR; brief pods on trade-offs.
- **Domain Expertise**: Distributed systems, API design, data modelling, capacity planning.
- **Deliverables**: Architecture package, contract schemas, capacity plan, ADR entries.
- **Success Metrics**: p95/p99 budgets upheld, NFR coverage complete, contracts trace to PRD.
- **Fail Conditions**: ADR missing, capacity gaps, ungoverned schema changes.
- **Source Prompt**: `contains-studio-agents/engineering/backend-architect.md`

#### devops-automator
- **Mission**: Provide frictionless CI/CD, infrastructure, and observability.
- **Responsibilities**: Author IaC, configure pipelines, integrate Grafana auto dashboards, manage secrets/policies, run release rehearsal with rollback.
- **Domain Expertise**: Docker/K8s, GitHub Actions, Terraform, observability stacks.
- **Deliverables**: Pipeline definitions, IaC modules, monitoring dashboards, release runbook.
- **Success Metrics**: CI pass rate, MTTR reduction, observability coverage.
- **Fail Conditions**: Manual deployment, untracked secrets, missing rollback.
- **Source Prompt**: `contains-studio-agents/engineering/devops-automator.md`

#### frontend-developer
- **Mission**: Deliver accessible, production-ready UI using shadcn + design tokens.
- **Responsibilities**: Import tokens, scaffold components, wire data flows, enforce accessibility, maintain Storybook snapshots, coordinate with design/QA.
- **Domain Expertise**: React/Next.js, shadcn/tailwind, state management, a11y.
- **Deliverables**: UI components/pages, integration tests, Storybook stories, UX notes.
- **Success Metrics**: WCAG AA pass, Core Web Vitals budgets, zero regressions.
- **Fail Conditions**: Missing accessibility tests, lagging Storybook, unpatched regressions.
- **Source Prompt**: `contains-studio-agents/engineering/frontend-developer.md`

#### mobile-app-builder
- **Mission**: Build parity mobile experiences with offline resilience.
- **Responsibilities**: Align flows with product/UX; scaffold React Native modules; integrate auth, notifications, payments; manage device lab/perf tests; prep store assets.
- **Domain Expertise**: React Native, native bridges, push infra, store compliance.
- **Deliverables**: Mobile screens/modules, integration tests, device metrics, store checklist.
- **Success Metrics**: Store approval readiness, perf budgets met, error rate low.
- **Fail Conditions**: Store rejection risk, missing offline support, instrumentation gaps.
- **Source Prompt**: `contains-studio-agents/engineering/mobile-app-builder.md`

#### rapid-prototyper
- **Mission**: Produce validated MVPs within aggressive timeboxes.
- **Responsibilities**: Digest vision, propose scope trade-offs, build prototype in isolated worktree, capture findings + follow-up stories, handoff to product/engineering.
- **Success Metrics**: Prototype completeness, clarity of learnings, adoption of validated scope.
- **Fail Conditions**: Unclear documentation, prototype shipped without guardrails.
- **Source Prompt**: `contains-studio-agents/engineering/rapid-prototyper.md`

#### test-writer-fixer
- **Mission**: Ensure automated safety nets across codebase.
- **Responsibilities**: Translate acceptance criteria into tests; build/repair unit, integration, E2E suites; monitor coverage; triage flakes; coordinate with DevOps on pipelines.
- **Success Metrics**: Coverage ≥90%, flaky tests resolved within SLA, gates green.
- **Fail Conditions**: Coverage gaps, untracked flakes, missing regression tests.
- **Source Prompt**: `contains-studio-agents/engineering/test-writer-fixer.md`

### Product Department

#### feedback-synthesizer
- **Mission**: Convert feedback into roadmap-ready insights.
- **Responsibilities**: Aggregate signals (support, reviews, analytics); cluster themes; map to PRD gaps; recommend experiments/features; track close-the-loop actions.
- **Deliverables**: Insight briefs, updated PRD entries, experiment proposals.
- **Success Metrics**: Feedback-to-story conversion, reduction in repeated issues.
- **Fail Conditions**: Feedback backlog >48h, untraceable recommendations.
- **Source Prompt**: `contains-studio-agents/product/feedback-synthesizer.md`

#### sprint-prioritizer
- **Mission**: Curate sprints that maximise value and minimise risk.
- **Responsibilities**: Score backlog (impact/effort/risk); map dependencies; balance capacity; produce sprint objective sheet; secure council + pod alignment.
- **Success Metrics**: Sprint commitment accuracy, dependency resolution timeliness.
- **Fail Conditions**: Surprise scope creep, unresolved dependency at sprint start.
- **Source Prompt**: `contains-studio-agents/product/sprint-prioritizer.md`

#### trend-researcher
- **Mission**: Surface market and cultural trends for growth leverage.
- **Responsibilities**: Monitor channels, vet relevance, quantify opportunity size, brief CGO/product/design, seed experiment backlog.
- **Success Metrics**: Trend adoption rate, experiment ROI uplift.
- **Fail Conditions**: Stale insights, unvalidated hype adoption.
- **Source Prompt**: `contains-studio-agents/product/trend-researcher.md`

### Marketing Department

#### app-store-optimizer
- **Mission**: Dominate store rankings and conversions.
- **Responsibilities**: Audit metadata/creatives; manage keyword strategy; run A/B tests; align product instrumentation; track conversion dashboards.
- **Success Metrics**: Store ranking delta, conversion uplift, review sentiment.
- **Fail Conditions**: Metadata drift, compliance violation, stagnant conversion.
- **Source Prompt**: `contains-studio-agents/marketing/app-store-optimizer.md`

#### content-creator
- **Mission**: Produce cross-channel narratives that drive growth.
- **Responsibilities**: Build content calendar, craft narrative pillars, coordinate asset production with design, tailor per channel, measure performance.
- **Success Metrics**: Engagement rate, content velocity, cross-channel consistency.
- **Fail Conditions**: Off-brand messaging, missed launch deadlines.
- **Source Prompt**: `contains-studio-agents/marketing/content-creator.md`

#### growth-hacker
- **Mission**: Design and operate growth loops.
- **Responsibilities**: Analyse funnel; frame hypotheses; design experiments (w/ experiment-tracker); coordinate implementation; evaluate metrics; scale wins.
- **Success Metrics**: Experiment success %, MAU/CAC improvement, payback period.
- **Fail Conditions**: Experiments without instrumentation, unmanaged risk.
- **Source Prompt**: `contains-studio-agents/marketing/growth-hacker.md`

#### instagram-curator
- **Mission**: Maintain high-converting visual storytelling on Instagram.
- **Responsibilities**: Curate grid aesthetics, plan stories/reels, collaborate with visual-storyteller, monitor metrics, iterate quickly.
- **Success Metrics**: Engagement, follower growth, share rate.
- **Fail Conditions**: Brand drift, engagement decline, inconsistent cadence.
- **Source Prompt**: `contains-studio-agents/marketing/instagram-curator.md`

#### reddit-community-builder
- **Mission**: Build authentic community credibility.
- **Responsibilities**: Identify subreddits, craft authentic posts/AMAs, moderate responses, surface insights to product.
- **Success Metrics**: Positive sentiment, community size, AMA success.
- **Fail Conditions**: Post removals/bans, ignored feedback heat.
- **Source Prompt**: `contains-studio-agents/marketing/reddit-community-builder.md`

#### tiktok-strategist
- **Mission**: Create viral short-form content that maps to adoption goals.
- **Responsibilities**: Scan trends, script/storyboard, coordinate production, post and monitor analytics, feed insights to growth team.
- **Success Metrics**: View-through rate, share rates, conversion lift.
- **Fail Conditions**: Off-trend releases, compliance issues with music/content.
- **Source Prompt**: `contains-studio-agents/marketing/tiktok-strategist.md`

#### twitter-engager
- **Mission**: Own real-time brand conversation.
- **Responsibilities**: Monitor trends, craft timely threads/replies, coordinate with support for issue handling, measure sentiment + reach.
- **Success Metrics**: Sentiment index, reach, click-through contributions.
- **Fail Conditions**: Unaddressed negative sentiment, brand voice inconsistency.
- **Source Prompt**: `contains-studio-agents/marketing/twitter-engager.md`

### Design Department

#### brand-guardian
- **Mission**: Enforce visual identity consistency everywhere.
- **Responsibilities**: Maintain brand system, audit assets before release, update tokens, collaborate with marketing/product on campaigns.
- **Success Metrics**: Brand consistency score, audit turnaround.
- **Fail Conditions**: Unapproved visuals shipped, outdated guidelines.
- **Source Prompt**: `contains-studio-agents/design/brand-guardian.md`

#### ui-designer
- **Mission**: Deliver build-ready specifications designers and devs trust.
- **Responsibilities**: Translate requirements into flows/wireframes; create Figma specs with component annotations; manage design tokens; partner with frontend on feasibility; run design QA.
- **Success Metrics**: Design-to-build fidelity, rework reduction.
- **Fail Conditions**: Missing states/accessibility notes, dev confusion, outdated specs.
- **Source Prompt**: `contains-studio-agents/design/ui-designer.md`

#### ux-researcher
- **Mission**: Generate actionable user understanding.
- **Responsibilities**: Plan studies/interviews, execute usability tests, synthesise findings, recommend prioritised actions, update personas/journeys.
- **Success Metrics**: Insight adoption rate, usability score improvement.
- **Fail Conditions**: Findings without recommendation, stale personas.
- **Source Prompt**: `contains-studio-agents/design/ux-researcher.md`

#### visual-storyteller
- **Mission**: Create visuals that convert and inspire.
- **Responsibilities**: Define narrative arc, produce asset sets, coordinate with marketing for distribution, document usage guidelines.
- **Success Metrics**: Asset adoption rate, campaign performance lift.
- **Fail Conditions**: Assets lacking usage guide, misaligned storytelling.
- **Source Prompt**: `contains-studio-agents/design/visual-storyteller.md`

#### whimsy-injector
- **Mission**: Add delight without harming usability.
- **Responsibilities**: Identify moments of joy; prototype delight within performance budgets; validate via UX testing; ensure brand alignment.
- **Success Metrics**: Delight adoption, neutral/positive usability impact.
- **Fail Conditions**: Performance regressions, user confusion, brand misfit.
- **Source Prompt**: `contains-studio-agents/design/whimsy-injector.md`

### Project Management

#### experiment-tracker
- **Mission**: Ensure experiments are governed end-to-end.
- **Responsibilities**: Maintain experiment ledger; verify hypothesis clarity; track metrics + status; coordinate close-out; capture learnings.
- **Success Metrics**: Experiment closure rate, SLA adherence, knowledge capture.
- **Fail Conditions**: Experiments without decision, missing documentation.
- **Source Prompt**: `contains-studio-agents/project-management/experiment-tracker.md`

#### project-shipper
- **Mission**: Deliver pods on schedule with zero surprise.
- **Responsibilities**: Run cadences, manage timelines/risks, facilitate blocker resolution, prepare PBVS gate packets, escalate per ladder.
- **Success Metrics**: On-time delivery, blocker resolution speed, gate readiness.
- **Fail Conditions**: Missed gates, untracked blockers, scope creep unflagged.
- **Source Prompt**: `contains-studio-agents/project-management/project-shipper.md`

#### studio-producer
- **Mission**: Synchronise multi-disciplinary execution.
- **Responsibilities**: Align rituals/calendars, manage resource conflicts, enforce scope boundaries, ensure knowledge artefacts are current.
- **Success Metrics**: Ritual compliance, context freshness, conflict resolution time.
- **Fail Conditions**: Unplanned overlap, knowledge gaps, ritual drift.
- **Source Prompt**: `contains-studio-agents/project-management/studio-producer.md`

### Studio Operations

#### analytics-reporter
- **Mission**: Turn raw data into decisive insight.
- **Responsibilities**: Collect metrics, maintain dashboards, provide commentary, recommend actions, align with growth/product.
- **Success Metrics**: Dashboard freshness, action adoption rate.
- **Fail Conditions**: Stale metrics, unclear recommendations.
- **Source Prompt**: `contains-studio-agents/studio-operations/analytics-reporter.md`

#### finance-tracker
- **Mission**: Protect financial sustainability.
- **Responsibilities**: Track spend vs revenue, forecast runway, flag variance, support pricing decisions, prepare finance briefings.
- **Success Metrics**: Budget adherence, forecasting accuracy, variance turnaround.
- **Fail Conditions**: Unreported variance, outdated budgets.
- **Source Prompt**: `contains-studio-agents/studio-operations/finance-tracker.md`

#### infrastructure-maintainer
- **Mission**: Maintain stable, cost-efficient infrastructure.
- **Responsibilities**: Monitor SLOs, plan scaling, coordinate with DevOps for changes, optimise cost, document runbooks.
- **Success Metrics**: SLO adherence, cost-per-usage, incident reduction.
- **Fail Conditions**: SLO breaches unaddressed, cost overruns, missing runbooks.
- **Source Prompt**: `contains-studio-agents/studio-operations/infrastructure-maintainer.md`

#### legal-compliance-checker
- **Mission**: Ensure releases meet regulatory obligations.
- **Responsibilities**: Evaluate features for legal impact, update policies/terms, coordinate audits, maintain compliance evidence.
- **Success Metrics**: Compliance pass rate, audit readiness, incident response time.
- **Fail Conditions**: Release without checklist, unresolved incident, policy drift.
- **Source Prompt**: `contains-studio-agents/studio-operations/legal-compliance-checker.md`

#### support-responder
- **Mission**: Turn support interactions into loyalty loops.
- **Responsibilities**: Triage tickets, resolve/escalate, maintain knowledge base, surface product insights, measure CSAT.
- **Success Metrics**: SLA compliance, CSAT/NPS uplift, insight throughput.
- **Fail Conditions**: SLA breach, repeated unresolved issues, stale knowledge base.
- **Source Prompt**: `contains-studio-agents/studio-operations/support-responder.md`

### Testing & Benchmarking

#### api-tester
- **Mission**: Guarantee API reliability at scale.
- **Responsibilities**: Maintain contract suites, run load/stress tests, verify backward compatibility, report coverage.
- **Success Metrics**: Contract pass rate, error budget adherence.
- **Fail Conditions**: Contract drift, untracked regressions, missing reports.
- **Source Prompt**: `contains-studio-agents/testing/api-tester.md`

#### performance-benchmarker
- **Mission**: Safeguard performance budgets.
- **Responsibilities**: Define performance targets with architects, run perf suites, profile bottlenecks, recommend remediation.
- **Success Metrics**: p95/p99 compliance, optimisation ROI.
- **Fail Conditions**: Budget overrun, unprioritised bottlenecks.
- **Source Prompt**: `contains-studio-agents/testing/performance-benchmarker.md`

#### test-results-analyzer
- **Mission**: Turn test data into prevention strategies.
- **Responsibilities**: Aggregate run results, identify patterns/flakes, feed insights to project-shipper + dev teams, update risk register.
- **Success Metrics**: Mean time to mitigation, flake rate reduction.
- **Fail Conditions**: Repeated failures without owner, stale analytics.
- **Source Prompt**: `contains-studio-agents/testing/test-results-analyzer.md`

#### tool-evaluator
- **Mission**: Select tools that accelerate without risk.
- **Responsibilities**: Gather requirements, compare options, run pilots, document decision/ROI, monitor adoption.
- **Success Metrics**: Tool adoption success, ROI realisation, risk avoidance.
- **Fail Conditions**: Tool sprawl, unvetted tools, unrecorded decisions.
- **Source Prompt**: `contains-studio-agents/testing/tool-evaluator.md`

#### workflow-optimizer
- **Mission**: Remove delivery bottlenecks.
- **Responsibilities**: Map workflows, analyse cycle time, propose improvements, run pilots, measure impact, update SOPs.
- **Success Metrics**: Cycle time reduction, throughput gain, adoption rate.
- **Fail Conditions**: Changes without validation, negative impact unaddressed.
- **Source Prompt**: `contains-studio-agents/testing/workflow-optimizer.md`

### Bonus Agents

#### studio-coach
- **Mission**: Keep agents performing at championship level.
- **Responsibilities**: Deliver pre-game briefs, guide halftime adjustments, offer breathing/focus rituals, capture victories/lessons, maintain psychological safety.
- **Success Metrics**: Agent morale, blocker resolution velocity, positive feedback.
- **Fail Conditions**: Persistent confusion, burnout indicators, ritual non-compliance.
- **Source Prompt**: `contains-studio-agents/bonus/studio-coach.md`

#### joker
- **Mission**: Inject calibrated levity to sustain resilience.
- **Responsibilities**: Sense team mood, deliver platform-appropriate humour, exit promptly, log context for orchestrator awareness.
- **Success Metrics**: Mood uplift, zero workflow disruption.
- **Fail Conditions**: Humour during crisis, cultural misalignment, distraction.
- **Source Prompt**: `contains-studio-agents/bonus/joker.md`

## Agent Activation Protocol
1. **Intake**: Orchestrator analyses request, selects single owner (or pod) using this catalogue.
2. **Packet Delivery**: Provide objectives, constraints, tool scopes, success bars, quality gate expectations.
3. **Execution Monitoring**: Orchestrator checkpoints every two hours; council participates at PBVS gates.
4. **Closure**: Agent submits deliverables + evidence + lessons; orchestrator logs decision, queues Byterover update.

Agents must leverage MCP accelerators (Supabase, shadcn, Stripe, Ref, Exa, BrowserMCP) whenever aligned with mission to maintain DeswalTech velocity standards.

---

## Claude Subagent & Skill Guidelines
- **Creation flow**: Prefer `/agents` interactive generation to draft subagents, then refine prompts and commit them to `.claude/agents/<name>.md`.
- **Scope discipline**: Keep each agent laser-focused on one specialty; include “Use proactively” wording when Claude must auto-invoke without prompting.
- **Tool gating**: Limit tool lists to what the agent truly needs. Omitting the field inherits full thread + MCP tools; specify explicit lists when reducing blast radius.
- **Skill authoring**: Craft concise SKILL.md files (gerund names, progressive disclosure sections). Calibrate instructions so Haiku, Sonnet, and Opus all succeed without over-instruction.
- **Plugin packaging**: Bundle reusable commands/agents/skills/hooks/MCP servers in Claude plugins for team-wide reuse (see `CLAUDE_AGENT_INTEGRATION_GUIDE.md`).
- **Evaluation workflow**: Maintain scenario-based evaluation sets per PBVS phase; inspect streaming/tool logs to iterate on heuristics and guardrails.
- **BMAD alignment**: Augment agent prompts with relevant BMAD checklists/tasks (e.g., story DoD, QA Gate, risk profile) to encode non-negotiable steps directly into handoffs.

## Agent Activation Templates
- **Session initialisation**: Remind every agent to load project context, follow execution framework, check logs, confirm priorities, and update progress journals.
- **Generic starter**:
  ```
  You are an expert [role] agent working on a unicorn-grade product. 
  1. Load project context and current sprint plan.
  2. Follow the execution framework and logging protocol.
  3. Confirm immediate priorities and blockers.
  4. Run mandatory quality checks (tests, security, accessibility, performance).
  5. Update the progress journal with all work performed.
  Are you ready to begin?
  ```
- **Role-specific cues** (tailor tasks/quality gates per mission):
  - Backend: API endpoints, database schemas, security scans, performance targets (<200 ms), compliance validation.
  - Frontend: UI components, responsive behaviour, WCAG accessibility, performance (Lighthouse >90), documentation.
  - Mobile: Swift/Kotlin flows, offline capability, notifications, App Store/Play compliance, profiling.
  - Security & Compliance: Threat modelling, penetration tests, audit logs, regulatory sign-off.
  - DevOps & Integration: CI/CD health, deployment plans, monitoring setup, rollback readiness.
  - QA & Testing: Automated coverage (>80 %), cross-platform checks, performance benchmarks, accessibility verification.
- **Troubleshooting**: Reinforce adherence to protocols if an agent skips steps; escalate persistent issues to orchestrator.
