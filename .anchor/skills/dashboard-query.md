# Skill: Dashboard Query
# How every agent reads the project's source of truth before acting
# Dashboard: localhost:3001 | MCP server: tools/mcp-server/

---

## Rule

**The dashboard is always consulted before planning or building anything.**
Never assume project state from memory. Never create IDs manually. Always query.

---

## MCP Tools Reference

Use these in Copilot/Claude sessions when MCP server is running:

| Tool | Returns | Use When |
|------|---------|----------|
| `get_project_state` | Overall health, active sprint, blockers, env parity | Start of every GATHER |
| `get_bugs` | All tracked bugs with status | Before creating any BUG-XXX |
| `get_features` | All tracked features with status | Before creating any FEAT-XXX |
| `get_roadmap` | Planned, in-progress, deferred items | During PLAN phase |
| `get_environment_parity` | Dev vs staging vs prod diff | Before any deploy |
| `get_kanban` | What's in-progress right now | Avoiding conflicts |
| `get_velocity` | Throughput and pacing data | Sprint planning |
| `get_changelog` | Recent commits as detected by dashboard | After committing |
| `get_next_id` | Next available ID for a given type | Before creating new item |
| `search_git` | Search commit history | Finding when something changed |

---

## HTTP Fallback (When MCP Server Not Running)

```bash
# Full command center snapshot
curl -s http://localhost:3001/api/command-center | head -100

# Next ID for a type
curl -s "http://localhost:3001/api/intake/next-id?type=bug"
curl -s "http://localhost:3001/api/intake/next-id?type=feature"
curl -s "http://localhost:3001/api/intake/next-id?type=gap"

# Current bugs
curl -s http://localhost:3001/api/bugs

# Current features
curl -s http://localhost:3001/api/features
```

---

## ID Prefix System

| Prefix | Meaning | Auto-detected from commit |
|--------|---------|--------------------------|
| `BUG-XXX` | Bug fix | `fix(scope): BUG-XXX ...` |
| `FEAT-XXX` | New feature | `feat(scope): FEAT-XXX ...` |
| `GAP-XXX` | Missing capability identified | Any commit referencing GAP-XXX |
| `REG-XXX` | Regression | `fix(scope): REG-XXX ...` |
| `UX-XXX` | UX improvement | `fix(scope): UX-XXX ...` |
| `REM-XXX` | Remediation item | `fix(scope): REM-XXX ...` |
| `ARCH-XXX` | Architecture work | `refactor/feat: ARCH-XXX ...` |
| `FIN-XXX` | Finance feature (used in v1.10) | `feat(finance): FIN-XXX ...` |

**Always get the next ID from the dashboard. Never manually increment.**

---

## Duplicate Check Protocol

Before creating ANY new bug or feature:

```
1. get_bugs → scan titles for semantic similarity
2. get_features → scan titles for semantic similarity
3. If duplicate found → reference existing ID, do not create new one
4. If genuinely new → get_next_id → use that ID in all commits and docs
```

---

## Post-Deploy Verification

After every deploy, verify dashboard registered it:

```
get_changelog → look for deploy(env): vX.X.X @ HASH entry
get_environment_parity → verify target env matches expected state
get_project_state → confirm no new blockers introduced
```
