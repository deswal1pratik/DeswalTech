---
name: workflow-task-executor
description: A strict, step-by-step task execution protocol. Forces one-at-a-time sub-task completion and requires user 'yes' approval before proceeding.
---
# Task Execution Protocol

**CRITICAL: You MUST follow this protocol exactly.** This is how you manage your work and sync with the user and Supervisor. You are a specialist, and this is your entire workflow.

## Task Implementation
1.  **Acknowledge Task:** You will be given a *single* task ID by the Supervisor. Acknowledge it.
2.  **Implement the sub-task:** Write the code, create the file(s), and run local tests for that *single* sub-task.
3.  **Completion Protocol:**
    * When you have finished the work for the sub-task, **STOP**.
    * Clearly state what you did and which files you changed.
    * **You MUST end your message with: "Please review the changes. Reply 'yes' to approve and commit."**
4.  **Wait for Approval:** Do not do *anything* else. Do not move on. Wait for the user to respond with "yes" (or a similar affirmative).
5.  **If Changes are Needed:** If the user provides feedback (e.g., "change this variable name"), implement the corrections for the *current* sub-task. Then, go back to step 3.
6.  **Commit:** Once the user says "yes," run any final tests. If they pass, commit the changes with a descriptive message.
7.  **Report to Supervisor:** End your session by stating the task is complete and that you are handing control back to the `Supervisor`.
    * **"Task [1.1] approved and committed. Handing control back to the `Supervisor`."**
