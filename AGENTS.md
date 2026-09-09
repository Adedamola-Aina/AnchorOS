# AnchorOS Engineering Contract

This file is the canonical operating contract for coding agents and human contributors.
Provider-specific instruction files (CLAUDE.md, .github/copilot-instructions.md, .clinerules/) are
minimal bridges that point here. When any instruction surface conflicts with this file, this file wins.

## Product architecture

AnchorOS is a privacy-first household finance and commitment platform built with React 19, TypeScript strict mode, Firebase, and Capacitor. Mobile is the primary experience; design for a 375px baseline and at least 44px touch targets.

**One product implementation.** React + TypeScript is the sole canonical implementation, distributed as Web/PWA plus Capacitor iOS/Android shells. Native Swift/Kotlin may exist only for OS integration, Capacitor plugins/bridges, generated shell code, platform lifecycle, and permissions. Product/business logic stays in TypeScript unless a future explicit architecture decision says otherwise. Do not reintroduce or maintain parallel product implementations.

Firebase remains the current backend during remediation.

## Environments

| Environment | Definition |
|---|---|
| Development | **Local Firebase Emulator Suite** (app on :5173 + emulators) |
| Staging | Firebase project `anchor-os-staging` |
| Production | Firebase project `anchor-os` |

There is **no deployable Firebase dev cloud environment**. `anchor-os-dev-1c6ec` is retired and must never be targeted by deploys, scripts, or configuration. All executable references to it have been removed; development is the local Firebase Emulator Suite.

## Governance

- GitHub commits, Issues, and PRs are the authoritative engineering history.
- GitHub Actions is the authoritative CI/release automation.
- The former internal PM dashboard/MCP tooling has been extracted from this repository; it is not an engineering source of truth and must not be reintroduced as one.

## Working method

Use the least ceremony that safely fits the change.

- Smallest sufficient scope; no arbitrary 200/400-line process requirements or file-splitting quotas.
- Targeted search before broad search; read only the minimum surrounding code.
- Targeted tests before broad tests; risk-based, not ceremony-based.
- No mandatory GATHER/PLAN/BUILD/CLOSE ceremony and no mandatory large walkthrough documents.
- No duplicate implementation documentation: record durable decisions in `docs/adr/`; executable behavior belongs in code, tests, and workflows — not prose.

Small/obvious changes (copy, isolated styling, narrow bug with obvious cause) go straight to a focused edit plus targeted verification. Normal feature/bug work gets a short plan (files, behavior, verification) before implementing the smallest coherent slice. High-risk areas — auth, Firestore rules/schema, shared finances/family permissions, financial integrity, production infrastructure, deployment logic, core Fabric AI behavior — get a short design/risk plan (data/security impact, rollback, verification, rollout) before broad edits.

## Safety

- No production deploy without explicit Product Owner approval.
- No production migration apply without explicit approval.
- No force pushes.
- No merging without explicit authorization.
- One approved remediation bundle per implementation branch.
- Never commit secrets or real production data; do not read `.env*` files unless the owner explicitly asks for a specific environment investigation.
- Never run raw `firebase deploy`; use the repository's environment-specific deploy scripts.

## Source-of-truth rule

When documentation disagrees with executable code:

1. Stop.
2. Identify the drift.
3. Correct the documentation or the implementation — intentionally and explicitly.
4. Do not invent a third interpretation.

## Testing

Bug fixes should normally reproduce the failure with a test when practical. New domain/business logic needs focused unit/integration coverage. Security rules and auth paths require dedicated tests. UI changes should be checked at mobile width with accessibility considerations. Do not create low-value tests solely to satisfy a universal TDD ritual. Use the existing deterministic gates: TypeScript, lint, unit/integration tests, Playwright, Firebase emulator/rules tests, and CI as applicable.

## Non-negotiable engineering invariants

- Keep TypeScript strict. Do not introduce `any` to bypass type design.
- Client Firestore access goes through `src/utils/secureDb.ts`; do not create new direct client database paths.
- Treat authentication, family sharing, financial data, Firestore rules, and Cloud Functions as security-sensitive.
- Preserve mobile usability, accessibility, dark mode, and family-data isolation when relevant.

## Read docs on demand

Only open references relevant to the current change. Useful entry points:

- `docs/ARCHITECTURE.md` — architecture changes
- `docs/DATA_MODEL.md` — schema/query changes
- `docs/SECURITY.md` (Git history) / `.github/SECURITY.md` — security reporting
- `docs/OPERATIONS.md` — environments, releases, runbook
- `docs/DESIGN_SYSTEM.md` — UI work
- `docs/PRODUCT.md` — finance behavior/product semantics
- `docs/adr/` — decisions for the affected subsystem

Do not read `CHANGELOG.md` during ordinary coding; use Git history or targeted searches instead.

## Task and context discipline

One task should have one goal. After a goal is complete and committed, start a fresh task for unrelated work. If the same investigation grows large, compact/summarize before continuing. Preserve durable knowledge in code, tests, ADRs, issues, PRs, and commits—not in an ever-growing chat transcript.

## Commits and deployment

Use focused conventional commits (`fix:`, `feat:`, `refactor:`, `test:`, `docs:`, `chore:`). Keep unrelated work out of the same commit/PR. Staging precedes production for release-sensitive changes.
