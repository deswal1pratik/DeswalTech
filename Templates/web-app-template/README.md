# DeswalTech Web Application Template

A production-ready web application template with DeswalTech AI orchestration integration.

## Quick Start

### 1. Install DeswalTech
```bash
npm run deswaltech:install
```

### 2. Activate DeswalTech Powerhouse
```bash
npm run deswaltech:powerhouse
```

### 3. Start Development
```bash
npm run dev
```

### 4. Ask AI Team to Build Features
```bash
npm run deswaltech:ask "Build me a user authentication system"
```

## Project Structure

```
web-app-template/
├── src/
│   ├── backend/          # Node.js/Express backend
│   ├── frontend/         # React/Next.js frontend
│   └── shared/           # Shared utilities
├── tests/                # Test files
├── docs/                 # Documentation
├── .deswaltech/          # DeswalTech configuration
├── docker-compose.yml    # Local infrastructure
├── mcp.json             # MCP configuration
└── .cursorules          # Cursor AI rules
```

## Available Commands

### Development
- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code

### DeswalTech Commands
- `npm run deswaltech:powerhouse` - Activate DeswalTech
- `npm run deswaltech:ask "request"` - Ask AI team
- `npm run deswaltech:delegate` - Delegate tasks
- `npm run deswaltech:status` - Check system status
- `npm run deswaltech:tasks` - View tasks
- `npm run deswaltech:dashboard` - Open dashboard

## Features Included

- ✅ Backend API (Node.js/Express)
- ✅ Frontend UI (React/Next.js)
- ✅ Database (PostgreSQL)
- ✅ Authentication (JWT)
- ✅ Real-time features (WebSocket)
- ✅ Testing framework
- ✅ Monitoring (Prometheus)
- ✅ DeswalTech AI orchestration

## Getting Started with DeswalTech

1. **Install DeswalTech**: `npm run deswaltech:install`
2. **Activate Powerhouse**: `npm run deswaltech:powerhouse`
3. **Ask AI Team**: `npm run deswaltech:ask "Build me a feature"`
4. **Watch Magic**: Claude AI orchestrates specialist agents
5. **Get Production Code**: Receive complete, tested code

## MCPs Available

- **Supabase**: Database + Auth + Real-time
- **shadcn**: Component library
- **Figma**: Design system
- **Stripe**: Payment processing
- **Ref**: Code patterns
- **Exa**: AI research
- **BrowserMCP**: Web automation

## Quality Standards

- Code quality: Linted, formatted, TypeScript
- Testing: >80% coverage, integration, E2E
- Security: Authentication, authorization, encryption
- Performance: <100ms API, optimized queries
- Documentation: Complete setup and API docs

## Ready to Build

Tell Claude: "Take the Orchestrator role from .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md and build [your feature] using the specialist agents and MCPs."
