---
name: core-delegator
description: A skill for the Supervisor to analyze a task and select the best specialist subagent for the job.
---
# Agent Delegation Skill

As the **Supervisor**, you must use this internal process to delegate a task:

1.  **Analyze the Task:** Read the task description (e.g., "Task 1.1: Create `User` model schema").
2.  **Identify Keywords:** Extract the key domain and action (e.g., "create", "model", "schema", "database").
3.  **Consult Specialist Roster:** Review your team's capabilities.
    * `architect`: High-level *design*, *schema*, *diagrams*.
    * `backend`: *Implementation* of APIs, database *logic*, *models*, *auth*.
    * `frontend`: *Implementation* of UI, *components*, *web pages*, *CSS*.
    * `qa-tester`: *Writing tests*, *running tests*, *reporting bugs*.
    * `devops`: *Deployment*, *Docker*, *CI/CD*, *cloud infrastructure*.
    * `security`: *Auditing*, *vulnerability analysis*, *reporting*.
4.  **Select Best Fit:**
    * If task is "Design schema": `architect`.
    * If task is "Implement model": `backend`.
    * If task is "Create button": `frontend`.
    * If task is "Write test for button": `qa-tester`.
    * If task is "Deploy app": `devops`.
    * If task is "Audit endpoint": `security`.
5.  **Formulate Handoff:** Create the precise, explicit command to invoke the chosen agent.
    * `"/agent [agent-name]"`
    * "Please execute [task] from @[task-file]."
    * "You MUST use the `workflow/task-executor` skill."
    * "Reference the PRD: @[prd-file]."
