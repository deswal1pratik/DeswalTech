# Project Context - Shared Team Knowledge

**Project Name:** [Project Name]
**Started:** [Date]
**Current Sprint:** Sprint [X]
**Last Updated:** [Date/Time]

---

## 📋 Project Vision & Goals

### Business Objective
[What problem does this solve? What value does it deliver?]

### Target Users
[Who will use this? User personas]

### Success Metrics
- **Primary Metric:** [e.g., User engagement +30%]
- **Secondary Metrics:** [e.g., Conversion rate, Retention]
- **Timeline:** [When to measure success]

---

## 🏗️ Architecture Overview

### System Architecture
```
[High-level architecture diagram in text/ASCII]

Example:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Database   │
│  (Next.js)  │     │  (Node.js)  │     │(PostgreSQL) │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌─────────────┐     ┌─────────────┐
│  Mobile App │     │    Redis    │
│    (RN)     │     │   (Cache)   │
└─────────────┘     └─────────────┘
```

### Technology Stack

**Backend:**
- Language: [e.g., Node.js 20 LTS, TypeScript 5+]
- Framework: [e.g., Express.js 4.19+]
- Database: [e.g., PostgreSQL 16+, Redis 7+]
- ORM: [e.g., Prisma 5+]
- Auth: [e.g., Supabase Auth, JWT]

**Frontend:**
- Framework: [e.g., Next.js 15+, React 19+]
- UI Library: [e.g., shadcn/ui, TailwindCSS 4+]
- State: [e.g., Zustand, React Query v5]
- Testing: [e.g., Vitest, Playwright]

**Mobile:**
- Framework: [e.g., React Native 0.74+, Expo SDK 51+]
- Navigation: [e.g., React Navigation 6+]
- Storage: [e.g., MMKV, SQLite]

**DevOps:**
- Container: [e.g., Docker, Kubernetes 1.29+]
- CI/CD: [e.g., GitHub Actions]
- Monitoring: [e.g., Prometheus, Grafana]
- Cloud: [e.g., AWS, GCP, Azure]

### Architecture Decisions (ADRs)

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Use Supabase for auth | Faster dev, proven solution | 2025-01-15 | ✅ Implemented |
| Next.js App Router | Latest features, performance | 2025-01-15 | ✅ Implemented |
| Kubernetes deployment | Scalability, cloud-native | 2025-01-16 | 🔄 In Progress |

---

## 🔌 API Contracts

### Authentication Endpoints

```typescript
// POST /api/auth/signup
Request: {
  email: string;
  password: string;
  name: string;
}
Response: {
  user: User;
  session: Session;
}

// POST /api/auth/login
Request: {
  email: string;
  password: string;
}
Response: {
  user: User;
  session: Session;
  accessToken: string;
}
```

### Core API Endpoints

```typescript
// GET /api/v1/projects
Query: {
  page?: number;
  limit?: number;
  status?: 'active' | 'completed' | 'archived';
}
Response: {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

// POST /api/v1/projects
Request: {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
}
Response: {
  project: Project;
}

// [Add all endpoints here]
```

### WebSocket Events

```typescript
// Real-time Events
type SocketEvents = {
  'project:created': (project: Project) => void;
  'project:updated': (project: Project) => void;
  'project:deleted': (projectId: string) => void;
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
}
```

**OpenAPI Specification:** [Link to OpenAPI/Swagger docs]

---

## 🗄️ Database Schema

### Tables

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- [Add all tables here]
```

### Migrations

| Migration | Description | Date | Status |
|-----------|-------------|------|--------|
| 001_init | Initial schema | 2025-01-15 | ✅ Applied |
| 002_add_projects | Projects table | 2025-01-16 | ✅ Applied |
| 003_add_teams | Teams feature | 2025-01-17 | 🔄 Pending |

---

## 🎨 Design System & UI Guidelines

### Color Palette
```css
/* Primary Colors */
--primary: #3B82F6;        /* Blue 500 */
--primary-dark: #2563EB;   /* Blue 600 */
--primary-light: #60A5FA;  /* Blue 400 */

/* Semantic Colors */
--success: #10B981;        /* Green 500 */
--error: #EF4444;          /* Red 500 */
--warning: #F59E0B;        /* Amber 500 */
--info: #3B82F6;           /* Blue 500 */

/* Neutral Colors */
--background: #FFFFFF;
--foreground: #000000;
--muted: #F3F4F6;
--border: #E5E7EB;
```

### Typography
```css
/* Font Family */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Component Library
Using **shadcn/ui** components:
- Button, Input, Select, Checkbox, Radio
- Dialog, Sheet, Popover, Tooltip
- Table, Card, Badge, Avatar
- Form, Alert, Toast
- [Full list in shadcn docs]

### Figma Design
**Figma Link:** [Link to Figma design files]

---

## 🔒 Security Requirements

### Authentication
- ✅ JWT with short expiration (15 min access, 7 day refresh)
- ✅ Passkeys/WebAuthn support
- ✅ OAuth providers (Google, GitHub)
- ✅ MFA (Time-based OTP)

### Authorization
- ✅ Role-Based Access Control (RBAC)
- ✅ Row-Level Security (PostgreSQL RLS)
- ✅ API key management for external integrations

### Data Protection
- ✅ Encryption at rest (AES-256-GCM)
- ✅ Encryption in transit (TLS 1.3)
- ✅ Sensitive data masking in logs
- ✅ Regular security audits

### Compliance
- ✅ GDPR compliant
- ✅ SOC 2 (in progress)
- ✅ OWASP Top 10 2025 mitigated
- ✅ Regular penetration testing

---

## ⚡ Performance Targets

### API Performance
- **p50:** <50ms
- **p95:** <100ms
- **p99:** <200ms
- **Error rate:** <0.1%

### Frontend Performance
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s
- **Time to Interactive:** <3.5s
- **Cumulative Layout Shift:** <0.1
- **Lighthouse Score:** >95

### Database Performance
- **Query time (p95):** <50ms
- **Connection pool:** 20-100 connections
- **Cache hit rate:** >80%

---

## 📊 Current Sprint Status

### Sprint [X]: [Sprint Name]
**Duration:** [Start Date] - [End Date]
**Goal:** [Sprint goal]

#### Completed Tasks ✅
- [x] Task 1 - Backend Expert - API endpoints
- [x] Task 2 - Frontend Expert - Login page
- [x] Task 3 - Security Expert - Auth flow review

#### In Progress 🔄
- [ ] Task 4 - Frontend Expert - Dashboard (70% complete)
- [ ] Task 5 - Mobile Expert - App setup (50% complete)

#### Blocked 🚫
- [ ] Task 6 - DevOps Expert - K8s deployment (waiting for cloud credentials)

#### Next Up 📝
- [ ] Task 7 - QA Expert - Integration tests
- [ ] Task 8 - Backend Expert - Payment API

#### Sprint Metrics
- **Velocity:** 45 story points
- **Completed:** 28 points (62%)
- **Remaining:** 17 points (38%)
- **Blockers:** 1
- **On Track:** ✅ Yes

---

## 🤝 Handoff Notes Between Specialists

### Latest Handoffs

#### Backend → Frontend (2025-01-17 14:30)
**From:** Backend Expert
**To:** Frontend Expert

**Completed:**
- ✅ Authentication API endpoints
- ✅ Project CRUD APIs
- ✅ WebSocket server setup

**API Documentation:**
- OpenAPI spec: `/docs/api/openapi.json`
- Postman collection: `/docs/api/postman_collection.json`
- WebSocket events: See "API Contracts" section above

**Environment Variables Needed:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**Notes:**
- JWT tokens expire in 15 minutes
- Use `/api/auth/refresh` to get new access token
- WebSocket requires authentication via query param: `?token=<access_token>`
- Rate limiting: 100 requests per 15 minutes per IP

**Integration Points:**
- Login: POST `/api/auth/login` → save token → redirect to dashboard
- Projects list: GET `/api/v1/projects` → display in table
- Real-time: Subscribe to `project:created` event for live updates

**Known Issues:**
- None currently

#### Frontend → Mobile (2025-01-18 10:00)
**From:** Frontend Expert
**To:** Mobile Expert

**Completed:**
- ✅ shadcn/ui components setup
- ✅ Login/signup flows
- ✅ Dashboard layout
- ✅ Project list view

**Shared Components:**
- Button, Input, Card components (can be adapted to React Native)
- Color palette and typography (see Design System above)
- Form validation schemas (Zod - can be reused)

**UI Patterns:**
- Bottom sheet for modals on mobile
- Swipe actions for delete/archive
- Pull-to-refresh for lists
- Skeleton loaders during fetch

**API Integration:**
- Axios client configured (see `/lib/api-client.ts`)
- React Query hooks (see `/hooks/use-projects.ts`)
- Error handling pattern (see `/lib/error-handler.ts`)

**Notes:**
- Use same API endpoints as web
- Implement offline storage with MMKV
- Add retry logic for failed requests
- Consider bandwidth - optimize image sizes

#### Mobile → DevOps (2025-01-19 16:00)
**From:** Mobile Expert
**To:** DevOps Expert

**Deployment Requirements:**
- iOS: Xcode 15+, Swift 5.9+, Deployment target iOS 15+
- Android: Android Studio latest, Kotlin 1.9+, minSdk 24, targetSdk 34
- Build tools: Fastlane for automation
- Code signing: Certificates and provisioning profiles needed
- App Center for distribution (beta testing)

**Environment Variables:**
```env
API_URL=https://api.production.com
WS_URL=wss://api.production.com
SENTRY_DSN=https://...
```

**Native Modules:**
- react-native-mmkv (storage)
- react-native-push-notification (notifications)
- react-native-biometrics (fingerprint/face ID)

**Build Scripts:**
```bash
# iOS
npm run ios:build:staging
npm run ios:build:production

# Android
npm run android:build:staging
npm run android:build:production
```

---

## 🐛 Known Issues & Risks

### Active Issues

| Issue | Severity | Assigned To | Status | Notes |
|-------|----------|-------------|--------|-------|
| #001 | High | Backend Expert | 🔄 In Progress | Database connection pool exhaustion under load |
| #002 | Medium | Frontend Expert | ✅ Resolved | Form validation not showing error messages |
| #003 | Low | QA Expert | 📝 Open | E2E tests flaky on CI |

### Risks & Mitigation

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| Cloud credentials delay | High | Medium | Use local deployment first | DevOps Expert |
| Third-party API rate limit | Medium | Low | Implement caching and queue | Backend Expert |
| Mobile app store review | Low | Medium | Follow guidelines strictly | Mobile Expert |

---

## 📚 Documentation & Resources

### Code Documentation
- **API Docs:** [Link to Swagger/Redoc]
- **Component Storybook:** [Link to Storybook]
- **Architecture Diagrams:** `/docs/architecture/`
- **ADRs:** `/docs/adr/`

### Deployment Documentation
- **Setup Guide:** `/docs/setup.md`
- **Deployment Runbook:** `/docs/deployment.md`
- **Environment Variables:** `/docs/environment.md`
- **Troubleshooting:** `/docs/troubleshooting.md`

### Team Resources
- **Project Management:** [Link to Jira/Linear]
- **Design Files:** [Link to Figma]
- **Git Repository:** [Link to GitHub]
- **CI/CD:** [Link to GitHub Actions]
- **Monitoring:** [Link to Grafana]

---

## 📈 Metrics & Analytics

### Development Metrics
- **Sprint Velocity:** 45 story points/sprint
- **Test Coverage:** 87% (target: >85%)
- **Code Quality:** A (SonarQube)
- **Technical Debt:** 2 days (low)

### Performance Metrics
- **API Response Time (p95):** 89ms (target: <100ms) ✅
- **Page Load Time (p95):** 1.8s (target: <2s) ✅
- **Error Rate:** 0.05% (target: <0.1%) ✅
- **Uptime:** 99.97% (target: >99.9%) ✅

### Business Metrics
- **Active Users:** [Number]
- **User Retention (30d):** [Percentage]
- **NPS Score:** [Score]
- **Conversion Rate:** [Percentage]

---

## 🎯 Next Steps

### Immediate (This Sprint)
1. Complete dashboard implementation (Frontend Expert)
2. Finish mobile app setup (Mobile Expert)
3. Resolve database connection pool issue (Backend Expert)
4. Setup staging environment (DevOps Expert)

### Short-term (Next 2 Sprints)
1. Integration testing (QA Expert)
2. Security audit (Security Expert)
3. Performance optimization (All)
4. Production deployment (DevOps Expert)

### Long-term (Next Quarter)
1. Feature expansion (Business Expert → Orchestrator)
2. Scalability improvements (DevOps Expert)
3. User feedback integration (Business Expert)
4. International expansion (All)

---

## 📝 Meeting Notes

### Sprint Planning (2025-01-15)
- Decided on sprint goals
- Estimated all user stories
- Identified dependencies
- Assigned tasks to specialists

### Daily Standup (2025-01-17)
- Backend: API endpoints completed, handoff to Frontend
- Frontend: Dashboard in progress, needs API docs
- Mobile: Waiting for frontend patterns
- DevOps: Cloud setup blocked on credentials
- QA: Test plan ready
- Security: Auth flow reviewed
- Business: Market research completed

### Sprint Review (2025-01-19)
- Demo: Authentication and project management
- Feedback: Users want dark mode
- Retrospective: Communication excellent, need better CI
- Next sprint: Focus on mobile app and deployment

---

**Last Updated By:** [Specialist Name]
**Last Update:** [Date/Time]
**Next Review:** [Date]

---

*This document is the single source of truth for the project. All specialists must update it after completing work and before handoff.*
