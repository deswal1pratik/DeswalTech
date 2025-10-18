---
description: Conduct a comprehensive security review of the codebase
allowed-tools: Task, Read, Glob, Grep
---

# Security Review

Conduct a comprehensive security review using the Security Expert subagent.

## Review Scope

The Security Expert should review:

1. **Authentication & Authorization**
   - JWT implementation and token management
   - Password hashing (Argon2)
   - Role-based access control (RBAC)
   - Session management
   - OAuth/SSO implementation

2. **Input Validation & Sanitization**
   - All user inputs validated
   - SQL injection prevention (parameterized queries)
   - XSS prevention (output encoding)
   - CSRF protection

3. **Data Protection**
   - Encryption at rest (AES-256)
   - Encryption in transit (TLS 1.3)
   - Sensitive data handling
   - Key management

4. **Security Headers**
   - Content Security Policy (CSP)
   - HSTS
   - X-Frame-Options
   - X-Content-Type-Options

5. **API Security**
   - Rate limiting
   - CORS configuration
   - API authentication
   - Request validation

6. **OWASP Top 10**
   - Broken Access Control
   - Cryptographic Failures
   - Injection
   - Insecure Design
   - Security Misconfiguration
   - Vulnerable Components
   - Authentication Failures
   - Data Integrity Failures
   - Logging Failures
   - SSRF

7. **Compliance**
   - GDPR requirements (if applicable)
   - Data retention policies
   - Privacy policy
   - Audit logging

## Deliverables

- Security audit report
- List of vulnerabilities (with severity)
- Remediation recommendations
- Security improvement roadmap

Invoke the **security-expert** subagent to perform this review.
