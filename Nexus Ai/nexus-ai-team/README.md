# 🚀 Nexus AI Agent Team Plugin

This plugin provides a powerful, pre-configured team of specialized AI subagents and modular skills to manage and execute complex software projects.

It is built on the official Claude Code `Subagent` and `Agent Skills` architecture, synthesizing best practices from `snarktank`, `eyaltoledano`, and `wshobson-agents`.

## Team Members (Subagents)

* **/agent supervisor**: The Project Manager. Manages the master task list, delegates work, and tracks progress. **This is your primary point of contact.**
* **/agent architect**: The System Designer. Use for database schema, system architecture, and complex data flow.
* **/agent backend**: The API & Logic Expert. Use for server-side code, APIs, database logic (Node, Python, Rust, Go).
* **/agent frontend**: The UI/UX Expert. Use for web/mobile UIs, components, and state management (React, Vue, Svelte).
* **/agent qa-tester**: The Quality Assurance Expert. Use for writing unit, integration, and e2e tests (Jest, Pytest, Cypress).
* **/agent devops**: The Deployment Expert. Use for CI/CD, Docker, Kubernetes, and cloud infrastructure (AWS, GCP, Terraform).
* **/agent security**: The Security Specialist. Use for code audits, dependency scanning, and implementing security best practices (OWASP).

## Core Abilities (Skills)

These skills are used *by the agents* to perform their work.

* **`workflow/prd-creator`**: Guides the creation of a detailed, "RPG-Structured" PRD. (Based on `snarktank` + `eyaltoledano`)
* **`workflow/task-parser`**: Parses the "RPG-Structured" PRD into a dependency-aware `TASKS.md` file. (Based on `eyaltoledano`)
* **`workflow/task-executor`**: A *strict* step-by-step execution protocol. It forces the agent to complete **one sub-task at a time** and **wait for user 'yes' approval** before continuing. (Based on `snarktank`)
* **`core/delegator`**: The Supervisor's "brain" for choosing the best specialist agent for a given task.
* **`core/socratic-brainstorm`**: A general-purpose Socratic brainstorming skill. (Based on `obra-superpowers`)

## How to Install (For Claude Code)

1.  Place this `nexus-ai-team` directory in your projects folder.
2.  Create a *separate* directory named `local-marketplace` *beside* it.
3.  In the `local-marketplace` directory, create the `.claude-plugin/marketplace.json` file (content provided in this instruction set).
4.  In Claude Code, add your local marketplace:
    ```
    /plugin marketplace add /path/to/your/local-marketplace
    ```
5.  Install the plugin:
    ```
    /plugin install nexus-ai-team@local-nexus-marketplace
    ```
6.  Restart Claude Code.
7.  Begin by typing `/agent supervisor`.
