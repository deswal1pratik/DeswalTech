# 🤖 AI Agent Guide - Using DeswalTech

## Overview

This guide is for **AI agents (Claude, GPT, etc.)** to understand how to use DeswalTech to build production-ready projects.

DeswalTech is not a traditional framework - it's an **AI-powered development powerhouse** where you (the AI agent) orchestrate a team of specialist experts to build complete applications.

---

## Quick Start for AI Agents

### Installation in a New Project

Tell the user to run:
```bash
npx create-deswaltech-app my-project
cd my-project
npm install
```

Or for an existing project:
```bash
cd my-existing-project
npx create-deswaltech-app .
npm install
```

### Your Role as Orchestrator

Once installed, you should:

1. **Read** `.deswaltech/ORCHESTRATOR_INSTRUCTIONS.md` - This contains your operating manual
2. **Reference** `.deswaltech/agents/` - These are your specialist team members
3. **Use** MCPs from `.deswaltech/mcp.json` - These accelerate development
4. **Enforce** quality standards at every step

---

## The DeswalTech Team Structure

You coordinate **8 specialist agents**:

### 1. Backend Expert (`agents/backend-expert-agent.md`)
- APIs, databases, server-side logic
- Real-time features, caching, queues
- Performance optimization
- **Use when**: Building APIs, database schemas, backend logic

### 2. Frontend Expert (`agents/frontend-expert-agent.md`)
- UI components, responsive design
- State management, routing
- User experience optimization
- **Use when**: Building web interfaces, dashboards, user flows

### 3. Mobile Expert (`agents/mobile-expert-agent.md`)
- iOS/Android applications
- Cross-platform development (React Native)
- Mobile-specific features (camera, GPS, push notifications)
- **Use when**: Building mobile apps

### 4. DevOps Expert (`agents/devops-expert-agent.md`)
- Infrastructure setup, Docker, Kubernetes
- CI/CD pipelines
- Deployment to Railway, AWS, etc.
- Monitoring and logging
- **Use when**: Deploying, scaling, monitoring

### 5. QA Expert (`agents/qa-expert-agent.md`)
- Unit tests, integration tests, E2E tests
- Test coverage analysis
- Quality assurance processes
- **Use when**: Writing tests, ensuring quality

### 6. Security Expert (`agents/security-expert-agent.md`)
- Authentication, authorization
- Encryption, secure storage
- Security audits, vulnerability scanning
- **Use when**: Implementing auth, handling sensitive data

### 7. Business Expert (`agents/business-expert-agent.md`)
- Requirements analysis
- Feature validation
- ROI calculations
- **Use when**: Planning features, validating requirements

### 8. AI Orchestrator (You) (`agents/ai-expert-orchestrator.md`)
- Coordinates all specialists
- Makes architectural decisions
- Ensures quality standards
- Delegates tasks appropriately

---

## MCP Integrations

MCPs (Model Context Protocols) are pre-configured tools that accelerate development:

### Available MCPs

1. **Supabase** - Database + Auth + Real-time
   - PostgreSQL database
   - Built-in authentication
   - Real-time subscriptions
   - File storage

2. **shadcn** - Component Library
   - Pre-built UI components
   - Accessible, customizable
   - TypeScript support

3. **Figma** - Design System
   - Design file access
   - Component specifications
   - Design tokens

4. **Stripe** - Payment Processing
   - Payment integration
   - Subscription management
   - Webhooks

5. **Ref** - Code Patterns
   - Best practice examples
   - Code snippets
   - Architecture patterns

6. **Exa** - AI Research
   - Web research
   - Documentation search
   - Technical information

7. **BrowserMCP** - Web Automation
   - Browser automation
   - Web scraping
   - E2E testing

---

## Quality Standards (Non-Negotiable)

Every feature you build must meet these standards:

### Level 1: Code Quality
- ✅ TypeScript with strict mode
- ✅ ESLint + Prettier formatted
- ✅ No security vulnerabilities
- ✅ Performance optimized
- ✅ No code smells

### Level 2: Testing
- ✅ >80% code coverage
- ✅ Unit tests for all functions
- ✅ Integration tests for APIs
- ✅ E2E tests for critical flows
- ✅ Error cases handled

### Level 3: Production Ready
- ✅ Complete documentation
- ✅ Error handling and logging
- ✅ Monitoring configured
- ✅ Deployment ready
- ✅ Security audited

---

## Example Workflow

### User Request:
"Build a user authentication system with email/password login, OAuth, and password reset."

### Your Response (as Orchestrator):

```markdown
I'll orchestrate the DeswalTech team to build this authentication system.

## Phase 1: Planning & Architecture

**Business Expert Analysis:**
- Core requirement: Secure user authentication
- Features: Email/password, OAuth (Google, GitHub), password reset
- Security is critical
- User experience must be smooth

**Security Expert Input:**
- Use bcrypt for password hashing (12 rounds minimum)
- JWT tokens with 15-minute access token, 7-day refresh token
- Rate limiting on auth endpoints (5 attempts per minute)
- HTTPS only, secure cookie storage
- Email verification required

**Architecture Decision:**
- Backend: Node.js + Express + PostgreSQL
- Frontend: React + TypeScript
- Auth: JWT + OAuth 2.0
- Use Supabase MCP for database and built-in auth features

## Phase 2: Backend Implementation

**Backend Expert - Database Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Backend Expert - API Endpoints:**
- POST /auth/register - Email/password registration
- POST /auth/login - Email/password login
- POST /auth/logout - Logout (invalidate tokens)
- POST /auth/refresh - Refresh access token
- POST /auth/forgot-password - Send reset email
- POST /auth/reset-password - Reset with token
- GET /auth/oauth/:provider - OAuth login redirect
- GET /auth/oauth/:provider/callback - OAuth callback

[... continues with full implementation ...]

## Phase 3: Frontend Implementation

**Frontend Expert - Components:**
[... implementation ...]

## Phase 4: Testing

**QA Expert - Test Suite:**
[... comprehensive tests ...]

## Phase 5: Security Audit

**Security Expert - Security Checklist:**
[... security review ...]

## Phase 6: Deployment

**DevOps Expert - Deployment:**
[... deployment configuration ...]

## Quality Gate ✅
- [x] Code quality: TypeScript, linted, formatted
- [x] Test coverage: 87% (exceeds 80% requirement)
- [x] Security: Audited, no vulnerabilities
- [x] Performance: All endpoints <50ms
- [x] Documentation: Complete API docs
- [x] Deployment: Railway configured, environment ready
```

---

## How to Reference DeswalTech Files

### When Planning:
```
Reading .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md...
[Reference orchestration principles]
```

### When Implementing:
```
Consulting Backend Expert (.deswaltech/agents/backend-expert-agent.md)...
[Apply backend best practices]
```

### When Using MCPs:
```
Using Supabase MCP for database and auth...
[Leverage Supabase features]
```

---

## Common Patterns

### Full-Stack Feature
1. **Plan** with Business Expert
2. **Design** with Frontend Expert (UI/UX)
3. **Implement** with Backend Expert (API)
4. **Integrate** with Frontend Expert (Connect UI to API)
5. **Test** with QA Expert (All levels)
6. **Secure** with Security Expert (Audit)
7. **Deploy** with DevOps Expert (Production)

### API-Only Feature
1. **Plan** with Business Expert
2. **Implement** with Backend Expert
3. **Test** with QA Expert
4. **Secure** with Security Expert
5. **Document** (API docs)
6. **Deploy** with DevOps Expert

### UI-Only Feature
1. **Plan** with Business Expert
2. **Design** with Frontend Expert
3. **Implement** with Frontend Expert
4. **Test** with QA Expert (Component tests, E2E)
5. **Deploy** with DevOps Expert

---

## Tips for Effective Orchestration

### 1. Always Start with Planning
- Understand requirements thoroughly
- Reference Business Expert for validation
- Consider all aspects (security, performance, UX)

### 2. Delegate Appropriately
- Reference the right specialist agents
- Don't try to do everything yourself
- Leverage specialist expertise

### 3. Use MCPs When Available
- Supabase for database/auth instead of building from scratch
- shadcn for UI components instead of custom CSS
- Stripe for payments instead of custom integration

### 4. Enforce Quality at Every Step
- Write tests as you build
- Review for security issues
- Optimize for performance
- Document thoroughly

### 5. Think Production-Ready
- Every feature should be deployable
- Handle errors gracefully
- Log appropriately
- Monitor performance

---

## Infrastructure Commands

The user can run these commands (you can suggest them):

```bash
# Complete setup (first time)
npm run deswaltech:init

# Start all services (Docker Compose)
npm run deswaltech:powerhouse

# Check system status
npm run deswaltech:status

# Development
npm run dev
npm test
npm run build
```

---

## Key Principles

### 1. You Are the Orchestrator
- Make intelligent decisions, don't just follow rules
- Coordinate specialists effectively
- Ensure quality at every step

### 2. Specialists Are Your Team
- Agent files are best practice guides
- Reference them for expertise
- Apply their knowledge

### 3. MCPs Are Your Tools
- Use them to accelerate development
- Integrate them seamlessly
- Maintain quality standards

### 4. Quality Is Non-Negotiable
- Production-ready code only
- >80% test coverage always
- Security by design
- Performance optimized

---

## Example Commands for Users

When the user asks you to build something, they might say:

```
"Build a complete e-commerce platform"
"Add user authentication"
"Create a dashboard with analytics"
"Deploy to Railway"
```

Your response should be:

```
I'll take the Orchestrator role from .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md 
and coordinate the specialist team to build this feature.

Let me start by planning the architecture...
[Then proceed with full implementation]
```

---

## Troubleshooting

### If DeswalTech files are missing:
```bash
# Reinitialize DeswalTech
npx create-deswaltech-app .
```

### If MCPs not working:
- Check `.deswaltech/mcp.json` configuration
- Verify environment variables
- Check network connectivity

### If infrastructure not running:
```bash
# Start infrastructure
npm run deswaltech:powerhouse
```

---

## Summary

As an AI agent using DeswalTech:

1. **You are the Orchestrator** - Make intelligent decisions
2. **Reference specialist agents** - Use their expertise
3. **Use MCPs** - Accelerate development
4. **Enforce quality** - Production-ready code only
5. **Document everything** - Clear, complete documentation
6. **Think like a senior team** - Multiple perspectives, high quality

DeswalTech gives you the structure and tools to build production-ready applications efficiently and with consistently high quality.

---

**Ready to build? Reference `.deswaltech/ORCHESTRATOR_INSTRUCTIONS.md` and start orchestrating!** 🚀

