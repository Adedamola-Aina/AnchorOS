# Anchor OS — Agent Entry Point
# Version: 3.0 | All agent instructions have moved to .anchor/

---

## Read This First

All AI agent instructions, workflows, role definitions, and skills
now live in `.anchor/`. This file is a navigation redirect only.

**Start here**: `.anchor/INDEX.md`

---

## Quick Reference

| Need | Go To |
|------|-------|
| Full workflow (GATHER→PLAN→BUILD→CLOSE) | `.anchor/WORKFLOW.md` |
| Which roles activate for this task | `.anchor/WORKFLOW.md` → Phase 0 |
| A specific agent persona | `.anchor/agents/XX-name.md` |
| Dashboard query patterns | `.anchor/skills/dashboard-query.md` |
| Risk classification | `.anchor/skills/risk-classification.md` |
| TDD cycle | `.anchor/skills/tdd-cycle.md` |
| Commit format | `.anchor/skills/commit-format.md` |
| secureDb usage | `.anchor/skills/securedb-patterns.md` |
| Firestore rules | `.anchor/skills/firestore-rules.md` |
| Architecture reference | `docs/ARCHITECTURE_OVERVIEW.md` |
| Schema reference | `docs/FIRESTORE_SCHEMA.md` |
| Security reference | `docs/SECURITY.md` |

---

## Dashboard (Source of Truth for Project State)

```
localhost:3001
MCP tools: get_project_state · get_bugs · get_features · get_roadmap
           get_environment_parity · search_git · get_next_id
           get_kanban · get_velocity · get_changelog
```

---

## Environments

| Env | Command | URL |
|-----|---------|-----|
| Dev | `npm run deploy:dev` | anchor-os-dev-1c6ec.web.app |
| Staging | `npm run deploy:staging` | anchor-os-staging.web.app |
| Production | `npm run deploy:production` ⚠️ requires Tech Lead approval | anchor-os.web.app |

---

## Session Start Prompt (Copilot / Claude)

```
@workspace Starting work on [task/ID].
Read .anchor/INDEX.md first, then .anchor/WORKFLOW.md.
Dashboard: localhost:3001
```
