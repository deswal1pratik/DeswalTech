# 🏗️ DeswalTech Infrastructure Hub

> Centralized, enterprise-grade backend services for all your projects

## 🎯 Purpose

This infrastructure hub provides **shared backend services** that all your projects can connect to:
- PostgreSQL 16 + pgvector (for AI/RAG)
- Redis (caching, sessions)
- MinIO (S3-compatible storage)
- Monitoring (Prometheus + Grafana)
- Database GUI (pgAdmin)

## 🚀 Quick Start

```bash
# Start all services
./start-services.sh

# Stop all services
./stop-services.sh

# Restart services
./restart-services.sh

# View status
docker compose ps

# View logs
docker compose logs -f
```

## 📊 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | `localhost:5432` | `postgres` / `postgres` |
| Redis | `localhost:6379` | Password: `redispass` |
| MinIO Console | http://localhost:9001 | `minioadmin` / `minioadmin123` |
| MinIO API | http://localhost:9000 | Same as above |
| pgAdmin | http://localhost:5050 | `admin@deswal.tech` / `admin123` |
| Prometheus | http://localhost:9090 | No auth |
| Grafana | http://localhost:3001 | `admin` / `admin123` |

## 🔌 Connecting from Projects

### Next.js / Node.js

```env
# .env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/your_db_name
REDIS_URL=redis://:redispass@localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
```

### Python / FastAPI

```env
# .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/your_db_name
REDIS_URL=redis://:redispass@localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
```

## 📦 Creating a Project Database

```bash
# Using psql
psql -U postgres -h localhost -c "CREATE DATABASE my_app_db;"

# Using pgAdmin
# 1. Open http://localhost:5050
# 2. Login with admin@deswal.tech / admin123
# 3. Add server: localhost:5432
# 4. Right-click Databases → Create → Database
```

## 🗄️ PostgreSQL Extensions

Pre-installed extensions:
- ✅ `vector` - pgvector for AI embeddings
- ✅ `uuid-ossp` - UUID generation
- ✅ `pg_trgm` - Fuzzy text search
- ✅ `btree_gin` - Advanced indexing

## 🔒 MinIO Buckets

Create buckets via Console or SDK:

```javascript
// Node.js example
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "http://localhost:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin123",
  },
  forcePathStyle: true,
});

await s3.send(new CreateBucketCommand({ Bucket: "my-app-uploads" }));
```

## 🐳 Docker Commands

```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f [service_name]

# Restart specific service
docker compose restart postgres

# Stop and remove everything (data persists)
docker compose down

# Stop and remove everything INCLUDING DATA
docker compose down -v  # ⚠️ WARNING: Deletes all data!

# Pull latest images
docker compose pull

# Rebuild containers
docker compose up -d --build
```

## 🔧 Maintenance

### Backup Databases

```bash
# Backup all databases
docker exec deswaltech-postgres pg_dumpall -U postgres > backup_$(date +%Y%m%d).sql

# Backup specific database
docker exec deswaltech-postgres pg_dump -U postgres my_app_db > my_app_backup.sql

# Restore
docker exec -i deswaltech-postgres psql -U postgres < backup.sql
```

### Backup MinIO Data

```bash
# Using MinIO CLI
mc alias set local http://localhost:9000 minioadmin minioadmin123
mc mirror local/my-bucket /path/to/backup/
```

### Update Services

```bash
cd ~/Developer/Infrastructure
docker compose pull
docker compose up -d
```

## 🔐 Security Notes

⚠️ **Important**: These are **development credentials** only!

For production:
1. Change all passwords
2. Use environment variables
3. Enable SSL/TLS
4. Use Docker secrets
5. Implement proper authentication

## 🐛 Troubleshooting

### Services won't start

```bash
# Check if ports are already in use
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :9000  # MinIO

# Stop conflicting services
brew services stop postgresql  # If you have Homebrew Postgres
```

### Cannot connect from project

1. Ensure services are running: `docker compose ps`
2. Check network: `docker network ls | grep deswaltech`
3. Verify credentials in `.env.local`
4. Check firewall settings

### Out of disk space

```bash
# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## 📖 Using this as a Private Repository

### Initial Setup

```bash
# 1. Initialize Git
cd ~/Developer/Infrastructure
git init

# 2. Create private GitHub repo
gh repo create deswaltech-infrastructure --private --source=. --remote=origin

# 3. Add files
git add .
git commit -m "Initial infrastructure setup"
git push -u origin main
```

### Cloning on a New Machine

```bash
# 1. Clone infrastructure
cd ~/Developer
git clone git@github.com:YOUR_USERNAME/deswaltech-infrastructure.git Infrastructure

# 2. Start services
cd Infrastructure
./start-services.sh
```

### Updating Infrastructure

```bash
# On any machine
cd ~/Developer/Infrastructure

# Pull latest changes
git pull

# Restart services with new config
docker compose up -d
```

## 🎯 Integration with Projects

This infrastructure is designed to work with:

1. **Tier 2**: Shared packages (`@deswaltech/*`)
2. **Tier 3**: Project templates
3. **Tier 4**: Your actual projects

See `../ARCHITECTURE.md` for full details.

## 📝 Environment Variables Template

Create this file in your projects:

```env
# .env.local

# ===================================
# Tier 1: Infrastructure Connections
# ===================================

# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/YOUR_DB_NAME

# Redis
REDIS_URL=redis://:redispass@localhost:6379

# MinIO (S3-compatible)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_BUCKET=your-app-uploads
S3_REGION=us-east-1

# ===================================
# Project-Specific Variables
# ===================================

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App Config
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Contributing

When adding new services:

1. Update `docker-compose.yml`
2. Add to `monitoring/prometheus.yml` if needed
3. Update this README with credentials and URLs
4. Update `start-services.sh` output
5. Commit and push changes

## 📚 Additional Resources

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [pgvector Docs](https://github.com/pgvector/pgvector)
- [Redis Docs](https://redis.io/docs/)
- [MinIO Docs](https://min.io/docs/minio/linux/index.html)

---

**Version**: 1.0.0  
**Last Updated**: October 5, 2025  
**Maintained By**: DeswalTech

