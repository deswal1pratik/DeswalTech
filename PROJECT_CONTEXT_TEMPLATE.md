# NexusAI Project Context: [Project Name]
**A single source of truth, meticulously maintained by the NexusAI team.**

- **Project Name:** `[Project Name]`
- **Version:** `1.0.0`
- **Status:** `PLANNING | BUILD | VALIDATE | SCALE`
- **Last Updated:** `[Date/Time]` by `[Agent Name]`

---

## 1. 🎯 Project Vision & Goals

### 1.1. Business Objective
*What is the core problem we are solving and for whom? What is the primary business value this project delivers?*

### 1.2. Target Audience
*Describe the primary and secondary user personas.*

### 1.3. Success Metrics (OKRs)
*How do we measure success? Define clear, measurable Objectives and Key Results.*

| Objective | Key Result 1 | Key Result 2 | Key Result 3 |
| :--- | :--- | :--- | :--- |
| e.g., Achieve Product-Market Fit | Achieve 10% weekly active user growth | Attain an NPS score of > 50 | Secure 100 paying customers |
| e.g., Deliver a World-Class UX | Lighthouse score > 95 on all pages | User satisfaction score > 4.5/5 | Zero WCAG 2.1 AA accessibility violations |

---

## 2. 🗺️ NexusAI Planning & Execution Artifacts

### 2.1. RPG-Structured PRD (Product Requirements Document)
*This is the output of the `prd-creator` skill. It defines all capabilities and features with their dependencies.*

**Link:** `[Link to 001-prd-project-name.md]`

### 2.2. TASKS.md (Master Task List)
*This is the output of the `task-parser` skill. It is the **source of truth** for project execution, topologically sorted by dependency.*

**Link:** `[Link to TASKS-0001.md]`

---

## 3. 🏗️ Architecture & Design

### 3.1. System Architecture
*High-level diagram of the system components (e.g., using C4 model conventions).*

```mermaid
graph TD
    A[User] --> B{Web App (Next.js)};
    B --> C{API (Fastify)};
    C --> D[Database (PostgreSQL)];
    C --> E[Cache (Redis)];
    C --> F[Object Storage (S3)];
```

### 3.2. Technology Stack
*The approved stack for this project. All agents must adhere to these choices.*

| Category | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js | `15+` | React 19 Server Components, performance |
| **Backend** | Fastify | `4.x` | High-performance, low overhead |
| **Database** | PostgreSQL | `16+` | Reliability, extensibility (pgvector) |
| **Caching** | Redis | `7+` | High-speed in-memory caching |
| **Deployment** | Kubernetes | `1.29+` | Scalability and orchestration |
| **Styling** | Tailwind CSS | `4+` | Utility-first, consistent design |
| **UI Components**| shadcn/ui | `Latest` | Accessible, high-quality components |

### 3.3. Architecture Decision Records (ADRs)
*A log of all significant architectural decisions.*

| ADR ID | Decision | Rationale | Status |
| :--- | :--- | :--- | :--- |
| `ADR-001` | Adopted a service-based architecture | Decouples components for independent scaling | ✅ Implemented |
| `ADR-002` | Chose Argon2id for password hashing | Recommended by OWASP, resistant to GPU attacks | ✅ Implemented |

---

## 4. 🚦 Quality Assurance Framework

### 4.1. Definition of Done (DoD)
*A feature is only "done" when it meets all these criteria. This is non-negotiable.*

- **Code:** Merged to `main` after passing all checks.
- **Testing:** >90% unit test coverage, all integration and E2E tests passing.
- **Security:** No critical or high vulnerabilities found by static analysis (SAST) or dependency scans.
- **Performance:** Meets all NFR performance targets.
- **Accessibility:** 100% WCAG 2.1 AA compliant.
- **Documentation:** All code is commented, API contracts are updated, and READMEs are current.
- **Approval:** Passed Level 1, 2, and 3 Quality Gates.

### 4.2. Quality Gates Status
*Tracks the project's adherence to the 3-Level Quality Gate framework.*

- **[ ] Level 1: Automated (CI/CD)**
  - [ ] Code Quality (Linting, Formatting)
  - [ ] Unit & Integration Tests
  - [ ] Security Scans (SAST, Dependency Check)
  - [ ] Performance & Accessibility Audits (Lighthouse)
- **[ ] Level 2: Integration (Staging)**
  - [ ] End-to-End Workflow Testing
  - [ ] API Contract Validation
  - [ ] Load & Stress Testing
  - [ ] Cross-Browser & Device Testing
- **[ ] Level 3: Business (Pre-Launch)**
  - [ ] Stakeholder Acceptance
  - [ ] Feature Completeness (PRD alignment)
  - [ ] User Experience Validation
  - [ ] Final Security Penetration Test

---

## 5. 📋 Non-Functional Requirements (NFRs)
*The critical quality attributes the system must exhibit.*

### 5.1. Performance
- **API Response Time:** p95 < 100ms, p99 < 250ms under 1000 RPS.
- **Page Load (LCP):** < 2.0 seconds for all key pages.
- **Frontend Bundle Size:** < 250KB gzipped for the initial load.

### 5.2. Security
- **Authentication:** Must use Argon2id for passwords and JWTs (15min access, 7day refresh).
- **Compliance:** Must adhere to OWASP Top 10 2025 and NIST SSDF.
- **Data:** All sensitive data encrypted at rest (AES-256-GCM) and in transit (TLS 1.3).
- **Authorization:** Role-Based Access Control (RBAC) and Row-Level Security (RLS) must be enforced.

### 5.3. Scalability & Reliability
- **Uptime:** 99.9% SLA.
- **Scalability:** System must be horizontally scalable to handle a 10x traffic increase without manual intervention (via Kubernetes HPA).
- **Data Integrity:** No data loss during database migrations or system failures.

### 5.4. Observability
- **Logging:** Structured JSON logs (e.g., Pino) for all services. All logs must have a `traceId`.
- **Metrics:** Key application and system metrics (e.g., request rate, error rate, latency) exposed via a `/metrics` endpoint for Prometheus.
- **Tracing:** Distributed tracing implemented for all cross-service API calls.

---

## 6. 🔌 API Contracts & Database Schema

### 6.1. OpenAPI Specification
*The single source of truth for all API endpoints.*

**Link:** `[Link to /docs/api/openapi.v1.json]`

### 6.2. Database Schema
*Visual diagram and migration scripts for the database.*

**Link:** `[Link to /db/schema.sql and /db/migrations/]`

---

## 7. 🚀 CI/CD & Deployment

### 7.1. Environments
| Environment | URL | Branch | Purpose |
| :--- | :--- | :--- | :--- |
| **Development** | `localhost` | `feature/*` | Local development |
| **Staging** | `staging.yourapp.com` | `main` | Pre-production E2E testing |
| **Production** | `yourapp.com` | `release/*` | Live user-facing environment |

### 7.2. CI/CD Pipeline
*Summary of the automated pipeline in GitHub Actions.*
1. **On Pull Request:** Run Linting -> Unit Tests -> SAST -> Build.
2. **On Merge to `main`:** Deploy to Staging -> Run E2E Tests -> Run Load Tests.
3. **On `release` tag:** Deploy to Production -> Smoke Tests -> Monitor.

---

## 8. 🤝 Handoff Notes Between Specialists
*A running log of critical information passed between agents to ensure seamless context transfer.*

#### `[Date/Time]` | `[From Agent]` -> `[To Agent]`
- **Task Completed:** `[ID and description of the task]`
- **Key Artifacts:** `[Links to code, docs, or configs]`
- **Critical Info:** `[e.g., "JWTs now include a 'role' claim. Frontend must parse this for UI logic."]`
- **Next Steps:** `[e.g., "Frontend can now build the admin dashboard using the new /api/admin/stats endpoint."]`

---
*This document is the living blueprint of the project. It must be updated by the responsible agent upon completion of any task that alters the project's state.*