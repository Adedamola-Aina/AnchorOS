# AnchorOS Operations

Environment model, commands, and the deploy path. Executable truth: `.firebaserc`,
`firebase.json`, `scripts/deploy.sh`, `.github/workflows/`.

## Environments (canonical)

| Environment | Firebase project | URL |
|---|---|---|
| Development | `demo-anchor-os` (local Emulator Suite) | http://localhost:5173 |
| Staging | `anchor-os-staging` | https://anchor-os-staging.web.app |
| Production | `anchor-os` | https://anchor-os.web.app |

There is **no deployable development cloud**. Development is the local Firebase
Emulator Suite; the former dev project is retired and must never be targeted.

## Local development

```bash
npm install
npm run dev:local        # emulators + Vite on :5173 (one command)
# or, separately:
npm run emulator:start
npm run dev
node scripts/seed-dev-data.cjs   # seed LOCAL emulators only
```

## Commands

```bash
npm run lint         # eslint
npm run typecheck    # tsc
npm run test         # unit tests (watch)
npm run test:run     # unit tests (single run)
npm run test:rules   # Firestore/storage rules against emulators
npm run test:functions:emulator
npm run build        # dist/
npm run verify       # lint + typecheck + unit tests + build
```

## Environment files

- Only `.env.example` is tracked. Real `.env*` files are git-ignored.
- The app reads `.env.<mode>` at build time (Vite modes: `development`, `staging`, `production`).
- Cloud Functions read `functions/.env.<projectId>` (firebase-tools convention),
  e.g. `functions/.env.anchor-os-staging` and `functions/.env.anchor-os`.
- In CI these are written from GitHub secrets (`STAGING_FRONTEND_ENV`,
  `STAGING_FUNCTIONS_ENV`, `PRODUCTION_FRONTEND_ENV`, `PRODUCTION_FUNCTIONS_ENV`).
- Never commit secrets; never print env contents.

## Deploy

Deploys run from GitHub Actions: **Actions → Deploy → Run workflow**, choosing the
environment. The workflow writes the env files from secrets and runs
`scripts/deploy.sh`, which builds the bundle and deploys every surface together —
hosting, Firestore rules + indexes, storage rules, and Functions.

Locally (with the env files present):

```bash
npm run deploy:staging      # ./scripts/deploy.sh --env=staging
npm run deploy:production   # ./scripts/deploy.sh --env=production --yes
```

The script refuses to run on a dirty working tree; production requires `--yes`.

## Rollback

- Hosting: `firebase hosting:rollback --project <projectId>`.
- Functions/rules: check out the previous good commit and deploy again.
