---
description: Set up deployment pipeline and infrastructure
argument-hint: <environment> (staging|production)
allowed-tools: Task, Read, Write, Edit, Bash, Glob
---

# Deployment Setup

Set up complete deployment pipeline for: **$ARGUMENTS**

## Deployment Requirements

The DevOps Expert should:

1. **Containerization**
   - Create optimized Dockerfile (multi-stage build)
   - Docker Compose for local development
   - Environment variable management

2. **CI/CD Pipeline**
   - GitHub Actions workflow
   - Automated testing (lint, type-check, tests)
   - Automated security scanning
   - Automated deployment

3. **Infrastructure**
   - Kubernetes manifests (if applicable)
   - Database setup and migrations
   - Redis configuration
   - Object storage (MinIO/S3)

4. **Monitoring & Observability**
   - Prometheus metrics collection
   - Grafana dashboards
   - Structured logging (Winston)
   - Error tracking (Sentry)
   - Health check endpoints

5. **Security**
   - Secrets management
   - Network policies
   - SSL/TLS certificates
   - Backup strategy

6. **Performance**
   - Load balancing
   - Auto-scaling policies
   - CDN configuration
   - Caching strategy

7. **Documentation**
   - Deployment runbook
   - Rollback procedures
   - Disaster recovery plan
   - Architecture diagrams

## Environment Configuration

For **$ARGUMENTS** environment:
- Configure appropriate resource limits
- Set up monitoring and alerting
- Implement backup procedures
- Document access procedures

Invoke the **devops-expert** subagent to set this up.
