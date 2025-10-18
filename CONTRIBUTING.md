# Contributing to DeswalTech

Thank you for your interest in contributing to DeswalTech! This document provides guidelines and instructions for contributing.

---

## 🎯 Ways to Contribute

### 1. Report Bugs
- Use GitHub Issues
- Include detailed description
- Provide reproduction steps
- Include system information

### 2. Suggest Features
- Open a GitHub Discussion
- Explain the use case
- Describe expected behavior
- Consider implementation approach

### 3. Submit Pull Requests
- Fix bugs
- Add features
- Improve documentation
- Enhance tests

### 4. Improve Documentation
- Fix typos
- Add examples
- Clarify instructions
- Update guides

---

## 🚀 Getting Started

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/deswaltech.git
cd deswaltech

# Add upstream remote
git remote add upstream https://github.com/pratikdeswal/deswaltech.git
```

### Install Dependencies

```bash
# Install main dependencies
npm install

# Install MCP server dependencies
cd mcp-server
npm install
cd ..
```

### Set Up Development Environment

```bash
# Build MCP server
cd mcp-server
npm run build
cd ..

# Start infrastructure (optional)
cd Infrastructure
docker-compose up -d
cd ..

# Run tests
npm test
```

---

## 🔧 Development Workflow

### Create a Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Make Changes

1. Write code following our style guide
2. Add/update tests
3. Update documentation
4. Run linters and tests

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Build
npm run build
```

### Commit Changes

Use conventional commit messages:

```bash
# Format: <type>(<scope>): <description>

# Types:
# - feat: New feature
# - fix: Bug fix
# - docs: Documentation only
# - style: Code style (formatting, etc.)
# - refactor: Code restructuring
# - test: Adding tests
# - chore: Maintenance

# Examples:
git commit -m "feat(cli): add create-deswaltech-app command"
git commit -m "fix(mcp): resolve connection timeout issue"
git commit -m "docs(readme): update installation instructions"
```

### Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# - Use a descriptive title
# - Fill out the PR template
# - Link related issues
# - Request review
```

---

## 📋 Pull Request Guidelines

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
- [ ] No linter errors
- [ ] Commits follow convention
- [ ] PR description is clear
- [ ] Related issues linked

### PR Description Template

```markdown
## Description
Brief description of changes

## Motivation
Why is this change necessary?

## Changes
- List of changes
- Another change

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots

## Related Issues
Fixes #123
Relates to #456
```

---

## 🎨 Code Style

### JavaScript/TypeScript

- Use TypeScript when possible
- Follow ESLint configuration
- Use Prettier for formatting
- 2 spaces indentation
- Semicolons required
- Single quotes for strings

```typescript
// Good
const userName: string = 'John Doe';
const userAge: number = 30;

function greetUser(name: string): string {
  return `Hello, ${name}!`;
}

// Bad
var userName = "John Doe"
const userAge = 30

function greetUser(name) {
  return 'Hello, ' + name + '!'
}
```

### Documentation

- Clear and concise
- Include code examples
- Use proper markdown formatting
- Keep line length < 100 characters

```markdown
## Function Name

Brief description of function.

### Parameters
- `param1` (string): Description of param1
- `param2` (number): Description of param2

### Returns
- (boolean): Description of return value

### Example
\`\`\`javascript
const result = functionName('value', 42);
console.log(result); // true
\`\`\`
```

---

## 🧪 Testing

### Writing Tests

```javascript
describe('Feature Name', () => {
  it('should do something correctly', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.spec.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Coverage

- Aim for >80% coverage
- Cover edge cases
- Test error handling
- Include integration tests

---

## 📚 Documentation

### Types of Documentation

1. **Code Comments**
   - Use JSDoc format
   - Explain complex logic
   - Document public APIs

2. **README Updates**
   - Keep instructions current
   - Add new features
   - Update examples

3. **Guides**
   - Step-by-step tutorials
   - Real-world examples
   - Best practices

### JSDoc Example

```javascript
/**
 * Creates a new user in the database
 * 
 * @param {Object} userData - User information
 * @param {string} userData.email - User email address
 * @param {string} userData.name - User full name
 * @returns {Promise<User>} Created user object
 * @throws {ValidationError} If user data is invalid
 * 
 * @example
 * const user = await createUser({
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * });
 */
async function createUser(userData) {
  // Implementation
}
```

---

## 🐛 Bug Reports

### Good Bug Report Includes

1. **Clear Title**
   - Concise summary
   - Specific issue

2. **Description**
   - What happened
   - What you expected
   - Why it's a problem

3. **Reproduction Steps**
   ```
   1. Go to...
   2. Click on...
   3. Scroll down to...
   4. See error
   ```

4. **System Information**
   - OS and version
   - Node.js version
   - npm version
   - DeswalTech version

5. **Additional Context**
   - Screenshots
   - Error messages
   - Logs
   - Related issues

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## System Information
- OS: macOS 14.0
- Node.js: 18.17.0
- npm: 9.6.7
- DeswalTech: 1.0.0

## Additional Context
Add any other context, screenshots, or logs
```

---

## 💡 Feature Requests

### Good Feature Request Includes

1. **Problem Statement**
   - What problem does it solve?
   - Who is affected?

2. **Proposed Solution**
   - How would it work?
   - Alternative approaches?

3. **Use Cases**
   - Real-world examples
   - User stories

4. **Implementation Ideas**
   - Technical approach
   - Potential challenges

---

## 🔍 Code Review Process

### What We Look For

1. **Functionality**
   - Works as intended
   - Handles edge cases
   - No regressions

2. **Code Quality**
   - Clean and readable
   - Well-structured
   - Follows conventions

3. **Tests**
   - Adequate coverage
   - Tests pass
   - Edge cases covered

4. **Documentation**
   - Clear comments
   - Updated docs
   - Examples included

### Review Timeline

- Initial review: 2-3 days
- Follow-up reviews: 1-2 days
- Approval: After all feedback addressed

---

## 🏆 Recognition

### Contributors

All contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in relevant documentation

### Becoming a Maintainer

Active contributors may be invited to become maintainers based on:
- Quality contributions
- Community involvement
- Technical expertise
- Commitment to project

---

## 📞 Getting Help

### Resources

- **Documentation**: [GitHub README](https://github.com/pratikdeswal/deswaltech#readme)
- **Discussions**: [GitHub Discussions](https://github.com/pratikdeswal/deswaltech/discussions)
- **Issues**: [GitHub Issues](https://github.com/pratikdeswal/deswaltech/issues)

### Questions?

- Ask in GitHub Discussions
- Open an issue with "question" label
- Reach out to maintainers

---

## 📜 License

By contributing to DeswalTech, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Thank you for contributing to DeswalTech! Your efforts help make this project better for everyone.

---

**Ready to contribute? Fork the repo and start coding!** 🚀

