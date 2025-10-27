# Claude Platform Operations Reference
*Compiled from Claude Docs on models, settings, context, caching, streaming, token counting, and related APIs.*

---

## 1. Model Strategy
- **Primary guidance**:
  - Balance *capabilities*, *speed*, *cost* when selecting models.
  - Start with **Claude Sonnet 4.5** for most workflows; fall back to **Haiku 4.5** for latency/cost-sensitive tasks; escalate to **Opus 4.1** for highly complex reasoning or planning.
  - Two approaches:
    - *Iterate up*: begin with Haiku, upgrade if gaps appear.
    - *Start at top*: begin with Sonnet (or Opus) for critical accuracy, optimize down later.
- **Model aliases** (`model-config`):
  | Alias | Behavior |
  | --- | --- |
  | `default` | Recommended model per account; may auto-fallback if limits reached. |
  | `sonnet` | Latest Sonnet snapshot (4.5 currently). |
  | `opus` | Opus 4.1 snapshot. |
  | `haiku` | Fast, economical Haiku 4.5. |
  | `sonnet[1m]` | Sonnet with 1M token context (beta). Requires long-context pricing header. |
  | `opusplan` | Uses Opus during plan mode, then Sonnet for execution. |
- **Config precedence**: `/model` command > CLI flag `--model` > `ANTHROPIC_MODEL` env var > `settings.json` `model` field. Enterprise managed settings supersede all.
- **Environment overrides**:
  - `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL` map aliases to specific snapshots.
  - `CLAUDE_CODE_SUBAGENT_MODEL` defines default for subagents.
  - Prompt caching toggles: `DISABLE_PROMPT_CACHING` (global) or per-model suffix vars.
- **Model snapshots & IDs** (2025):
  | Model | API ID | Context | Output limit | Pricing (input/output MTok) |
  | --- | --- | --- | --- | --- |
  | Sonnet 4.5 | `claude-sonnet-4-5-20250929` | 200K (1M beta) | 64K | $3 / $15 |
  | Haiku 4.5 | `claude-haiku-4-5-20251001` | 200K | 64K | $1 / $5 |
  | Opus 4.1 | `claude-opus-4-1-20250805` | 200K | 32K | $15 / $75 |

---

## 2. Settings & Permissions
- **Hierarchy**: Managed policies (`/Library/.../managed-settings.json`) → CLI flags → `.claude/settings.local.json` → `.claude/settings.json` → `~/.claude/settings.json`.
- **Key settings options**:
  - `permissions.allow/deny`: fine-grained control for `Bash`, `Read`, `Write`, `WebFetch`, etc.
  - `env`: session-wide environment variables (e.g., API keys, telemetry).
  - `hooks`: pre/post tool automation (see hooks guide).
  - `enabledPlugins`, `extraKnownMarketplaces`: plugin enablement & distribution.
  - `statusLine`, `outputStyle`, `forceLogin*`: UX and login policies.
- **Sensitive data protection**: use `permissions.deny` to block `.env`, `secrets/**`, etc. Supersedes deprecated ignore patterns.
- **Tool catalog**: Bash, Read, Write, Edit, Glob, Grep, NotebookRead/NotebookEdit, SlashCommand, Task, TodoWrite, WebFetch, WebSearch. Configure access via settings or `/allowed-tools`.
- **Enterprise**: Managed MCP configs, allow/deny lists for servers, mandatory plugin/marketplace approvals.

---

## 3. Context Windows & Tokens
- **Standard context**: 200K tokens (input + output). Both user messages and assistant responses accumulate linearly.
- **Extended thinking**:
  - Thinking blocks count as output tokens but prior thinking is stripped from subsequent inputs automatically.
  - Effective context = `(input tokens − previous thinking) + current turn tokens`.
- **Tool use interactions**: When combined with tool results, ensure total (input + output) stays within window; tool outputs count as part of conversation.
- **1M token context**: Sonnet supports via `[1m]` suffix (beta); requires dedicated header and incurs long-context pricing.
- **Context awareness**: Sonnet 4.5 & Haiku 4.5 receive system warnings on remaining budget during tool workflows (200K/500K/1M budgets).
- **Validation**: Newer models return validation errors if prompt + expected output exceed context instead of truncating—plan via token counting.

### Token Counting API
- Endpoint mirrors message structure (system, tools, messages, images, PDFs).
- Returns estimated `input_tokens`; actual usage may differ slightly.
- Includes system-added optimization tokens in output but billing excludes them.
- Use to gate large requests, manage long sessions, and route models.

---

## 4. Prompt Caching
- **Mechanism**: Cache prompt prefixes (tools → system → messages) using `cache_control` blocks; reduces repeated input cost/time.
- **TTL options**: `ephemeral` 5-minute (default) and 1-hour (beta, higher write cost). Cache refreshed for free upon reuse.
- **Costs**:
  - Cache write: +25% of base input price for 5m TTL (higher for 1h).
  - Cache read: 10% of base input price.
  - Standard input/output tokens still billed for uncached segments.
- **Best practices**:
  - Place static content (tool schemas, long context, examples) before cache breakpoint.
  - One breakpoint suffices; system auto-checks ~20 prior block boundaries for matches.
  - Up to 4 breakpoints for sections with different update frequencies.
  - Minimum cacheable length: 1024 tokens (Sonnet/Opus), 2048 (Haiku 3.x), 4096 (Haiku 4.5).
  - Prompt caching supports tools/system/messages blocks. Invalidate when content/order changes beyond breakpoint.
- **Combination with extended thinking**: Thinking blocks do not persist across turns, so caching focuses on static instructions.

---

## 5. Streaming & Error Handling
- Enable via `"stream": true` (Messages API). Events follow flow:
  1. `message_start`
  2. `content_block_start` → `content_block_delta` (text / input_json / thinking / signature) → `content_block_stop`
  3. `message_delta` (cumulative usage)
  4. `message_stop`
  - Pings may appear; handle unknown event types gracefully (forward compatibility).
- **Tool & thinking deltas**: Tool input arrives as partial JSON; accumulate and parse on `content_block_stop`. Thinking streams via `thinking_delta` plus `signature_delta` for integrity.
- **Error events**: SSE `event: error` with payload (e.g., `overloaded_error`). Implement retry/backoff strategies.
- **SDK recommendations**: Prefer official Python/TypeScript streaming helpers that assemble deltas automatically.

---

## 6. Tooling & Permissions Recap
- **Client vs server tools**:
  - Client tools require you to execute and return `tool_result`.
  - Server tools (Web Search, Web Fetch) run on Anthropic infrastructure; include in request payload.
- **Workflow**:
  1. Define tools (name, description, JSON schema).
  2. Claude issues `tool_use`; inspect `stop_reason`.
  3. Execute tool (if client) and respond with structured result.
  4. Claude integrates result into final answer.
- **Security**: Enforce tool-specific `permissions` and use hooks for audit/automation (e.g., format after Write, block risky commands).

---

## 7. Pricing & Rate Considerations
- **Model base rates**: (input/output MTok) – Sonnet 4.5 $3/$15, Haiku 4.5 $1/$5, Opus 4.1 $15/$75.
- **Prompt caching**: additional charges for cache writes/reads (see table above).
- **Extended thinking**: billed as output tokens; increases cost but strips from future inputs.
- **Long context**: requests beyond 200K tokens billed at long-context rates; ensure budgets align with `context-1m` header usage.
- **Tool usage**: Server tool invocations included in overall token accounting; client tools incur no direct API cost beyond tokens for tool requests/results.

---

## 8. Operational Checklist
1. **Model selection**: Document default alias, fallback logic, and environment overrides in project settings.
2. **Settings**: Define permissions, env vars, plugin marketplaces, and status line in `.claude/settings.json`; track precedence.
3. **Context management**: Use token counting pre-flight for long prompts; monitor context warnings in Sonnet/Haiku 4.5.
4. **Caching strategy**: Identify reusable prompt segments, apply `cache_control`, monitor cache hit metrics.
5. **Streaming**: Implement SSE handlers or use SDK streaming mode; handle errors gracefully.
6. **Tool governance**: Maintain JSON schemas, permission lists, and hook automations; test client tool integrations regularly.

This reference ensures the advanced AI expert team operates within Claude’s platform capabilities efficiently, securely, and cost-effectively while supporting long-running, high-complexity projects.
