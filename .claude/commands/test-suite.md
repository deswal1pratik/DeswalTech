---
description: Create comprehensive test suite for the project
allowed-tools: Task, Read, Write, Edit, Bash, Glob, Grep
---

# Comprehensive Test Suite Creation

Create a complete test suite using the QA Expert subagent.

## Testing Requirements

The QA Expert should implement:

### 1. Unit Tests (>90% coverage)
**Backend**:
- Service layer tests
- Repository/Data access tests
- Utility function tests
- Validation logic tests

**Frontend**:
- Component tests (React Testing Library)
- Hook tests
- Utility function tests
- State management tests

### 2. Integration Tests
**Backend**:
- API endpoint tests (Supertest)
- Database integration tests
- Redis integration tests
- External service integration tests

**Frontend**:
- API integration tests
- Form submission flows
- Real-time update handling

### 3. E2E Tests
- Critical user journeys (Playwright/Cypress)
- Authentication flows
- CRUD operations
- Error scenarios
- Mobile responsive testing (if applicable)

### 4. Performance Tests
- Load testing (k6/Artillery)
- API response time validation (<100ms p95)
- Database query performance
- Frontend performance (Lighthouse)

### 5. Security Tests
- Input validation testing
- Authentication bypass attempts
- Authorization testing
- SQL injection testing
- XSS testing

### 6. Accessibility Tests
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast

## Test Coverage Requirements

- Overall coverage: >85%
- Branch coverage: >80%
- Function coverage: >90%
- Line coverage: >85%

## Test Quality Standards

- All tests must be deterministic (no flaky tests)
- Tests run in <5 minutes
- Clear test descriptions
- Proper setup/teardown
- Isolated test cases

## Deliverables

- Complete test suite
- Test coverage report
- Test documentation
- CI/CD integration
- Test data fixtures

Invoke the **qa-expert** subagent to create this test suite.
