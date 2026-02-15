# ANCHOR OS — DOCUMENT REFERENCE

## Live Data (Dashboard API / MCP Tools)

| Data | MCP Tool | API Fallback |
|------|----------|-------------|
| Full project state | `get_project_state` | `/api/command-center` |
| Active bugs | `get_bugs` | `/api/git/bugs` |
| Roadmap | `get_roadmap` | `/api/git/roadmap` |
| Environment parity | `get_environment_parity` | `/api/parity` |
| Feature backlog | `get_features` | `/api/git/features` |
| Search git history | `search_git` | `/api/git/search/{keyword}` |
| Next available ID | `get_next_id` | `/api/intake/next-id?type=bug` |
| Kanban board | `get_kanban` | `/api/git/kanban` |
| Velocity stats | `get_velocity` | `/api/velocity/stats` |
| Changelog | `get_changelog` | `/api/git/changelog` |

Dashboard browser: https://anchor.tail2fa2e.ts.net:3443/

## Reference Docs (Read When Relevant)

| Document | Read when... |
|----------|-------------|
| `docs/ARCHITECTURE_OVERVIEW.md` | Complex changes, new features, cross-cutting concerns |
| `docs/FIRESTORE_SCHEMA.md` | Any database work, security rules, new collections |
| `docs/SECURITY.md` | Auth, permissions, data access, Family Mode sharing |
| `docs/TESTING_STRATEGY.md` | Writing tests, coverage strategy, test patterns |
| `docs/ERROR_HANDLING.md` | Error boundaries, recovery patterns, user-facing errors |
| `docs/adr/FAMILY_SHARING_V3_*.md` | Family mode work |
| `docs/ANCHOR_FINANCE_SPEC.md` | Finance module changes |

## Style Guides (Read for UI Work)

| Guide | Focus |
|-------|-------|
| `docs/DESIGN_PHILOSOPHY.md` | Calm, honest, utilitarian aesthetic |
| `docs/DESIGN_TOKENS.md` | Colors, spacing, shadows, radii |
| `docs/BUTTON_GUIDELINES.md` | Button hierarchy and patterns |
| `docs/ICON_GUIDELINES.md` | Icon usage and sizing |
| `docs/TYPOGRAPHY_GUIDE.md` | Font scale and hierarchy |

## Intake Workflow (Bugs, Features, Feedback)

1. Check duplicates: use `get_bugs` + `get_features` + `get_roadmap` MCP tools
2. Classify: BUG-XXX · REG-XXX · GAP-XXX · FEAT-XXX · UX-XXX
3. Get next ID: use `get_next_id` MCP tool
4. Commit with correct prefix — dashboard auto-detects everything
