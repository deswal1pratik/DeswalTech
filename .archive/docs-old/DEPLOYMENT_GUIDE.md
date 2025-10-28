# 🚀 DeswalTech Deployment Guide

## Deployment Strategy

DeswalTech uses a **hybrid deployment approach** for optimal development and production workflows:

### Local Development
- **Docker Compose** for full-stack local development
- **iOS/Android simulators** for mobile testing
- **Hot reloading** for rapid iteration
- **Local databases** (PostgreSQL, Redis, MinIO)

### Production Deployment
- **Railway** for cloud deployment
- **Automatic scaling** and monitoring
- **Git-based deployments**
- **Production databases** (managed services)

---

## 🏠 Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ LTS
- iOS Simulator (Mac) or Android Studio
- Git

### Quick Start
```bash
# 1. Start infrastructure services
cd Infrastructure
./start-services.sh

# 2. Start MCP server
cd ../mcp-server
npm install
npm run dev

# 3. Build your project
# Tell Claude: "Build [your project] with local development setup"
```

### Services Running Locally
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **MinIO**: `localhost:9000`
- **Prometheus**: `localhost:9090`
- **Grafana**: `localhost:3001`
- **MCP Server**: `localhost:3001`

---

## ☁️ Production Deployment with Railway

### Why Railway?
- **Zero-config deployment** from Git
- **Automatic scaling** based on traffic
- **Built-in monitoring** and logs
- **Database hosting** (PostgreSQL, Redis)
- **Custom domains** and SSL
- **Cost-effective** for startups

### Railway Setup

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

#### 2. Initialize Project
```bash
railway init
railway link [project-id]
```

#### 3. Deploy
```bash
# Deploy to staging
railway up --environment staging

# Deploy to production
railway up --environment production
```

### Railway Configuration

#### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Environment Variables
```bash
# Production database
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis
REDIS_URL=redis://host:port

# MinIO/S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket

# API keys
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 🔄 Development Workflow

### Local Development
```bash
# 1. Start all services
deswaltech start

# 2. Build features locally
# Tell Claude: "Add [feature] to [project]"

# 3. Test on iOS/Android simulators
# 4. Test web app in browser
# 5. Run tests
npm test

# 6. Deploy to staging
railway up --environment staging
```

### Production Deployment
```bash
# 1. Merge to main branch
git checkout main
git merge feature-branch

# 2. Deploy to production
railway up --environment production

# 3. Monitor deployment
railway logs --environment production
```

---

## 📱 Mobile App Deployment

### iOS (App Store)
```bash
# 1. Build for iOS
cd mobile-app
npx react-native run-ios --configuration Release

# 2. Archive for App Store
# Use Xcode to create archive

# 3. Upload to App Store Connect
# Use Xcode or Transporter app
```

### Android (Google Play)
```bash
# 1. Build APK/AAB
cd mobile-app
npx react-native run-android --variant=release

# 2. Generate signed bundle
./gradlew bundleRelease

# 3. Upload to Google Play Console
```

---

## 🔧 Infrastructure as Code

### Docker Compose (Local)
```yaml
# Infrastructure/docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: deswaltech
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

### Railway Services
```bash
# Add PostgreSQL service
railway add postgresql

# Add Redis service
railway add redis

# Add custom service
railway add
```

---

## 🔍 Monitoring & Observability

### Local Monitoring
- **Grafana**: `http://localhost:3001`
- **Prometheus**: `http://localhost:9090`
- **Application logs**: `docker-compose logs -f`

### Production Monitoring
- **Railway Dashboard**: Built-in metrics and logs
- **Custom metrics**: Prometheus + Grafana
- **Error tracking**: Sentry integration
- **Performance**: Lighthouse CI

### Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'connected',
      storage: 'connected'
    }
  });
});
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Railway
        uses: railwayapp/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          environment: production
```

---

## 💰 Cost Optimization

### Local Development
- **Free**: All services run locally
- **No cloud costs** during development
- **Fast iteration** with hot reloading

### Production (Railway)
- **$5/month**: Basic plan (starter projects)
- **$20/month**: Pro plan (growing apps)
- **Pay-as-you-scale**: Automatic scaling
- **No server management**: Fully managed

### Cost Comparison
| Service | Local | Railway | Traditional |
|---------|-------|---------|-------------|
| Development | Free | Free | $50-200/month |
| Staging | Free | $5/month | $100-500/month |
| Production | N/A | $20-100/month | $500-2000/month |
| **Total** | **Free** | **$25-105/month** | **$650-2700/month** |

---

## 🔒 Security Best Practices

### Environment Variables
```bash
# Never commit secrets
.env.local
.env.production

# Use Railway secrets
railway variables set DATABASE_URL=postgresql://...
```

### Database Security
- **Connection encryption**: SSL/TLS
- **Access control**: IP whitelisting
- **Backup encryption**: Automated backups
- **Audit logging**: Track all access

### API Security
- **Rate limiting**: Prevent abuse
- **Input validation**: Sanitize all inputs
- **Authentication**: JWT + refresh tokens
- **Authorization**: Role-based access control

---

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Monitor for errors
- [ ] Deploy to production
- [ ] Verify all services

### Post-Deployment
- [ ] Monitor metrics
- [ ] Check error rates
- [ ] Verify functionality
- [ ] Update documentation
- [ ] Notify stakeholders

---

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database status
railway status postgresql

# View database logs
railway logs postgresql
```

#### Build Failures
```bash
# Check build logs
railway logs --environment production

# Rebuild from scratch
railway up --environment production --force
```

#### Performance Issues
```bash
# Check resource usage
railway metrics

# Scale up if needed
railway scale web=2
```

### Support Resources
- **Railway Docs**: https://docs.railway.com
- **DeswalTech Docs**: `/docs/`
- **Community**: GitHub Issues
- **Support**: Railway Support

---

## 🎉 Success Metrics

### Deployment Success
- **Deployment time**: < 5 minutes
- **Uptime**: > 99.9%
- **Response time**: < 100ms (p95)
- **Error rate**: < 0.1%

### Development Velocity
- **Local setup**: < 5 minutes
- **Feature deployment**: < 1 hour
- **Bug fixes**: < 30 minutes
- **Rollback time**: < 2 minutes

---

**DeswalTech Deployment: Local development + Railway production = Best of both worlds!** 🚀
