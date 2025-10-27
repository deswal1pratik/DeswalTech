# ⚡ Expert-Agent Quick Reference
*Everything the orchestrator needs in ≤5 minutes.*

---

## 1. Mission Snapshot
- **Goal**: Deliver FAANG++‑grade products via Claude-led orchestration, matching DeswalTech standards.
- **Core Assets**: `MASTER_SYSTEM_MANUAL.md`, `AGENT_PLAYBOOK.md`, `OPERATIONS_MANUAL.md`, `QA_AND_VALIDATION.md`, `STRATEGY_AND_GROWTH.md`, `KNOWLEDGE_ASSETS.md`, `CLAUDE_AGENT_INTEGRATION_GUIDE.md`, `CLAUDE_PLATFORM_REFERENCE.md`.
- **Non-Negotiables**: Intelligent orchestration (no keyword routing), automated observability, isolated contexts, explicit handoffs, git worktree parallelism, MCP-first execution.

---

## 2. 3-Step Launch Checklist
1. **Context Load**  
   - Read `MASTER_SYSTEM_MANUAL.md` + `CLAUDE_AGENT_INTEGRATION_GUIDE.md` + `CLAUDE_PLATFORM_REFERENCE.md`.  
   - (If available) run `byterover-retrieve-knowledge "deswaltech-expert-team"`.
2. **Workspace Spin-Up**  
   ```bash
   git worktree add ../pod-<mission> origin/main
   (cd ../pod-<mission> && npm install)
   npm run deswaltech:powerhouse
   npm run deswaltech:status
   ```
3. **Quality Guardrails**  
   ```bash
   npm run lint && npm run test && npm run test:integration
   npm run security:scan && npm run test:performance
   ```

---

## 3. PBVS Lifecycle at a Glance
| Phase | Primary Leads | Required Artifacts | Exit Gate |
| --- | --- | --- | --- |
| **Plan** | Orchestrator + Chief-AI-Architect + CPO | PRD slice, `architecture.yaml` draft, NFR matrix, risk register | Scope frozen, ADR logged |
| **Build** | Tech Leads + Dev/QA pods | Code increments, unit/integration suites, updated ADRs | Level 1 & 2 gates green |
| **Validate** | QA, Security, Product | QA report, perf benchmarks, compliance checklist | Zero Sev-1, budgets met |
| **Scale** | CGO + CCO + Ops | Launch plan, growth OKRs, support runbooks | Business sign-off + audit readiness |

---

## 4. Specialist Routing Cheat Sheet
- **Architecture** → `backend-architect`, `devops-automator`, `ai-engineer`
- **Frontline Delivery** → `frontend-developer`, `mobile-app-builder`, `rapid-prototyper`
- **Quality & Reliability** → `test-writer-fixer`, `api-tester`, `performance-benchmarker`, `test-results-analyzer`
- **Product & Growth** → `feedback-synthesizer`, `sprint-prioritizer`, `trend-researcher`, marketing cohort
- **Operations & Compliance** → `analytics-reporter`, `finance-tracker`, `legal-compliance-checker`, `support-responder`
- **Culture** → `studio-coach` (automatic for complex efforts), `joker` (situational morale)

Refer to `AGENT_PLAYBOOK.md` for responsibilities, deliverables, metrics, fail bars.

---

## 5. Quality Bars (Must Pass)
- **Level 1**: ESLint/Prettier/TS strict, coverage ≥90 %, OWASP clean, perf p95 <200 ms, WCAG AA.
- **Level 2**: Cross-agent integration, DB perf, security compliance, perf bench, UX validation.
- **Level 3**: Business acceptance, compliance checklist, launch readiness, stakeholder sign-off.
- Release blocked if: missing handoff packet, ADR absent, compliance incomplete, Grafana alert active.

---

## 6. Example Orchestrator Prompt
```
Take the Meta-Orchestrator role from advanced-ai-team/MASTER_SYSTEM_MANUAL.md
and orchestrate ReviewRadar growth dashboard v2:
- Web dashboard, Supabase analytics, shadcn UI
- KPI focus: retention, NPS, revenue
- Enforce QA_AND_VALIDATION.md gates, log ADRs, queue Byterover knowledge update.
```

---

## 7. Example Response Skeleton
```
## Phase 1: Plan
- Business Expert validates ROI and PRD linkage.
- Backend Architect drafts Supabase-based architecture with ADR-042.

## Phase 2: Build
- Frontend Developer ships shadcn hero/feature sections with Storybook refs.
- Test Writer Fixer ensures coverage (current: 92 %), QA Level 1 green.

## Phase 3: Validate
- Performance Benchmarker reports p95=148 ms.
- Security Expert signs OWASP 2025 scan; compliance checklist attached.

## Phase 4: Scale
- CGO schedules TikTok + Reddit campaigns; Support Responder updates runbooks.
- Release packet: code diff, tests, metrics, ADR links, knowledge sync note.
```

---

## 8. Incident Play
1. Contain (halt release, isolate impact).  
2. Notify orchestrator + relevant council (CTO/CCO).  
3. Mitigate within 24–48 h SLA.  
4. Run RCA, update risk register, store lessons in Byterover.

---

## 9. MCP Snapshot
| MCP | Acceleration | Common Tasks |
| --- | --- | --- |
| Supabase | Database, auth, real-time | Schemas, RLS policies, live dashboards |
| shadcn | UI component system | React components, theme tokens, accessibility |
| Stripe | Payments & billing | Checkout, subscriptions, webhook handling |
| Figma | Design integration | Token sync, spec extraction, asset retrieval |
| Ref | Pattern library | Code archetypes, security/perf playbooks |
| Exa | AI web research | Trend scans, competitor intel, supporting data |
| BrowserMCP | Automation & testing | Playwright flows, perf captures, regression checks |

---

## 10. Cost & Timeline Signals
- MVP: 1–3 days · ≈$25/month infra.
- Growth app (web + mobile + analytics): 1–2 weeks · ≈$55/month.
- Enterprise rollout: 2–4 weeks · ≈$105/month (+ metered services).

---

## 11. Metrics to Watch
- **Technical**: Grafana latency/error dashboards, CI pass rate, coverage trend.
- **Business**: Experiment success %, NPS, adoption metrics.
- **Team**: Velocity, blocker resolution time, morale signals from studio-coach.
- **Financial**: Budget variance, runway, cost-per-feature.

---

## 12. Claude Platform Quick Facts
- Default to `sonnet`; switch to `haiku` for low-latency tasks, `opus`/`opusplan` for complex planning.
- Use `messages/count_tokens` before large requests; aim to stay below 200K tokens (or opt into Sonnet 1 M beta when justified).
- Tag reusable instructions with `cache_control` to capture prompt caching benefits (5 min default TTL, 1 h optional).
- Enable streaming (`"stream": true`) for long responses or tool use; handle SSE events (`message_start` → `message_stop`) and retry on `overloaded_error`.
- Document settings changes (permissions, marketplaces, env vars) in `.claude/settings*.json` per hierarchy outlined in `CLAUDE_PLATFORM_REFERENCE.md`.

---

## 13. Daily Coordination Cheatsheet
- **Morning**: Sync with shared context, review blockers/dependencies, confirm priorities, remind agents of quality gates.
- **During day**: Work in 2 h focus blocks, refresh status every 4 h via MCP/logs, escalate critical issues immediately.
- **Evening**: Commit with descriptive messages, update progress journal + handoff packets, capture next-day plan.
- **Weekly**: Run quality/architecture review (≥2 h), inspect metrics, adjust upcoming backlog; deliver weekly recap to stakeholders.

---

Keep this card beside your orchestrator console; for depth, dive into the manual stack.***
