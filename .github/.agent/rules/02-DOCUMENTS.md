# ANCHOR OS — DOCUMENT REFERENCE

## Live Data (Always Check First)
| Source | Command |
|--------|---------|
| **Full project state** | `curl -s http://localhost:3001/api/command-center` |
| **Active bugs** | `curl -s http://localhost:3001/api/git/bugs` |
| **Roadmap + priorities** | `curl -s http://localhost:3001/api/git/roadmap` |
| **Environment parity** | `curl -s http://localhost:3001/api/parity` |
| **Feature tracking** | `curl -s http://localhost:3001/api/git/features` |
| **Changelog** | `curl -s http://localhost:3001/api/git/changelog` |
| **Search git history** | `curl -s http://localhost:3001/api/git/search/{keyword}` |
| **Next available ID** | `curl -s http://localhost:3001/api/intake/next-id?type=bug` |
| **Kanban board** | `curl -s http://localhost:3001/api/git/kanban` |
| **Velocity stats** | `curl -s http://localhost:3001/api/velocity/stats` |

Dashboard browser: https://anchor.tail2fa2e.ts.net:3443/

## Reference Docs (Read When Relevant)
| Document | When to Read |
|----------|--------------|
| `docs/ARCHITECTURE_OVERVIEW.md` | Complex changes, new features |
| `docs/FIRESTORE_SCHEMA.md` | Database work, security rules |
| `docs/SECURITY.md` | Auth, permissions, data access |
| `docs/TESTING_STRATEGY.md` | Writing tests, coverage strategy |
| `docs/adr/FAMILY_SHARING_V3_*.md` | Family mode work |
| `docs/ANCHOR_FINANCE_SPEC.md` | Finance module work |
| `docs/ERROR_HANDLING.md` | Error boundaries, recovery patterns |

## Style Guides (Read for UI Work)
`docs/DESIGN_PHILOSOPHY.md` · `docs/DESIGN_TOKENS.md` · `docs/BUTTON_GUIDELINES.md` · `docs/ICON_GUIDELINES.md` · `docs/TYPOGRAPHY_GUIDE.md`

## Intake Workflow
When anything is reported (bug, feature, feedback):
1. **Check duplicates first**: query `/api/git/bugs`, `/api/git/features`, `/api/git/roadmap`
2. **Classify**: Bug (BUG-XXX) · Regression (REG-XXX) · Gap (GAP-XXX) · Feature (FEAT-XXX) · Enhancement (UX-XXX)
3. **Get next ID**: `curl http://localhost:3001/api/intake/next-id?type=bug`
4. **Add to roadmap if new planned work**: `tools/dashboard/server/roadmap.json`
5. **Commit with correct prefix**: dashboard auto-detects everything
