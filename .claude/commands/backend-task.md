---
description: Delegate a backend development task to the Backend Expert
argument-hint: <task-description>
allowed-tools: Task
---

# Backend Development Task

Delegate the following backend task to the Backend Expert subagent:

$ARGUMENTS

## Task Requirements

The Backend Expert should:

1. **Implement with Best Practices**
   - Use TypeScript strict mode
   - Follow RESTful API design principles
   - Implement proper error handling
   - Add comprehensive validation (Zod)

2. **Use MCPs Where Applicable**
   - Supabase for database and auth
   - Redis for caching
   - Appropriate backend services

3. **Ensure Quality**
   - Write unit tests (>90% coverage)
   - Write integration tests for APIs
   - Add proper logging
   - Optimize performance (<100ms API responses)

4. **Security**
   - Input validation and sanitization
   - Parameterized queries (no SQL injection)
   - Proper authentication and authorization
   - Rate limiting where appropriate

5. **Documentation**
   - API documentation (OpenAPI/Swagger)
   - Code comments for complex logic
   - README with setup instructions

Invoke the **backend-expert** subagent to complete this task.
