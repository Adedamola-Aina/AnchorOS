---
name: dashboard
description: Internal PM Dashboard integration. Use when checking project state, logging bugs/features, querying velocity, or understanding what work is in progress.
---

# Internal PM Dashboard

Single source of truth for project management. Runs at `localhost:3001` (or `anchor.tail2fa2e.ts.net:3443` via Tailscale).

## MCP Tools (prefer these over curl)
| Tool | Purpose |
|------|---------|
| `get_project_state` | Full command center view — ALWAYS run first |
| `get_bugs` | Active bugs with severity and status |
| `get_features` | Feature backlog with progress |
| `get_roadmap` | Planned work from roadmap.json |
| `get_environment_parity` | Dev/staging/production version comparison |
| `search_git` | Search git history by keyword |
| `get_next_id` | Next available BUG-XXX or FEAT-XXX ID |
| `get_kanban` | Kanban board view of all work items |
| `get_velocity` | Development velocity stats |
| `get_changelog` | Recent changes log |

## API Fallbacks (when MCP unavailable)
`/api/command-center` · `/api/git/bugs` · `/api/git/features` · `/api/git/roadmap` · `/api/parity` · `/api/git/search/{keyword}` · `/api/intake/next-id?type=bug` · `/api/git/kanban` · `/api/velocity/stats` · `/api/git/changelog`

## How It Works
Dashboard parses git commit history. Correct commit prefixes trigger automatic detection. No manual doc updates needed — git is the source of truth. Auto-archival after 30 days.

## Intake Workflow
1. Check duplicates: `get_bugs` + `get_features` + `get_roadmap`
2. Classify: BUG-XXX · REG-XXX · GAP-XXX · FEAT-XXX · UX-XXX
3. Get next ID: `get_next_id`
4. Commit with correct prefix — dashboard auto-detects
