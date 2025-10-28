---
description: Delegate a frontend development task to the Frontend Expert
argument-hint: <task-description>
allowed-tools: Task
---

# Frontend Development Task

Delegate the following frontend task to the Frontend Expert subagent:

$ARGUMENTS

## Task Requirements

The Frontend Expert should:

1. **Implement with Modern Stack**
   - Use React/Next.js with TypeScript
   - Use shadcn/ui components (via MCP)
   - TailwindCSS for styling
   - React Query for server state
   - Zustand for client state

2. **Ensure Quality**
   - Write unit tests with Vitest/RTL (>85% coverage)
   - Write E2E tests with Playwright
   - Ensure accessibility (WCAG 2.1 AA)
   - Optimize performance (Lighthouse >90)

3. **Responsive Design**
   - Mobile-first approach
   - Test on multiple screen sizes
   - Touch-friendly interactions

4. **Integration**
   - Coordinate with Backend Expert for API contracts
   - Implement real-time updates if needed
   - Proper error handling and loading states

5. **Documentation**
   - Component documentation
   - Storybook stories (if applicable)
   - README with setup instructions

Invoke the **frontend-expert** subagent to complete this task.
