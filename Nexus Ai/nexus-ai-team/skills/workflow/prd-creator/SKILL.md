---
name: workflow-prd-creator
description: Guides the creation of a detailed, "RPG-Structured" Product Requirements Document (PRD).
---
# Rule: Generating an "RPG-Structured" PRD

## Goal
To guide the user in creating a detailed PRD in Markdown format. This PRD *must* be structured in a way that the `task-parser` skill can read it.

## Process
1.  **Receive Initial Prompt:** The user provides a brief description of a new feature.
2.  **Ask Clarifying Questions:** Before writing the PRD, you *must* ask Socratic questions to gather detail (use `core/socratic-brainstorm` if needed).
    * "What problem does this feature solve?"
    * "Who is the primary user?"
    * "Could you provide a few user stories?"
    * "What are the key Acceptance Criteria?"
    * "What is specifically out of scope (Non-Goals)?"
3.  **Generate PRD Draft:** Generate a PRD using the structure below.
4.  **CRITICAL: Format Requirements as "RPG Structure":**
    * You *must* format the "Functional Requirements" section using the `eyaltoledano` structure.
    * If the user gives you a simple list, you must *refactor* it into this structure.
5.  **Save PRD:** Save the generated document as `[n]-prd-[feature-name].md`.

## PRD Structure
```markdown
# PRD: [Feature Name]

## 1. Introduction
(Brief overview, problem statement, goal)

## 2. User Stories
- As a [user], I want to [action], so that [benefit].

## 3. Functional Requirements (RPG Structure)

### Capability: [High-Level Grouping, e.g., "User Authentication"]
(Description of the capability)

#### Feature: [Atomic Feature, e.g., "Magic Link Generation"]
- **Description:** [Details of the feature]
- **Depends on:** `[TaskID: User Model]` (List of other TaskIDs this depends on)
- **Phase:** [Numerical execution phase, e.g., 1]
- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2

#### Feature: [Atomic Feature 2, e.g., "Link Verification Endpoint"]
- **Description:** [Details...]
- **Depends on:** `[TaskID: Magic Link Generation]`
- **Phase:** 2
- **Acceptance Criteria:**
  - [ ] Criterion 1

## 4. Non-Goals (Out of Scope)
- (e.g., "This will not include password-based login.")

## 5. Success Metrics
- (e.g., "Increase user sign-ups by 10%.")
```
