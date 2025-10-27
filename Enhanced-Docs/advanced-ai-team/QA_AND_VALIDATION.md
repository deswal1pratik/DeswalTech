# Quality Assurance & Validation Framework

## Multi-Level Quality Gates
| Level | Scope | Criteria | Ownership | Evidence | Source |
| --- | --- | --- | --- | --- | --- |
| Level 1 – Automated | Code health, security, performance, accessibility | ESLint/Prettier/TS strict, security scan (OWASP clean), API p95 < 200 ms, unit coverage ≥ 90%, integration contracts valid, WCAG 2.1 AA | Pod Tech Lead + QA | CI pipeline logs, coverage reports, accessibility scan | `MASTER_SYSTEM_MANUAL.md` §6 |
| Level 2 – Integration | Cross-agent flows, database performance, security compliance, UX validation | End-to-end scenarios, DB perf benchmarks, security validation, performance benchmarking, UX validation | Orchestrator + relevant specialists | Integration reports, load test results, UX sign-off | `MASTER_SYSTEM_MANUAL.md` §6 |
| Level 3 – Business | Feature completeness, value, scalability, compliance, market readiness, stakeholder satisfaction | Stakeholder review, accessibility & UX, scalability tests, compliance checks, go-to-market readiness, feedback capture | CPO + Council + Orchestrator | Business approval packet, compliance checklist, launch plan | `MASTER_SYSTEM_MANUAL.md` §6 |

Gate failure blocks progression; orchestrator coordinates remediation before re-run.

## Test Suites & Fail Conditions
| Suite | Owner | Trigger | Pass Criteria | Fail Condition |
| --- | --- | --- | --- | --- |
| Unit Tests | Pod Dev + Test Writer Fixer | On commit, pre-merge | ≥90% coverage, zero failing tests | Coverage dip, flake without mitigation |
| Contract/API Tests | API Tester | API change, release candidate | All contracts honored, backward compatibility | Contract mismatch, schema drift |
| Integration Tests | QA Pod + Orchestrator | Pre-integration, nightly | End-to-end user journeys green | Blocking regression, data mismatch |
| Performance Benchmarks | Performance Benchmarker | Perf-sensitive change, release | p95/p99 within budget, resource usage acceptable (`MASTER_SYSTEM_MANUAL.md` §6) | Budget exceeded, resource spike |
| Security Scan | DevOps Automator + CCO | Release candidate, new dependency | No critical vulnerabilities, dependency hygiene | Vulnerability detected, license violation |
| Streaming Verification | DevOps Automator + QA | Streaming or tool-heavy workflows | SSE event cycle handled (`message_start`→`message_stop`), retries/backoff on `error`, tool/thinking deltas reconstructed accurately | Dropped events, unhandled `error` types, mismatched reconstructed payloads |
| Accessibility Audit | Design/UX + QA | UI change, release | WCAG 2.1 AA compliance, assistive tech pass | Accessibility failure or untested path |
| Business Validation | Product + CPO | Feature completion | Acceptance criteria met, PRD alignment | PRD linkage missing, value gap |

## Quality Configuration Baselines
- **TypeScript** (strict by default):
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true,
      "noImplicitThis": true
    }
  }
  ```
- **ESLint**:
  ```json
  {
    "extends": ["@typescript-eslint/recommended", "prettier"],
    "rules": {
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error"
    }
  }
  ```
- **Prettier**:
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 2
  }
  ```
- **Testing Stack**: Jest + React Testing Library + Playwright; Supertest for API, k6/Lighthouse for performance.

## Security Standards
- **Authentication**: Short-lived JWT (15 min access, 7‑day refresh), Supabase or bespoke MFA flow, rate limiting on auth endpoints.
- **Authorization**: RBAC with row-level security, scoped API keys, policy audits every sprint.
- **Data Protection**: AES‑256‑GCM at rest, TLS 1.3 in transit, OWASP 2025 checklist verified each release.
- **Dependency Hygiene**: `npm audit`, `npm audit fix --force` reviewed, SBOM maintained.

## Performance Standards
| Layer | Target | Owner | Monitoring |
| --- | --- | --- | --- |
| API | p50 <50 ms, p95 <100 ms, p99 <200 ms, error rate <0.1 % | Backend Architect + Performance Benchmarker | Grafana dashboards + synthetic tests |
| Frontend | LCP <2.5 s, TTI <3.5 s, CLS <0.1, Lighthouse >95 | Frontend Developer + UX | Lighthouse CI + Web Vitals |
| Database | Query p95 <50 ms, cache hit rate >80 % | Backend Architect + Infrastructure Maintainer | Supabase metrics + Grafana |

## Validation Artifacts
- **Test Matrix**: Captures suite, coverage, owner, date, result, link to evidence (align with BMAD test-matrix patterns `bmad-method.md:1`).
- **Quality Dashboard**: Grafana autopopulated metrics for latency, error rate, coverage.
- **Release Checklist**:
  1. All levels of quality gates passed.
  2. ADRs updated.
  3. Compliance checklist signed.
  4. Support & documentation updated.
  5. Experiment plan (if applicable) approved by CGO.
  6. BMAD checklists/templates executed and archived (e.g., `bmad-core/checklists/story-dod-checklist.md`, `bmad-core/templates/qa-gate-tmpl.yaml`).
- **Platform Metrics**: Capture token usage, cache writes/reads, and streaming incidents per `CLAUDE_PLATFORM_REFERENCE.md` to feed retrospectives.
- For detailed asset selection, follow `KNOWLEDGE_ASSETS.md`.

## Audit & Traceability
- **Traceability Map**: Story → PRD section → Architecture component → Test suite.
- **Decision Record**: Each trade-off documented with rationale, impact, approval (`MASTER_SYSTEM_MANUAL.md` §6).
- **Risk Closure Proof**: Risk ID, mitigation steps, verification outcome (`MASTER_SYSTEM_MANUAL.md` §6.2).

## Continuous Improvement Loop
1. Collect gate metrics and post-release incidents.
2. Studio Coach facilitates retrospective; Workflow Optimizer drafts improvement actions.
3. Update SOPs and tests; store learnings in Byterover memory.

## Release Blockers
- Missing handoff packet.
- ADR absent for major architectural change.
- Any Level gate failure.
- Compliance checklist incomplete.
- BMAD checklist/template evidence missing or incomplete.
- Grafana alert unresolved.
- Prompt caching metrics missing or significant cache miss rate unexplained.
- Token counting or context overflow warnings ignored.

Only orchestrator can authorize release after validating all criteria with council approvals.
