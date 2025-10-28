# Claude Agent Integration Guide
*Derived from Claude Docs: Subagents, Plugins, Agent Skills, Tool Use (Oct 2025 mirrors)*

---

## 1. Subagent Architecture
- **Purpose**: Pre-configured AI specialists with their own context windows, system prompts, and tool whitelists. Claude auto-delegates tasks when the `description` matches the current request.
- **Storage precedence**: Project (`.claude/agents/`) > CLI `--agents` flag > User (`~/.claude/agents/`). Plugins can register additional agents in their `agents/` directory.
- **File format** (`*.md` with YAML frontmatter):
  ```yaml
  ---
  name: code-reviewer          # lowercase, hyphenated
  description: Proactively reviews diffs for quality/security.
  tools: Read, Grep, Glob, Bash # optional; omit to inherit thread tools/MCP tools
  model: inherit               # alias (sonnet|opus|haiku|inherit)
  ---
  # System prompt with numbered procedures, checklists, success criteria
  ```
- **Management**:
  - `/agents` command: create, edit, delete, adjust tool scopes, inspect duplicates, and view plugin-provided agents.
  - Direct file edits or scripted creation (e.g., `echo '--- ...' > .claude/agents/<name>.md`).
  - CLI flag (`claude --agents '{ ... }'`) for ephemeral/session-based definitions.
- **Best practices**:
  - Start with Claude-generated draft, then harden instructions.
  - Focus each agent on one responsibility; include “Use proactively” cues where mandatory.
  - Limit tool access to reduce blast radius; inherit only when necessary.
  - Version-control project agents; share user-level agents only when appropriate.
- **Advanced usage**:
  - Chain agents (“First run code-analyzer, then optimizer”) for multi-step workflows.
  - Reliance on specific `description` phrasing improves dynamic selection.
  - Understand latency trade-offs: each subagent boots with a clean context; keep prompts concise.

### Example Templates
- **Code reviewer**: run `git diff`, apply security/readability checklist, categorize feedback (Critical/Warning/Suggestion).
- **Debugger**: capture errors, reproduce, isolate root cause, implement fix, verify, produce prevention notes.
- **Data scientist**: craft efficient SQL/BigQuery queries, annotate assumptions, summarize findings, recommend next steps.

---

## 2. Agent Skill Craftsmanship
- **Concise is key**: Only add instructions that justify token cost. Claude already knows generic concepts.
- **Degrees of freedom**:
  - *High*: heuristics / ordered lists for open-ended decisions (e.g., code review checklist).
  - *Medium*: pseudocode or parameterized scripts (e.g., report generator template).
  - *Low*: exact commands when operations are fragile (e.g., database migrations).
- **Model coverage**: Test Skills with Haiku (needs more guidance), Sonnet (balanced), Opus (avoid redundancy). Optimize for the weakest model you’ll rely on.
- **Structure & naming**:
  - Frontmatter requires `name` (≤64 chars, lowercase hyphenated) and `description` (≤1024 chars; specify when to use).
  - Favor gerund names (`processing-pdfs`, `testing-code`) plus progressive disclosure sections (overview → quick start → advanced workflows → troubleshooting).
- **Progressive guidance patterns**:
  - High-level overview with references.
  - Domain-specific sections grouped by task.
  - Conditional details triggered by input cues (e.g., “If form filling, follow Form layout analysis”).
- **Workflow design**:
  - Provide verifiable intermediate outputs, utility scripts, and environment notes.
  - Build evaluations first, iterate with Claude, observe navigation logs, avoid offering too many branches.
  - Document authentication/config steps separately; avoid time-sensitive info and Windows-only paths.
- **Checklist for readiness**:
  - Quality: concise, accurate, scoped instructions.
  - Code/scripts: runnable, version-controlled, with dependencies packaged.
  - Testing: run against all target models and sample tasks; log outcomes.

---

## 3. Plugin Ecosystem Integration
- **Quickstart sequence**:
  1. Scaffold marketplace + plugin directories.
  2. Create `.claude-plugin/plugin.json` manifest (`name`, `version`, `description`, `author`, etc.).
  3. Add components (commands, agents, skills, hooks, MCP servers).
  4. Register marketplace via `/plugin marketplace add …`, install using `/plugin`.
- **Plugin components**:
  - `commands/`: slash command markdown with frontmatter.
  - `agents/`: plugin-supplied subagents (same format as custom ones).
  - `skills/`: folders containing `SKILL.md` + optional references/scripts.
  - `hooks/`: JSON event handlers (`PreToolUse`, `PostToolUse`, `SessionStart`, etc.) – support command/validation/notification actions.
  - `.mcp.json`: packaged MCP servers with `${CLAUDE_PLUGIN_ROOT}` path variables.
- **Manifest essentials**:
  ```json
  {
    "name": "deployment-tools",
    "version": "2.1.0",
    "description": "CI/CD automation toolkit",
    "author": {"name": "DevOps Team"},
    "commands": ["./commands/deploy.md"],
    "agents": "./agents/",
    "skills": "./skills/",
    "hooks": "./hooks/hooks.json",
    "mcpServers": "./.mcp.json"
  }
  ```
  - Paths supplement default directories; all must be relative (`./`).
  - Use `${CLAUDE_PLUGIN_ROOT}` inside scripts/hooks for portability.
- **Team distribution**:
  - Configure `.claude/settings.json` with `extraKnownMarketplaces` and `enabledPlugins`; teammates trust folder to auto-install.
  - Use semantic versioning for upgrades; manage via marketplace manifests.
- **Debugging**: `claude --debug` to inspect plugin loading; check manifest syntax, directory layout, script executability.

---

## 4. Tool Use Orchestration
- **Client tools**: User-hosted functions triggered via `tool_use` stop reason. Steps: define tool schema → Claude requests → run tool → return `tool_result` message (optional if only need requested action).
- **Server tools**: Anthropic-hosted (Web Search, Web Fetch). Provide in request; Claude executes and integrates results automatically.
- **Integration tips**:
  - Provide structured JSON schemas with enums/descriptions.
  - Handle streaming `tool_use` deltas (partial JSON) if using SSE.
  - Combine with extended thinking: understand `thinking_delta` and signature events for integrity.
- **Permission alignment**: Ensure tool whitelists in settings (`permissions.allow`) match agent requirements; use hooks for guardrails (e.g., PostToolUse validations).

---

## 5. Operational Checklist
1. **Blueprint**: Define required subagents, Skills, plugins, and tools for the project.
2. **Configuration**:
   - Store subagents/SKILLs in `.claude/` (project) or plugin packages.
   - Update `settings.json` with permissions, marketplaces, enabled plugins, environment variables.
3. **Testing**:
   - Run `/agents`, `/plugin`, and sample tool calls locally.
   - Validate Skills across intended models; record evaluation set.
4. **Governance**:
   - Version control all agent assets.
   - Apply progressive disclosure and token discipline.
   - Document utility scripts and dependencies.
5. **Monitoring**:
   - Use `claude --debug` for plugin diagnostics.
   - Review tool logs, hook outcomes, and agent usage patterns.

By adopting these practices, the advanced AI expert team maintains focused, high-performing agents that integrate seamlessly with Claude’s subagent, plugin, and skill ecosystems while remaining secure and maintainable.
