# Anchor OS

Personal finance and commitment tracking system. TypeScript · React 19 · Vite · Tailwind CSS · Firebase (Firestore, Auth, Functions, Hosting). Used daily by real people on mobile (75%) and desktop.

## Workflow (every task, no exceptions)

1. **GATHER** — Run `get_project_state` MCP tool or `curl -s http://localhost:3001/api/command-center | head -100`. Check duplicates with `get_bugs` + `get_features`. Read relevant docs from `docs/`. Report findings.
2. **PLAN** — List files to modify, tests to write, risks from multiple perspectives. **Stop. Wait for user approval.**
3. **BUILD** — TDD: write failing test → make it pass → refactor. If TDD doesn't apply (config/docs/tooling), state exception explicitly. Keep files under 200 lines (ARCH-001).
4. **CLOSE** — Run `npm run test -- --run` + `npm run lint`. Commit with correct prefix. Verify dashboard detected it. Report completion.

## Critical Rules

- All DB through `src/utils/secureDb.ts` — never raw Firestore
- Mobile-first — touch targets ≥44px, test on 375px viewport
- Never deploy production without explicit approval
- Use `npm run deploy:{env}` — never raw `firebase deploy`
- Session limit: 4–5 tasks then recommend fresh conversation
- No `any` type, no `console.log` in production, no hardcoded secrets

## Commit Prefixes (dashboard auto-detects)

`fix(scope): BUG-XXX desc` · `feat(scope): FEAT-XXX desc` · `refactor(scope): desc` · `test(scope): desc` · `docs(scope): desc` · `chore(scope): desc` · `deploy(env): vX.X.X @ HASH`

## Environments

Dev: `npm run deploy:dev` → anchor-os-dev-1c6ec.web.app
Staging: `npm run deploy:staging` → anchor-os-staging.web.app
Production: `npm run deploy:production` → anchor-os.web.app (⚠️ requires approval)

## Key Directories

`src/features/{feature}/` — Feature modules · `src/services/` — AccountService, TransactionService · `src/utils/secureDb.ts` — ALL database ops · `packages/design-system/` — UI primitives · `functions/src/` — Cloud Functions · `tools/dashboard/` — Internal PM Dashboard · `tools/mcp-server/` — MCP server · `e2e/` — Playwright tests

## MCP Tools

`get_project_state` · `get_bugs` · `get_features` · `get_roadmap` · `get_environment_parity` · `search_git` · `get_next_id` · `get_kanban` · `get_velocity` · `get_changelog`

## Anti-Patterns (real failures — never repeat)

1. Deploying without approval (rolled back 2026-01-29)
2. Creating duplicate bugs without checking dashboard first
3. Coding without reading relevant docs
4. Shared account double-counting in net worth (each account has ONE owner)
5. Breaking 200-line rule
6. Writing implementation before tests
7. Desktop-first UI (75% mobile users)
8. Bypassing secureDb.ts
9. Optimistic updates without rollback
10. Updating deleted doc files (git commits are source of truth)
11. Running raw `firebase deploy` instead of npm scripts
12. Production deploy without full test suite (2026-02-09)
13. Skipping GATHER phase

## Docs Reference

Architecture: `docs/ARCHITECTURE_OVERVIEW.md` · Schema: `docs/FIRESTORE_SCHEMA.md` · Security: `docs/SECURITY.md` · Testing: `docs/TESTING_STRATEGY.md` · Errors: `docs/ERROR_HANDLING.md` · Family Mode: `docs/adr/FAMILY_SHARING_V3_*.md` · Finance: `docs/ANCHOR_FINANCE_SPEC.md` · Design: `docs/DESIGN_PHILOSOPHY.md` · Tokens: `docs/DESIGN_TOKENS.md`
