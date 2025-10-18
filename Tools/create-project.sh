#!/bin/bash

# 🦄 Unicorn Project Creator
# Creates a new project anywhere on your machine with infrastructure pre-configured

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Help text
if [ "$1" == "-h" ] || [ "$1" == "--help" ] || [ -z "$1" ]; then
    echo "🦄 Unicorn Project Creator"
    echo ""
    echo "Usage:"
    echo "  ./create-project.sh <project-name> [location]"
    echo ""
    echo "Examples:"
    echo "  ./create-project.sh my-app                    # Creates in current directory"
    echo "  ./create-project.sh my-app ~/Desktop         # Creates on Desktop"
    echo "  ./create-project.sh my-app ~/Documents       # Creates in Documents"
    echo ""
    echo "What it does:"
    echo "  1. Creates Next.js app with TypeScript & Tailwind"
    echo "  2. Adds .env.local configured for infrastructure"
    echo "  3. Creates PostgreSQL database"
    echo "  4. Installs dependencies"
    echo "  5. Ready to code!"
    echo ""
    exit 0
fi

PROJECT_NAME=$1
LOCATION=${2:-.}  # Default to current directory if not specified

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running!${NC}"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    exit 1
fi

# Check if infrastructure is running
if ! docker ps | grep -q unicorn-postgres; then
    echo -e "${YELLOW}⚠️  Infrastructure is not running!${NC}"
    echo ""
    echo "Starting infrastructure..."
    cd ~/Developer/Infrastructure && ./start-services.sh
    echo ""
fi

echo -e "${BLUE}🦄 Creating Unicorn Project: ${PROJECT_NAME}${NC}"
echo ""

# Navigate to location
cd "$LOCATION"

# Create Next.js app
echo "📦 Creating Next.js application..."
npx create-next-app@latest "$PROJECT_NAME" \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias "@/*" \
    --use-pnpm \
    --yes

cd "$PROJECT_NAME"

# Create database name (replace hyphens with underscores)
DB_NAME=$(echo "$PROJECT_NAME" | tr '-' '_')_db

# Create .env.local
echo ""
echo "⚙️  Configuring environment..."
cat > .env.local << EOF
# ===================================
# Infrastructure Connections
# ===================================
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${DB_NAME}
REDIS_URL=redis://:redispass@localhost:6379

# MinIO (S3-compatible storage)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_BUCKET=${PROJECT_NAME}-uploads
S3_REGION=us-east-1

# ===================================
# Application Config
# ===================================
NEXT_PUBLIC_APP_NAME=${PROJECT_NAME}
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ===================================
# AI Services (Add your keys)
# ===================================
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
EOF

# Create database
echo ""
echo "🗄️  Creating database: ${DB_NAME}..."
if psql -U postgres -h localhost -c "CREATE DATABASE ${DB_NAME};" 2>/dev/null; then
    echo -e "${GREEN}✅ Database created!${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already exist or there was an error.${NC}"
fi

# Add helpful README section
echo ""
echo "📝 Adding infrastructure notes to README..."
cat >> README.md << 'EOF'

## 🏗️ Infrastructure

This project connects to the Unicorn Infrastructure running at:
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **MinIO**: localhost:9000

### Prerequisites

Make sure infrastructure is running:
```bash
cd ~/Developer/Infrastructure
./start-services.sh
```

### Environment Variables

All configuration is in `.env.local`. Copy `.env.example` if you need to reset.

### Database Management

```bash
# Connect to database
psql -U postgres -h localhost -d $DB_NAME

# View in pgAdmin
open http://localhost:5050
```

### File Storage

MinIO Console: http://localhost:9001  
Credentials: minioadmin / minioadmin123

---

**Infrastructure Location**: `~/Developer/Infrastructure/`  
**Documentation**: See `~/Developer/README.md`
EOF

# Create .env.example (copy of .env.local but without secrets)
cp .env.local .env.example

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Success!
echo ""
echo -e "${GREEN}✅ Project created successfully!${NC}"
echo ""
echo "📍 Location: ${LOCATION}/${PROJECT_NAME}"
echo "🗄️  Database: ${DB_NAME}"
echo ""
echo "🚀 Next steps:"
echo "   cd ${LOCATION}/${PROJECT_NAME}"
echo "   pnpm dev"
echo ""
echo "📊 View infrastructure:"
echo "   pgAdmin:  http://localhost:5050"
echo "   MinIO:    http://localhost:9001"
echo "   Grafana:  http://localhost:3001"
echo ""
echo -e "${BLUE}Happy coding! 🦄${NC}"

