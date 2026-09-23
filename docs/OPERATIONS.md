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
- Functions env files follow the firebase-tools convention: the CLI loads `functions/.env`, then `functions/.env.<projectId>` (and `.env.<alias>`, which cannot coexist with the project-ID file). AnchorOS deploys with `--project <projectId>`, so `scripts/ci/functions-env-file.js` is the single source of truth for the Functions env path, and the deploy guard validates exactly that file.

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
  └─► Staging Deploy (staging.yml): EXPLICIT operator workflow_dispatch for the
        current master tip only — a merge/push to master never mutates staging.
        Note: after any merge the tip is the `chore(release): <tag>` commit that
        `version.yml` pushes, **not** the PR merge commit (see "Deployable SHA").
        Gates: SHA is current master tip → CI success for that SHA → classify vs
        last successfully deployed staging SHA (fail closed: bootstrap_required)
        → surface-aware guarded deploy → fail-fast release smoke.
```

Workflow files: `.github/workflows/ci.yml`, `.github/workflows/staging.yml`, `.github/workflows/production.yml` — one responsibility each.

## Deployment surfaces

`hosting` (frontend) · `rules` (Firestore + storage rules) · `indexes` · `functions` · `ci-only` (nothing deploys).

Classification is computed by `scripts/ci/deploy-surface-classifier.js` from ALL changes since the last successful deployment, so a previously failed deployment never causes missed surfaces. Missing provenance **fails closed** (`bootstrap_required`) — an unknown baseline is never treated as "deploy everything"; the first deployment requires explicit operator authorization (`authorize_bootstrap=true`). B1-style ordered backend rollout: rules first, then an explicit functions allow-list (`--functions=disconnectFamily,shareAccount,runMigration,listMigrations,getMigrationStatus`).

## Versions & releases

- **Automatic.** Nobody bumps a version by hand. `.github/workflows/version.yml` runs on every merge to `master` and, in one pass: derives the bump from Conventional Commits since the last tag (`feat` → minor, `fix` → patch, `BREAKING CHANGE` → major), runs `commit-and-tag-version` (`npm run version:{rc|production|dev}` mapping onto `version:staging|production|dev`), commits `chore(release): <tag>`, pushes the commit + annotated tag, explicitly requests CI for the release commit, and publishes the GitHub Release.
- **Why versioning is its own workflow:** `staging.yml` / `production.yml` are dispatch-only deployments and `production.yml` is invariant-tested to never push, commit or version-bump master. `staging.yml` passes `--skip-version-bump` precisely because this workflow owns the bump. Pushing to master still never mutates an environment.
- **GITHUB_TOKEN caveat (why step "Request CI" exists):** a push made with the default `GITHUB_TOKEN` does not trigger other workflows. Since staging/production only deploy a SHA whose `ci.yml` run succeeded, the release commit would otherwise be permanently undeployable — so the workflow dispatches `ci.yml` for it (which is why `ci.yml` is dispatchable).
- **Channels:** `rc` (default, staging prerelease), `production` (final, non-prerelease cut), `dev` (local-only prerelease, changelog skipped). Re-run the workflow manually to cut a specific channel; the idempotence + loop guards make repeated runs safe.
- **Deployable SHA (learned from a false staging failure).** `staging.yml` authorizes only the *current master tip*, and every merge is followed by a `chore(release): <tag>` commit from `version.yml`. So the deployable SHA is normally the **release commit** (the tagged `<tag>` commit), never the PR merge commit. Dispatching staging with the PR merge SHA races the version workflow and fails the provenance guard with `❌ Requested SHA … is not the current master tip` — this is the guard working correctly, **not** a test or deploy failure (run `35449036186`, 2026-09-19). Correct order: merge → wait for `version.yml` → copy the sha from `git log -1 origin/master` (or the new tag) → dispatch staging with it. A guard rejection produces no deploy and no partial mutation, so it never needs a rollback.
- **Untagged release commit — `6f482bdf chore(release): v1.21.0-rc.10` (known, benign).** On 2026-09-19 the release run pushed its version-only commit to `master` but never published the annotated tag, because the release push was blocked on the developer pre-push hook (root cause and fix: PR #226). The commit is on master with **no** `v1.21.0-rc.10` tag. Nothing was lost: deployability is *never* inferred from a tag — provenance is the successful workflow run for a SHA (`scripts/ci/last-deployed-sha.js`) — no environment was mutated, and `v1.21.0-rc.11` was cut on top of it minutes later, superseding it. Detection: a `chore(release):` commit in `git log` whose tag is absent from `git tag` (`git tag --points-at 6f482bdf` is empty). Deliberate non-action: we do not rewrite master and do not back-fill the tag; if the GitHub Release list ever needs it, tagging that existing SHA retroactively is safe, but it is not required.
- **Manual fallback (rarely needed):** `npm run version:{dev|staging|production}` still exists for local prerelease work; CI is the only path that tags or publishes.
- **GitHub Releases are the authoritative full release history.** `CHANGELOG.md` is a small bounded pointer/recent-summary; version tooling appends only new release sections (never the full history). Do not let it grow unbounded.
- Deploy provenance is the successful workflow run for a SHA (`scripts/ci/last-deployed-sha.js`) — no deploy-marker commits.

## Health, rollback & regression

- Post-deploy health check with automated `firebase hosting:rollback` on failure (hosting surface only).
- Release-smoke failures upload traces/screenshots as workflow artifacts.
- Weekly scheduled full E2E regression runs against staging (sharded, in `ci.yml`).

## PWA distribution

AnchorOS ships as an installable PWA — there are no native shells.

- Manifest: `public/manifest.webmanifest`; icons under `public/icons/`; service worker `public/sw.js` (cache + background messaging), registered from `src/main.tsx`.
- Install/update UX lives in `src/components/pwa/`; installed-app styling is `src/styles/app-shell.css`, applied via the platform classes from `src/utils/platform.ts`.
- The service worker cache name is version-stamped during the build.

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
