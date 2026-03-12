# Anchor OS — AI Agent System
# Single entry point. Read this first. Follow links. Do not improvise.
# Version: 3.0 | Effective: 2026-03-12

---

## What You Are Working On

Anchor OS is a household finance + commitment tracking platform.
React 19 · TypeScript strict · Firebase · Capacitor · 75% mobile users.
Real people's financial data. Privacy-first. Calm design. No gamification.

**The dashboard at `localhost:3001` (or MCP tools) is the single source of
truth for all project state** — bugs, features, roadmap, velocity, kanban.
Never create a bug or feature without checking it first.

---

## The 5 Hard Rules (Violations Caused Real Production Incidents)

1. ALL Firestore ops → `src/utils/secureDb.ts` — zero exceptions
2. Mobile-first — 375px baseline, 44px touch targets minimum
3. TypeScript strict — zero `any` types
4. Files ≤ 200 lines (ARCH-001) — split proactively
5. Never `firebase deploy` raw — always `npm run deploy:{env}`

---

## How To Start Any Task

```
Step 1: Read this file (you are doing this)
Step 2: Read .anchor/WORKFLOW.md
Step 3: Query the dashboard — confirm no duplicate work exists
Step 4: Identify risk class from .anchor/skills/risk-classification.md
Step 5: Activate the roles required for that risk class
Step 6: Execute GATHER → PLAN → [APPROVAL] → BUILD → CLOSE
```

Copilot / Claude session starter:
```
@workspace Starting work on [task ID + description].
Read .anchor/INDEX.md then .anchor/WORKFLOW.md.
Dashboard is at localhost:3001.
```

---

## Agent Roster

| File | Role | Activated |
|------|------|-----------|
| `.anchor/agents/01-pm.md` | Product Manager | PLAN phase |
| `.anchor/agents/02-architect.md` | Principal Architect | PLAN phase |
| `.anchor/agents/03-designer.md` | Lead UI/UX Designer | PLAN phase (UI) |
| `.anchor/agents/04-engineer.md` | Senior Engineer | BUILD phase |
| `.anchor/agents/05-set.md` | SET / QA Engineer | BUILD + CLOSE |
| `.anchor/agents/06-dba.md` | Database Engineer | PLAN + BUILD |
| `.anchor/agents/07-security.md` | Security Engineer | PLAN + BUILD + CLOSE |
| `.anchor/agents/08-sre.md` | SRE | PLAN + CLOSE |
| `.anchor/agents/09-devops.md` | DevOps Engineer | CLOSE (every deploy) |
| `.anchor/agents/10-mobile.md` | Mobile Platform Engineer | BUILD + CLOSE (UI) |
| `.anchor/agents/11-backend.md` | Backend / Functions Engineer | BUILD (Functions) |
| `.anchor/agents/12-techlead.md` | Tech Lead | CLOSE (final approval) |

Risk class → roles required: See `.anchor/skills/risk-classification.md`

---

## Skills Roster

| File | Use When |
|------|----------|
| `.anchor/skills/dashboard-query.md` | Querying dashboard / MCP |
| `.anchor/skills/tdd-cycle.md` | TDD red-green-refactor |
| `.anchor/skills/securedb-patterns.md` | All Firestore access patterns |
| `.anchor/skills/firestore-rules.md` | Writing + testing security rules |
| `.anchor/skills/commit-format.md` | Conventional commits + dashboard tagging |
| `.anchor/skills/risk-classification.md` | Risk A/B/C + required gates |

---

## Reference Docs (Read On Demand — Not Duplicated Here)

| Doc | Read When |
|-----|-----------|
| `docs/ARCHITECTURE_OVERVIEW.md` | Architect review (Role 02) |
| `docs/FIRESTORE_SCHEMA.md` | Any schema or query change |
| `docs/SECURITY.md` | Any auth or rules change |
| `docs/TESTING_STRATEGY.md` | Any test work |
| `docs/ERROR_HANDLING.md` | Any error path |
| `docs/DESIGN_PHILOSOPHY.md` | Any UI change |
| `docs/DESIGN_TOKENS.md` | Component styling |
| `docs/BUTTON_GUIDELINES.md` | Any button/CTA |
| `docs/TYPOGRAPHY_GUIDE.md` | Text/heading |
| `docs/ICON_GUIDELINES.md` | Icon usage |
| `docs/ANCHOR_FINANCE_SPEC.md` | Finance feature work |
| `docs/DEPLOYMENT_CHECKLIST.md` | Every deploy |
| `docs/SHIP_GATES.md` | PR governance + risk classes |
| `docs/ENGINEERING_EXECUTION_STANDARD.md` | ARCH-class items only |
| `docs/adr/FAMILY_SHARING_V3_*.md` | Family mode changes |
| `docs/adr/0002-anchor-ai-fabric-2.0.md` | Fabric AI changes |
| `docs/ANALYTICS_CONTRACT.md` | New analytics events |
| `docs/CAPACITOR_SETUP.md` | iOS/Android native changes |

---

## Files Superseded (No Longer Govern Agent Behavior)

| Old File | Replaced By |
|----------|-------------|
| `AGENTS.md` (root) | `.anchor/WORKFLOW.md` + `.anchor/agents/` |
| `REVIEW_BOARD.md` (root) | `.anchor/agents/` + `.anchor/WORKFLOW.md` |
| `agent-config-v7.md` | This system |
| `state.md` | Dashboard at `localhost:3001` |
| `implementer.agent.md` | `.anchor/agents/04-engineer.md` |
| `planner.agent.md` | `.anchor/agents/02-architect.md` |
| `reviewer.agent.md` | `.anchor/agents/12-techlead.md` |
| `devops.agent.md` | `.anchor/agents/09-devops.md` |
| `.github/.agent/rules/` | `.anchor/agents/` + `.anchor/skills/` |
| `.antigravity/` skills | `.anchor/skills/` |
