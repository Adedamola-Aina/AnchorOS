# Anchor OS — Verified Audit (Fact-Checked)

Date: 2026-02-14
Scope: Verification of major claims from the proposed “Exhaustive 100% Codebase Audit” against the current repository state.

## Executive verdict
The draft audit is directionally useful, but it is **not fully accurate**. It contains a mix of:
- Confirmed findings
- Outdated/inaccurate counts
- Refuted technical claims
- Items that cannot be verified from code alone

## Verified counts (current repo)

| Metric | Draft Claim | Verified | Status |
|---|---:|---:|---|
| Production source files (`src`, non-test `.ts/.tsx`) | 218 | 221 | ⚠️ close but not exact |
| Unit test files (`src/**/*.test.ts(x)`) | 146 | 146 | ✅ |
| E2E specs (`e2e/*.spec.ts`) | 22 | 22 | ✅ |
| Cloud Functions files (`functions/src`) | 16 | 16 | ✅ |
| Config files (`config/`, top-level) | 19 | 19 | ✅ |
| Scripts (`scripts/`, top-level) | 9 | 9 | ✅ |
| GitHub workflows (`.github/workflows/*.yml`) | 4 | 4 | ✅ |
| Docs (`docs/**/*.md`) | 28 | 29 | ❌ outdated |
| NPM dependencies (`package.json` dependencies) | 57 | 26 | ❌ incorrect |
| Firestore rules line count | 292 | 292 | ✅ |
| Firestore indexes | 13 | 13 | ✅ |
| Total production LOC (`src` non-test) | ~19,628 | 20,251 | ❌ inaccurate |

Notes:
- `tools/` file count depends heavily on whether dependencies/build artifacts are included. Raw file count is very large if `node_modules` are included.
- Source-only `tools/` count (excluding `node_modules`, `dist`, `build`, `coverage`) is 72, not 50.

## Claim-by-claim status (high-impact items)

### Confirmed
- ESLint `@typescript-eslint/no-explicit-any` is off in [config/eslint.config.js](config/eslint.config.js).
- Coverage thresholds are below 80 in [config/vitest.config.ts](config/vitest.config.ts).
- Lighthouse assertions are mostly `warn` in [config/lighthouserc.js](config/lighthouserc.js).
- Mutation testing scope is narrow in [config/stryker.config.mjs](config/stryker.config.mjs).
- No `CODEOWNERS` file exists.
- PWA manifest uses SVG-only icons in [public/manifest.webmanifest](public/manifest.webmanifest).
- Legacy `anchor.*` token block is still present in [config/tailwind.config.js](config/tailwind.config.js).
- Checkmarx workflow contains template-style/placeholder setup in [.github/workflows/checkmarx-one.yml](.github/workflows/checkmarx-one.yml).
- No dedicated `NotFound` route/component discovered; wildcard redirects to dashboard in [src/App.tsx](src/App.tsx).

### Refuted / Incorrect
- “No client-side rate limiting on financial operations.”
  - Refuted: rate limiting exists in [src/services/TransactionService.ts](src/services/TransactionService.ts), [src/services/AccountService.ts](src/services/AccountService.ts), and also commitments in [src/hooks/useCommitmentService.ts](src/hooks/useCommitmentService.ts).
- “No offline resilience testing.”
  - Refuted: offline/network tests exist in [e2e/errors.spec.ts](e2e/errors.spec.ts).
- “CSV export is transactions only.”
  - Refuted: export includes accounts, transactions, commitments in [src/utils/csvExport.ts](src/utils/csvExport.ts).
- “58 console statements in production code.”
  - Current count: 50 non-test matches.
- “16 non-service files directly importing Firestore.”
  - Current non-test direct import matches: 31 (not all are violations; some are service/api/util infrastructure).

### Partially true / needs tighter wording
- “No feature flag infrastructure.”
  - Mostly true in runtime implementation. There are optional env-flag docs in [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md), but no robust progressive-delivery system.
- “No product analytics.”
  - True if meaning product KPI analytics (funnels/retention), but there is telemetry/error instrumentation in [src/services/telemetry/index.ts](src/services/telemetry/index.ts) and Sentry init in [src/main.tsx](src/main.tsx).

### External verification required (cannot be proven from repo alone)
- Branch protection and required-review settings.
- Whether Checkmarx secrets are configured and scans are actually succeeding.
- GitHub Releases hygiene (depends on remote repository state).

## Recommended use of the draft audit
- Keep: architectural/security/testing themes and priority intent.
- Fix immediately: numeric census rows and refuted claims.
- Split findings into three lanes before execution:
  1. **Repo-verified now** (actionable immediately)
  2. **Repo-ambiguous** (needs short spike)
  3. **External/GitHub settings** (ops owner action)

## Immediate corrected priorities (high-confidence)
1. Enforce `no-explicit-any` and raise coverage thresholds in config.
2. Tighten Lighthouse assertions for key web vitals.
3. Add `CODEOWNERS`.
4. Add PNG PWA icons.
5. Expand mutation scope incrementally (hooks/utils).
6. Build formal feature-flag/progressive rollout system (not just env toggles).

---

This file is the fact-checked baseline and should supersede the unverified draft for planning decisions.
