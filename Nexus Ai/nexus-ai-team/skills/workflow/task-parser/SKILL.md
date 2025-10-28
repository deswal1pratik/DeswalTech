---
name: workflow-task-parser
description: Parses an "RPG-Structured" PRD into a dependency-aware `TASKS.md` file for execution.
---
# Rule: Parsing an "RPG-Structured" PRD

## Goal
To read a PRD file and generate a `TASKS-[n].md` file with a step-by-step, dependency-aware task graph.

## Process
1.  **Receive PRD:** The user (or `Supervisor`) provides a PRD file (e.g., `@0001-prd.md`).
2.  **Scan for Capabilities:** Each `### Capability:` line becomes a parent task (e.g., `1.0 **Capability Name**`).
3.  **Scan for Features:** Each `#### Feature:` line becomes a sub-task.
4.  **Extract Metadata:**
    * The feature title becomes the `[TaskID]`.
    * The `Depends on:` list is extracted.
    * The `Phase:` number is extracted.
5.  **Build Graph:** Construct a mental model of all tasks and their dependencies.
6.  **Topological Sort:** Order the tasks *first* by `Phase` number (lowest to highest), and *then* by their dependencies. No task can appear before a task it depends on.
7.  **Generate Output File:** Create `TASKS-[n].md` with the correctly ordered, nested list of tasks.

## Output Format
```markdown
## Master Task List (TASKS-0001.md)

- [ ] 1.0 **[Capability Name]** (Phase: 1)
  - [ ] 1.1 `[TaskID: Feature Name 1]` [Description] (Depends on: `[Dep 1]`)
- [ ] 2.0 **[Capability Name 2]** (Phase: 2)
  - [ ] 2.1 `[TaskID: Feature Name 2]` [Description] (Depends on: `[Feature Name 1]`)
  - [ ] 2.2 `[TaskID: Feature Name 3]` [Description] (Depends on: `[Feature Name 1]`)
- [ ] 3.0 **[Capability Name 3]** (Phase: 3)
  - [ ] 3.1 `[TaskID: Feature Name 4]` [Description] (Depends on: `[Feature Name 2]`, `[Feature Name 3]`)
```
