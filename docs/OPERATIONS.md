# AnchorOS Operations

Environment model, release pipeline, and operational runbook. Executable truth: `.firebaserc`, `firebase.json`, `scripts/DEPLOY_PIPELINE.sh`, `.github/workflows/`.

## Environments (canonical)

| Environment | Definition |
|---|---|
| Development | **Local Firebase Emulator Suite** (`npm run emulator:start` + `npm run dev` on :5173) |
| Staging | Firebase project `anchor-os-staging` |
| Production | Firebase project `anchor-os` |

There is **no deployable development cloud**. The former dev project is retired forever; scripts hard-fail on it. Local seeding (`node scripts/seed-dev-data.cjs`) runs only when the emulators are active and can never write staging or production.

## Environment files

- Only `.env.example` is tracked. Real `.env*` files are git-ignored local overrides.
- CI/CD uses GitHub Environment secrets: `STAGING_FRONTEND_ENV`, `STAGING_FUNCTIONS_ENV`, `PRODUCTION_FRONTEND_ENV`, `PRODUCTION_FUNCTIONS_ENV`, `FIREBASE_TOKEN`.
- Never commit secrets. Never print env contents.

## Release-smoke identity (canary accounts)

Identity selection is owned by ONE module: `scripts/ci/release-identity.mjs`.

- **Local / PR emulator** (`E2E_BASE_URL` unset): the bounded smoke uses the disposable repository fixture identity (`e2e/fixtures/test-data.ts`) seeded into `demo-anchor-os`.
- **Deployed staging** (`E2E_BASE_URL` set, `E2E_SMOKE_TARGET=staging`): requires the dedicated staging canary secrets `STAGING_SMOKE_EMAIL` / `STAGING_SMOKE_PASSWORD`.
- **Deployed production** (`E2E_SMOKE_TARGET=production`): requires `PRODUCTION_SMOKE_EMAIL` / `PRODUCTION_SMOKE_PASSWORD`.

A deployed smoke **fails closed** when its canary credentials are absent; the repository fixture is never used against a cloud project. The canary accounts are ordinary AnchorOS accounts (verified email) provisioned per environment; their passwords live only in GitHub Environment secrets and are never committed or printed.

## Release pipeline (validate once, deploy that SHA)

```
pull request → CI (ci.yml)
  governance metadata check → classify changed surfaces → lint/types/unit →
  rules tests → integration tests → bounded smoke E2E
  (no deploy jobs; docs/CI-only PRs complete in minutes)

push to master → CI (ci.yml) proves the merged SHA
  ├─► Production Release (production.yml): awaits CI success for that exact SHA,
  │     classifies surfaces vs the last successfully deployed production SHA
  │     (fail closed: bootstrap_required), human approval via the `production`
  │     environment, surface-aware guarded deploy, release smoke, GitHub Release.
  └─► Staging Deploy (staging.yml): EXPLICIT operator workflow_dispatch for an
        exact SHA only — a merge/push to master never mutates staging.
        Gates: SHA is current master tip → CI success for that SHA → classify vs
        last successfully deployed staging SHA (fail closed: bootstrap_required)
        → surface-aware guarded deploy → fail-fast release smoke.
```

Workflow files: `.github/workflows/ci.yml`, `.github/workflows/staging.yml`, `.github/workflows/production.yml` — one responsibility each.

## Deployment surfaces

`hosting` (frontend) · `rules` (Firestore + storage rules) · `indexes` · `functions` · `ci-only` (nothing deploys).

Classification is computed by `scripts/ci/deploy-surface-classifier.js` from ALL changes since the last successful deployment, so a previously failed deployment never causes missed surfaces. Missing provenance **fails closed** (`bootstrap_required`) — an unknown baseline is never treated as "deploy everything"; the first deployment requires explicit operator authorization (`authorize_bootstrap=true`). B1-style ordered backend rollout: rules first, then an explicit functions allow-list (`--functions=disconnectFamily,shareAccount,runMigration,listMigrations,getMigrationStatus`).

## Versions & releases

- `commit-and-tag-version` via `npm run version:{dev|staging|production}`; version bumps and tags are CI-driven on master.
- **GitHub Releases are the authoritative full release history.** `CHANGELOG.md` is a small bounded pointer/recent-summary; version tooling appends only new release sections (never the full history). Do not let it grow unbounded.
- Deploy provenance is the successful workflow run for a SHA (`scripts/ci/last-deployed-sha.js`) — no deploy-marker commits.

## Health, rollback & regression

- Post-deploy health check with automated `firebase hosting:rollback` on failure (hosting surface only).
- Release-smoke failures upload traces/screenshots as workflow artifacts.
- Weekly scheduled full E2E regression runs against staging (sharded, in `ci.yml`).

## Native shells (Capacitor)

- Config: `capacitor.config.ts`; platforms under `ios/` and `android/` (generated shells — regenerated via `npx cap add/sync`, never hand-edited web assets).
- Web build first (`npm run build:production`), then `npx cap sync`, then `npx cap open ios|android`.
- iOS requires macOS + Xcode 15+; Android requires Android Studio (SDK 33+).
- Product logic never moves into Swift/Kotlin — native code is shells/bridges only.

## Developer tools (dev/staging builds only)

In-app Settings → Developer Tools (`src/features/settings/components/DeveloperTools.tsx`): seed test data, simulate family data, fix shared-account scopes, auto-accept invitations. Local seeding from the CLI: `node scripts/seed-dev-data.cjs` (emulators only — hard-fails otherwise).

## Local development quick reference

```bash
npm install
npm run emulator:start   # Firebase Emulator Suite
npm run dev              # app on http://localhost:5173
npm test                 # unit (Vitest)
npm run test:rules       # Firestore/storage rules against emulators
node scripts/seed-dev-data.cjs   # seed LOCAL emulators only
```
