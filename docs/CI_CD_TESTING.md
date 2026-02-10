# CI/CD & Testing Expectations

## Pipeline Overview

All code goes through the CI/CD pipeline defined in `.github/workflows/ci-cd.yml`.

### Trigger Rules
| Event | Branches | Jobs Run |
|-------|----------|----------|
| `push` | master, staging, develop | All applicable jobs |
| `pull_request` | master, staging | test, e2e-tests |

### Job Dependency Chain
```
test → e2e-tests
test → mutation-tests (master only)
test → rules-tests (master only)
test → build-production (master only) → lighthouse → deploy-production
test → build-staging (staging/develop) → deploy-staging
```

### Production Deploy Gate
`deploy-production` requires **all** of:
- ✅ Unit tests (test)
- ✅ E2E tests (e2e-tests)
- ✅ Mutation tests (mutation-tests)
- ✅ Firestore rules tests (rules-tests)
- ✅ Lighthouse CI (lighthouse)
- ✅ Manual approval via GitHub environment protection

### Failure Notifications
On any workflow failure, `.github/workflows/ci-failure-email.yml` automatically:
1. Downloads failing run logs via `tools/ci/fetch_failed_logs.sh`
2. Uploads logs as a GitHub artifact
3. Sends email to `NOTIFY_EMAIL` with run details

**Required secrets for email notifications:**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `SMTP_FROM` — sender address
- `NOTIFY_EMAIL` — recipient address

## Testing Stack

| Layer | Tool | Command |
|-------|------|---------|
| Unit | Vitest | `npm test` |
| E2E | Playwright (Chromium) | `npm run test:e2e` |
| Mutation | Stryker | `npm run test:mutation` |
| Firestore rules | Firebase Emulator + rules-unit-testing | `npm run test:rules` |
| Performance | Lighthouse CI | `npm run lighthouse` |

## E2E Test Guidelines

### Selector Priority (most → least stable)
1. `data-testid` attributes — immune to text/style changes
2. `getByRole()` — accessible and semantic
3. `getByLabel()` / `getByPlaceholder()` — form inputs
4. `getByText()` — visible text (fragile to copy changes)
5. `page.locator('text=...')` — **avoid** (most brittle)

### Known Tech Debt
~73 E2E selectors still use raw `text=` locators. These should be migrated to `data-testid` or `getByRole` over time. See `e2e/` directory.

### MFA Testing
MFA recommendation was moved from a Settings banner to the **onboarding flow**. Tests in `e2e/security.spec.ts` verify Setup 2FA / Disable buttons in Security Settings only. No "MFA Recommended" banner exists in Settings anymore.

## Local CI Log Retrieval

```bash
# Download logs for failing runs on a branch (last N days)
GITHUB_TOKEN=ghp_... ./tools/ci/fetch_failed_logs.sh OWNER REPO BRANCH DAYS

# Example
GITHUB_TOKEN=$GITHUB_TOKEN ./tools/ci/fetch_failed_logs.sh Adedamola-Aina AnchorOS fix/e2e-mfa-banner 2
```

Logs are extracted to `./ci-logs/`.
