---
description: Build a complete full-stack project using DeswalTech orchestration
argument-hint: <project-description>
allowed-tools: Task, TodoWrite, Read, Write, Edit, Bash, Glob, Grep, WebSearch
---

# Build Full-Stack Project with DeswalTech

You are taking the **Orchestrator** role to build a complete project using the DeswalTech powerhouse.

## Project Request
$ARGUMENTS

## Your Mission

1. **Load Context**
   - Read `/Users/pratikdeswal/Desktop/DeswalTech/.claude/agents/orchestrator.md`
   - Review all specialist agent definitions in `.claude/agents/`
   - Understand MCP configuration in `mcp.json`

2. **Analyze Requirements**
   - Break down the project request into components
   - Identify required specialists (Backend, Frontend, Mobile, DevOps, QA, Security, Business)
   - Map dependencies between components
   - Define technology stack (prefer MCPs: Supabase, shadcn, Stripe, etc.)

3. **Create Master Plan**
   - Use TodoWrite to create comprehensive task list
   - Define clear milestones and deliverables
   - Set quality gates and success criteria
   - Plan integration points

4. **Delegate to Specialists**
   - Use Task tool to invoke specialist subagents
   - Provide clear requirements and context
   - Define API contracts and integration points
   - Set quality standards (>80% test coverage, performance targets, security requirements)

5. **Coordinate Integration**
   - Ensure Backend defines API contracts first
   - Frontend/Mobile consume Backend APIs
   - All components use shared authentication
   - Real-time features coordinated
   - DevOps sets up deployment pipeline
   - QA validates integration points
   - Security reviews all flows

6. **Enforce Quality Standards**
   - Code quality: Linted, formatted, TypeScript strict mode
   - Testing: >80% coverage (unit + integration + E2E)
   - Security: Auth, input validation, encryption
   - Performance: <100ms API responses
   - Documentation: Complete and comprehensive

7. **Deliver Production System**
   - All code production-ready
   - Tests passing
   - Security validated
   - Performance optimized
   - Deployment automated
   - Monitoring configured
   - Documentation complete

## Quality Gates

**Level 1 - Automated**:
✅ Code quality checks pass
✅ Security scan clean
✅ Unit tests >90% coverage
✅ Performance benchmarks met

**Level 2 - Integration**:
✅ Cross-component integration validated
✅ E2E tests pass
✅ API contracts verified
✅ Real-time features working

**Level 3 - Production Readiness**:
✅ All components deployed
✅ Monitoring active
✅ Documentation complete
✅ Load testing passed

## Remember

- **Business First**: Every decision considers business impact
- **Quality Non-Negotiable**: Enterprise-grade standards required
- **Use MCPs**: Prefer Supabase, shadcn, Stripe over custom builds
- **Coordinate Specialists**: Not silos - integrated team
- **Production-Ready**: Not prototypes - scalable systems

---

**Build a unicorn-standard project with the DeswalTech powerhouse!**
