# Advanced Expert-Agent Delivery System

> **Mission**: Mirror the precision of DeswalTech’s orchestration stack while extending it into a reusable, production-ready operating system for Claude-led AI teams.

---

## 🎯 Why This Layer Exists
- Reproduce FAANG++ execution quality with deterministic orchestration, explicit ownership, and council guardrails defined in `MASTER_SYSTEM_MANUAL.md`.
- Ensure every project executes with the same rigor previously documented in the DeswalTech guides and now consolidated into `CLAUDE_AGENT_INTEGRATION_GUIDE.md`, `CLAUDE_PLATFORM_REFERENCE.md`, and the manuals below.
- Provide a complete reference suite for planning, operations, validation, and strategy so the AI specialist team rivals elite human squads.

---

## 🧭 Structural Overview
| Layer | Mandate | Primary Artifacts | Alignment |
| --- | --- | --- | --- |
| **Tier‑0 · Meta-Orchestrator** | Interpret mission, architect plan, delegate, integrate, deliver | `MASTER_SYSTEM_MANUAL.md`, ADR ledger | `MASTER_SYSTEM_MANUAL.md` §2.1 |
| **Tier‑1 · Executive Council** | Guard rails for architecture, velocity, value, growth, compliance | Escalation ladders, KPI dashboards | `MASTER_SYSTEM_MANUAL.md` §2.2 |
| **Tier‑2 · Program Leads** | Translate plan into pod roadmaps, deconflict dependencies | Sprint plans, risk register | `MASTER_SYSTEM_MANUAL.md` §2.3 |
| **Tier‑3 · Pods** | Operate in isolated git worktrees with single ownership per artifact | Story packets, pod CI dashboards | `OPERATIONS_MANUAL.md`, `MASTER_SYSTEM_MANUAL.md` §4 |
| **Tier‑4 · Specialists** | Execute SOPs with strict context isolation & tool scopes | `AGENT_PLAYBOOK.md`, handoff packets | `AGENT_PLAYBOOK.md`, `KNOWLEDGE_ASSETS.md` |

---

## 📚 Document Map
| File | Purpose |
| --- | --- |
| `QUICK_REFERENCE.md` | 5-minute launch card: PBVS flow, routing cheat sheet, incident playbook. |
| `MASTER_SYSTEM_MANUAL.md` | End-to-end operating manual covering governance, PBVS lifecycle, cadences, context strategy, risk. |
| `AGENT_PLAYBOOK.md` | 360° catalogue of council + specialist SOPs, deliverables, KPIs, fail guards, MCP cues. |
| `OPERATIONS_MANUAL.md` | Coordination mechanics: cadences, communications, handoffs, worktrees, reporting. |
| `QA_AND_VALIDATION.md` | Multi-level gate criteria, quality configuration baselines, security/perf standards, release blockers. |
| `STRATEGY_AND_GROWTH.md` | Strategic pillars, differentiators, innovation backlog, extensibility policies, success metrics. |
| `KNOWLEDGE_ASSETS.md` | Mapping to BMAD checklists/templates/tasks and Contains Studio prompt sources. |
| `CLAUDE_AGENT_INTEGRATION_GUIDE.md` | Claude subagents, plugins, agent skills, and tool orchestration best practices. |
| `CLAUDE_PLATFORM_REFERENCE.md` | Model selection, settings hierarchy, context/caching/streaming/token management, pricing. |

---

## ⚡ Quick Start for Orchestrators
1. **Load Context**  
   - Read `MASTER_SYSTEM_MANUAL.md` and `KNOWLEDGE_ASSETS.md`.  
   - (Pending MCP availability) run `byterover-retrieve-knowledge` to pull historic decisions.
2. **Define Mission Profile**  
   - Capture business goal, success metrics, PBVS phase targets.  
   - Register initial risks and council oversight requirements.
3. **Spin Up Pods**  
   - Follow `OPERATIONS_MANUAL.md` to add git worktrees (`git worktree add ../pod-<name> origin/main`) and assign owners.  
   - Issue story packets referencing `AGENT_PLAYBOOK.md` SOPs and quality gates.
4. **Execute with Discipline**  
   - Run 2-hour integration heartbeats, log progress in progress journal, escalate per ladder.  
   - Enforce Level 1/2/3 gates (`QA_AND_VALIDATION.md`) before any merge or release.
5. **Document & Learn**  
   - Archive decisions, ADRs, test evidence.  
   - Queue `byterover-store-knowledge` entries for patterns/mitigations once server is available.

---

## 🧠 Execution Philosophy
1. **Intelligent Orchestration** – Claude is the only routing brain; no keyword routers (`MASTER_SYSTEM_MANUAL.md` §1–§2).  
2. **Role Guides as Source Code** – Specialist files are training corpora; orchestrator synthesizes output (`AGENT_PLAYBOOK.md`).  
3. **Automation with Accountability** – Grafana/MCPs accelerate but never replace guardrails (`MASTER_SYSTEM_MANUAL.md` §6).  
4. **Traceable Everything** – Story → PRD → Architecture → Tests → Gate evidence (`MASTER_SYSTEM_MANUAL.md` §5).  
5. **Continuous Learning** – Knowledge must persist across sessions via Byterover once connectivity is restored (`MASTER_SYSTEM_MANUAL.md` §5, §10).  

---

## ✅ Non-Negotiable Quality Bars
- **Level 1 (Automated)**: ESLint + Prettier + TS strict, security scan, perf p95 <200 ms, coverage ≥90%, WCAG AA.  
- **Level 2 (Integration)**: Cross-agent flows, DB perf, security compliance, perf benchmark, UX validation.  
- **Level 3 (Business)**: Feature/value validation, stakeholder approval, compliance + launch readiness.  
- Releases block on missing handoff packet, ADR, compliance checklist, or unresolved Grafana alert.

---

## 🛠 Operational Checklists
- [ ] Byterover context retrieved (log pending if service offline).  
- [ ] PBVS plan ratified by council (Plan→Build→Validate→Scale).  
- [ ] Git worktrees ledger updated; owners acknowledged.  
- [ ] Story packets issued with success bars + gate criteria.  
- [ ] Daily heartbeat + evening summaries recorded.  
- [ ] Release packet includes tests, metrics, ADRs, risk closures.

---

## 🤝 Alignment & Compliance
- Tool scopes per agent must be respected; breaching scope requires orchestrator + council approval.  
- Handoff packets enforce single ownership; progress halts without them (`MASTER_SYSTEM_MANUAL.md` §5).  
- Escalate after two failed resolution loops; crisis protocols for security/outage/compliance events activate immediately.

---

## 📈 Next Steps
- Optionally align this folder with any existing project structure (e.g., `.claude/`) so the manuals load automatically.  
- Run a full ReviewRadar-style dry run to validate pods, heartbeats, and gate evidence.  
- Once `byterover-mcp` is reachable, automate knowledge sync per `STRATEGY_AND_GROWTH.md`.

---

**DeswalTech-grade excellence, now encoded for every AI specialist team.**
