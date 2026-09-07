# AnchorOS Engineering Contract

This file is the canonical operating contract for coding agents and human contributors.
Provider-specific instruction files must stay small and point here instead of duplicating project rules.

## Product and stack

AnchorOS is a privacy-first household finance and commitment platform built with React 19, TypeScript strict mode, Firebase, and Capacitor. Mobile is the primary experience; design for a 375px baseline and at least 44px touch targets.

## Non-negotiable engineering invariants

- Keep TypeScript strict. Do not introduce `any` to bypass type design.
- Client Firestore access goes through `src/utils/secureDb.ts`; do not create new direct client database paths.
- Treat authentication, family sharing, financial data, Firestore rules, and Cloud Functions as security-sensitive.
- Never commit secrets or real production data. Do not read `.env*` files unless the owner explicitly asks for a specific environment investigation.
- Never run raw `firebase deploy`. Use the repository's environment-specific deploy scripts.
- Never deploy production without explicit owner approval.
- Preserve mobile usability, accessibility, dark mode, and family-data isolation when relevant.

## How work should run

Use the least ceremony that safely fits the change.

### Small / obvious

Examples: copy, isolated styling, a narrow bug with an obvious cause, small test/config fixes.

1. Search for the relevant symbol/file.
2. Read only the minimum surrounding code.
3. Make the focused change.
4. Run targeted verification.

No project-wide dashboard query, role simulation, or formal plan is required.

### Normal feature / bug

1. Search first; do not preload large directories or documentation.
2. Write a short implementation plan covering files, behavior, and verification.
3. Read only the domain docs needed for the task.
4. Implement the smallest coherent slice.
5. Run focused tests, then broader checks appropriate to the touched surface.

### High risk

High risk includes auth, Firestore rules/schema, shared finances/family permissions, payment/financial integrity, production infrastructure, deployment logic, and core Fabric AI behavior.

For these changes, produce a short design/risk plan before broad edits. Include data/security impact, rollback, verification, and environment rollout. Human approval is required before production deployment and before irreversible migrations.

## Testing policy

Testing is risk-based, not ceremony-based.

- Bug fixes should normally reproduce the failure with a test when practical.
- New domain/business logic needs focused unit/integration coverage.
- Security rules and auth paths require dedicated tests.
- UI changes should be checked at mobile width and with accessibility considerations.
- Do not create low-value tests solely to satisfy a universal TDD ritual.

Use the existing deterministic gates: TypeScript, lint, unit/integration tests, Playwright, Firebase emulator/rules tests, and CI as applicable.

## Architecture and file design

Prefer cohesive modules over arbitrary line-count limits. Split when a file has multiple independent responsibilities, is hard to test/reason about, or is growing beyond a sensible review size. Do not split a cohesive module merely to stay under 200 lines.

Search and symbol navigation should precede full-file reading. For external library/API behavior, use current official documentation or Context7 when connected; do not use external docs to infer AnchorOS business logic.

## Project state and the internal dashboard

The repository, Git history, tests, GitHub issues/PRs, and deployed environment are the sources of truth.

`tools/dashboard/` remains an optional read-only engineering observability console. Use it when environment parity, recent deployment activity, test/coverage snapshots, or release health are relevant. It is not a mandatory session bootstrap, task tracker, approval authority, or prerequisite for editing code.

Do not query the dashboard at the start of every task.

## Read docs on demand

Only open references relevant to the current change. Useful entry points include:

- `docs/ARCHITECTURE_OVERVIEW.md` — architecture changes
- `docs/FIRESTORE_SCHEMA.md` — schema/query changes
- `docs/SECURITY.md` — auth/security/rules
- `docs/TESTING_STRATEGY.md` — test strategy
- `docs/DESIGN_PHILOSOPHY.md` and `docs/DESIGN_TOKENS.md` — UI work
- `docs/ANCHOR_FINANCE_SPEC.md` — finance behavior
- `docs/DEPLOYMENT_CHECKLIST.md` — releases
- `docs/adr/` — decisions for the affected subsystem

Do not read `CHANGELOG.md` during ordinary coding; use Git history or targeted searches instead.

## Task and context discipline

One task should have one goal. After a goal is complete and committed, start a fresh task for unrelated work. If the same investigation grows large, compact/summarize before continuing. Preserve durable knowledge in code, tests, ADRs, issues, PRs, and commits—not in an ever-growing chat transcript.

## Commits and deployment

Use focused conventional commits (`fix:`, `feat:`, `refactor:`, `test:`, `docs:`, `chore:`). Keep unrelated work out of the same commit/PR. Staging precedes production for release-sensitive changes.
