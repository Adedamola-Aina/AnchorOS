# AnchorOS Operations

Environment model, release pipeline, and operational runbook. Executable truth: `.firebaserc`, `config/firebase.json`, `scripts/DEPLOY_PIPELINE.sh`, `.github/workflows/`.

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

## Release pipeline (validate once, deploy that SHA)

```
push to master
  └─► CI/CD Pipeline (ci-cd.yml): lint → types → unit → rules → E2E smoke
        │   (full certification: mutation, Lighthouse — once per SHA, surface-gated)
        ▼
Staging Deploy (staging-deploy.yml)
  1. await-validation  — blocks until CI succeeded for THE SAME SHA
  2. classify          — deploy-surface classifier vs the last SUCCESSFULLY
                         DEPLOYED staging SHA (never HEAD~1); no successful
                         deploy on record fails safe to ALL surfaces
  3. deploy            — guarded pipeline with skip flags (SHA already proven);
                         builds Hosting only if the hosting surface changed
  4. release-smoke     — fail-fast Playwright gate against deployed staging
                         (retries 0, 20s tests, 3-minute bound, chromium)
  5. post-deploy E2E   — full sharded suite, non-blocking
```

Production (`ci-cd.yml deploy-production`) additionally requires: explicit GitHub-environment approval, staging verification, exact validated SHA, surface-aware deploy, post-deploy release smoke, and a GitHub Release.

## Deployment surfaces

`hosting` (frontend) · `rules` (Firestore + storage rules) · `indexes` · `functions` · `ci-only` (nothing deploys).

Classification is computed by `scripts/ci/deploy-surface-classifier.js` from ALL changes since the last successful deployment, so a previously failed deployment never causes missed surfaces. B1-style ordered backend rollout: rules first, then an explicit functions allow-list (`--functions=disconnectFamily,shareAccount,runMigration,listMigrations,getMigrationStatus`).

## Versions & releases

- `commit-and-tag-version` via `npm run version:{dev|staging|production}`; version bumps and tags are CI-driven on master.
- **GitHub Releases are the authoritative release history.** `CHANGELOG.md` is a bounded recent-summary; the complete generated history lives in `docs/history/CHANGELOG-full.md` and in tags/releases. Do not let it grow unbounded.
- Deploy provenance is the successful workflow run for a SHA (`scripts/ci/last-deployed-sha.js`) — no deploy-marker commits.

## Health & rollback

- Post-deploy health check with automated `firebase hosting:rollback` on failure (hosting surface only).
- Release-smoke failures upload traces/screenshots as workflow artifacts.
- Weekly health check workflow monitors repository hygiene.

## Local development quick reference

```bash
npm install
npm run emulator:start   # Firebase Emulator Suite
npm run dev              # app on http://localhost:5173
npm test                 # unit (Vitest)
npm run test:rules       # Firestore/storage rules against emulators
node scripts/seed-dev-data.cjs   # seed LOCAL emulators only
```
