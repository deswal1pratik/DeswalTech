# 🚀 DeswalTech Installation Guide

Complete guide to installing and using DeswalTech in your projects.

---

## Quick Installation

### Method 1: NPX (Recommended - After npm publish)

Once published to npm:

```bash
# Create new project
npx create-deswaltech-app my-project
cd my-project
npm install

# Start building
# Open in Cursor and tell Claude to use DeswalTech
```

### Method 2: Direct from GitHub (Available Now)

```bash
# Clone the repository
git clone https://github.com/pratikdeswal/deswaltech.git

# Navigate to your project
cd my-new-project

# Initialize DeswalTech
npx /path/to/deswaltech/bin/create-deswaltech-app .

# Or use the global install
cd /path/to/deswaltech
npm install -g .
create-deswaltech-app my-project
```

### Method 3: Install as Package from GitHub

```bash
# Create your project
mkdir my-project
cd my-project
npm init -y

# Install DeswalTech from GitHub
npm install github:pratikdeswal/deswaltech

# Initialize in your project
npx create-deswaltech-app .
```

---

## What Gets Installed?

When you run `create-deswaltech-app`, it creates:

```
your-project/
├── .deswaltech/                 # DeswalTech configuration
│   ├── agents/                  # 8 specialist agents
│   ├── Infrastructure/          # Docker Compose setup
│   ├── mcp-server/             # MCP orchestration server
│   ├── Templates/              # Project templates
│   ├── Tools/                  # Utility scripts
│   ├── scripts/                # Helper scripts
│   ├── ORCHESTRATOR_INSTRUCTIONS.md
│   └── DESWALTECH_GUIDE.md
├── src/                        # Your source code
│   ├── backend/
│   ├── frontend/
│   └── shared/
├── tests/                      # Your tests
├── docs/                       # Your documentation
├── .cursorules                 # Cursor AI configuration
├── .gitignore                  # Git ignore
├── docker-compose.yml          # Local infrastructure
├── mcp.json                    # MCP configuration
├── AI_AGENT_GUIDE.md           # Guide for AI agents
├── README.md                   # Project README
└── package.json                # Updated with DeswalTech scripts
```

---

## Post-Installation Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Read the Guides

```bash
# For AI Agents (Claude, GPT, etc.)
cat AI_AGENT_GUIDE.md

# For understanding orchestration
cat .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md

# For complete documentation
ls .deswaltech/docs/
```

### 3. Start Infrastructure (Optional)

If you need PostgreSQL, Redis, MinIO, etc.:

```bash
# First time setup
npm run deswaltech:init

# Start all services
npm run deswaltech:powerhouse

# Check status
npm run deswaltech:status
```

### 4. Start Building

#### With AI (Recommended):

Open your project in Cursor and tell Claude:

```
Take the Orchestrator role from .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md

Build a [your feature description] with:
- [requirement 1]
- [requirement 2]
- [requirement 3]

Use the specialist agents from .deswaltech/agents/ and MCPs for acceleration.
Ensure >80% test coverage and production-ready quality.
```

#### Traditional Development:

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## Usage Examples

### Example 1: E-commerce Platform

```bash
npx create-deswaltech-app my-ecommerce
cd my-ecommerce
npm install

# Open in Cursor, tell Claude:
"Build a complete e-commerce platform with product catalog, shopping cart, 
checkout, Stripe payments, order tracking, and admin dashboard"
```

### Example 2: SaaS Application

```bash
npx create-deswaltech-app my-saas
cd my-saas
npm install

# Tell Claude:
"Build a SaaS application with user authentication, subscription management, 
dashboard with analytics, API for integrations, and email notifications"
```

### Example 3: Mobile App Backend

```bash
npx create-deswaltech-app mobile-backend
cd mobile-backend
npm install

# Tell Claude:
"Build a mobile app backend with REST API, real-time notifications, 
file uploads, user management, and push notifications"
```

---

## Verification

To verify DeswalTech is properly installed:

```bash
# In DeswalTech repository
npm run verify

# In your project
ls -la .deswaltech/
cat AI_AGENT_GUIDE.md
```

---

## Available Commands (in your project)

### DeswalTech Commands

```bash
npm run deswaltech:init        # Complete setup (first time)
npm run deswaltech:powerhouse  # Start all services
npm run deswaltech:status      # Check system status
```

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run lint     # Lint code
```

---

## Troubleshooting

### Issue: `create-deswaltech-app` not found

**Solution:**
```bash
# Install globally
npm install -g deswaltech

# Or use full path
npx /path/to/deswaltech/bin/create-deswaltech-app my-project
```

### Issue: Permission denied

**Solution:**
```bash
# Make scripts executable
chmod +x bin/create-deswaltech-app
chmod +x bin/deswaltech
```

### Issue: npm install fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Try again
npm install
```

### Issue: Docker services won't start

**Solution:**
```bash
# Check Docker is running
docker --version

# Start Docker Desktop (macOS/Windows)
# Or Docker daemon (Linux)

# Try again
npm run deswaltech:powerhouse
```

### Issue: MCP server not starting

**Solution:**
```bash
# Check logs
cat /tmp/mcp_server.log

# Manually start MCP server
cd .deswaltech/mcp-server
npm install
npm run build
npm start
```

---

## Configuration

### Environment Variables

Create `.env` in your project root:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp

# Redis
REDIS_URL=redis://:redispass@localhost:6379

# Storage (MinIO)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123

# API Keys (add your own)
SUPABASE_ACCESS_TOKEN=your_token_here
EXA_API_KEY=your_key_here
```

### MCP Configuration

Edit `.deswaltech/mcp.json` to configure MCPs:

```json
{
  "mcpServers": {
    "supabase": { ... },
    "shadcn": { ... },
    "stripe": { ... }
  }
}
```

---

## Updating DeswalTech

### From npm (after published):

```bash
npm update deswaltech
npx create-deswaltech-app . --force
```

### From GitHub:

```bash
cd /path/to/deswaltech
git pull origin main
npm install

# In your project
npx /path/to/deswaltech/bin/create-deswaltech-app . --force
```

---

## Uninstalling

To remove DeswalTech from a project:

```bash
# Remove DeswalTech files
rm -rf .deswaltech

# Remove from package.json
npm uninstall deswaltech

# Remove DeswalTech scripts from package.json manually
# Remove .cursorules if desired
```

---

## Support

- **Documentation**: [GitHub README](https://github.com/pratikdeswal/deswaltech#readme)
- **Issues**: [GitHub Issues](https://github.com/pratikdeswal/deswaltech/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pratikdeswal/deswaltech/discussions)
- **AI Agent Guide**: `AI_AGENT_GUIDE.md` in your project

---

## Next Steps

1. ✅ Install DeswalTech
2. 📚 Read `AI_AGENT_GUIDE.md`
3. 🤖 Open in Cursor and start building
4. 🚀 Deploy to Railway/Vercel/etc.

**Ready to build? Start with AI orchestration!** 🎯

