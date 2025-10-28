# Knowledge Asset Integration Playbook

The DeswalTech expert-agent system is fully documented inside `advanced-ai-team`. This playbook captures optional upstream references (BMAD Method, Contains Studio agents, Claude Docs) should you choose to keep or revisit the original sources.

---

## 1. BMAD-METHOD™ Core Library (`bmad-method.md`)
**Purpose**: Provides exhaustive checklists, templates, tasks, and workflows that encode enterprise-grade delivery practices.

### 1.1 Structure Highlights
- `bmad-core/agent-teams/*.yaml` – Prebuilt team compositions for different delivery modes.
- `bmad-core/agents/*.md` – Detailed prompts for analyst, architect, dev, QA, PM, PO, SM, UX expert, etc.
- `bmad-core/checklists/` – Mission-critical checklists (architect, change, PM, PO, story DoD & draft).
- `bmad-core/data/` – Knowledge base assets (brainstorming, elicitation, technical preferences, test level/priorities frameworks).
- `bmad-core/tasks/` – SOPs for elicitation, QA gate, risk profiles, story creation/review, documentation, etc.
- `bmad-core/templates/` – `prd-tmpl.yaml`, `architecture-tmpl.yaml`, `story-tmpl.yaml`, `qa-gate-tmpl.yaml`, and more.
- `bmad-core/workflows/` – Greenfield/brownfield playbooks broken down for fullstack, service, UI.
- `docs/` – Guidance on core architecture, enhanced IDE workflow, brownfield/greenfield operations, versioning.
- `expansion-packs/` – Domain-specific kits (game dev, creative writing, infrastructure/devops).

### 1.2 How to Use in Advanced Workflow
| PBVS Phase | Essential BMAD Assets | When to Invoke |
| --- | --- | --- |
| **Plan** | `templates/prd-tmpl.yaml`, `templates/architecture-tmpl.yaml`, `checklists/story-draft-checklist.md`, `tasks/advanced-elicitation.md`, `tasks/nfr-assess.md` | During requirement elicitation, architecture drafting, and PRD creation. |
| **Build** | `tasks/create-next-story.md`, `tasks/review-story.md`, `checklists/story-dod-checklist.md`, `tasks/apply-qa-fixes.md`, `tasks/test-design.md` | For story execution, DoD verification, QA collaboration. |
| **Validate** | `tasks/qa-gate.md`, `templates/qa-gate-tmpl.yaml`, `data/test-levels-framework.md`, `data/test-priorities-matrix.md` | To run Level 2/3 gates, define coverage depth, and prioritise test suites. |
| **Scale** | `tasks/risk-profile.md`, `tasks/document-project.md`, `docs/versioning-and-releases.md` | For release readiness, risk tracking, documentation, and versioning discipline. |

**Best Practice**: When preparing deliverables, open the relevant BMAD checklist/task file, adapt the bullet steps into the story packet or handoff, and link back to the source path in the decision log (e.g., `bmad-core/checklists/story-dod-checklist.md`).

### 1.3 Workflow Integration
- **Agent Alignment**: Map advanced agents to BMAD agent prompts (`architect.md`, `qa.md`, `pm.md`, etc.) for additional context.
- **Template Usage**: Store completed templates in project repo (`/docs/prd`, `/docs/architecture`).
- **Task Automation**: Use BMAD tasks as step-by-step scripts during planning and QA reviews.
- **Expansion Packs**: Leverage domain kits when building outside standard software (e.g., infrastructure, game dev).

---

## 2. Contains Studio Specialist Prompts (`contains-studio-agents.md`)
**Purpose**: Supplies 500+ word, department-specific prompts with usage examples, tool scopes, and proactive triggers.

### 2.1 Frontmatter Anatomy
Each agent file includes:
```markdown
---
name: backend-architect
description: "Use this agent when..."
color: indigo
tools: Read, Write, ArchToolkit
---
<examples ...>

You are a ...
```
- `description` embeds `<example>` blocks with context, user request, assistant approach, and commentary.
- Proactive triggers define when agents auto-activate (e.g., `studio-coach`, `test-writer-fixer`).
- System prompt details responsibilities, expertise, constraints, success metrics.

### 2.2 Key Paths
| Department | Agents | Path Prefix |
| --- | --- | --- |
| Engineering | ai-engineer, backend-architect, devops-automator, frontend-developer, mobile-app-builder, rapid-prototyper, test-writer-fixer | `contains-studio-agents/engineering/` |
| Product | feedback-synthesizer, sprint-prioritizer, trend-researcher | `contains-studio-agents/product/` |
| Marketing | app-store-optimizer … twitter-engager | `contains-studio-agents/marketing/` |
| Design | brand-guardian … whimsy-injector | `contains-studio-agents/design/` |
| Project Management | experiment-tracker, project-shipper, studio-producer | `contains-studio-agents/project-management/` |
| Studio Operations | analytics-reporter … support-responder | `contains-studio-agents/studio-operations/` |
| Testing | api-tester … workflow-optimizer | `contains-studio-agents/testing/` |
| Bonus | studio-coach, joker | `contains-studio-agents/bonus/` |

### 2.3 Usage Guidance
- **Load the Full Prompt**: Before delegating, read the relevant file (`cat contains-studio-agents/engineering/backend-architect.md`) to align behaviour with examples and guardrails.
- **Respect Tool Scopes**: Tool access (Read, Write, Bash, Task, etc.) in frontmatter should map to allowed commands in story packets.
- **Embed Examples**: Incorporate `<example>` patterns into handoff packets to guide expected outputs.
- **Maintain Proactive Triggers**: Ensure orchestrator auto-activates agents when trigger conditions are met (e.g., `studio-coach` for complex projects).

---

## 3. Implementation Checklist
- [ ] Reference BMAD templates and checklists in story packets and ADRs.
- [ ] Use BMAD tasks during planning/QA to ensure consistent execution.
- [ ] Load Contains Studio prompts before delegating to ensure tone and process fidelity.
- [ ] Document which source assets were used in the progress journal.
- [ ] Queue knowledge storage to Byterover with links to the utilised assets once MCP access returns.

---

## 4. Claude Docs Digest (`Docs to read/`)
The Claude documentation set under `Docs to read/` has been distilled into:
- `CLAUDE_AGENT_INTEGRATION_GUIDE.md` – Subagents, plugins, Skills, tool workflows, best practices.
- `CLAUDE_PLATFORM_REFERENCE.md` – Model selection, settings hierarchy, context/prompt caching, streaming, token counting, pricing.

### 4.1 When to Consult Source Markdown
| Scenario | Primary Doc | Supplemental Details |
| --- | --- | --- |
| Designing new subagents or Skills | `Subagents - Claude Docs.md`, `Skill authoring best practices - Claude .md` | Validate naming, structure, proactive triggers, progressive disclosure patterns. |
| Packaging plugins | `Plugins - Claude Docs.md`, `Plugins reference - Claude Docs.md` | Manifest schema, component directories, hooks/MCP server config. |
| Adjusting Claude settings | `Claude Code settings - Claude Docs.md`, `Model configuration - Claude Docs.md` | Permission patterns, env vars, model aliases, prompt caching env toggles. |
| Managing context/token budgets | `Context windows - Claude Docs.md`, `Token counting - Claude Docs.md` | Extended thinking stripping, 1M context usage, token counting API examples. |
| Optimising cost/perf | `Prompt caching - Claude Docs.md`, `Models overview - Claude Docs.md`, `Choosing the right model - Claude Docs.md` | Cache TTL pricing, model trade-offs, migration tips. |
| Streaming integrations | `Streaming Messages - Claude Docs.md`, `Tool use with Claude - Claude Docs.md` | SSE event taxonomy, error handling, client vs server tool flows. |

### 4.2 Images (Screenshots)
The PNGs in `Docs to read/` mirror Claude UI for model selection, settings, and plugin interfaces. Use them for visual onboarding references when demonstrating configuration steps.

Integrating these libraries ensures the `advanced-ai-team` system retains all the maturity, rigor, and specialization captured in your original repositories.

> **Note**: All essential instructions now live inside `advanced-ai-team`. The external resources referenced above are optional; you can archive or remove them to conserve context budget once you no longer need the raw source material.
