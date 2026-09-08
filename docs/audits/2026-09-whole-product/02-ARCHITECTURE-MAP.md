# Architecture Map (Phase 1)

Detailed per-file inventory lives in 01-CAPABILITY-INVENTORY.md. This file records the structural view.

## Entry points
- `src/main.tsx` → `src/App.tsx` (router + providers: ErrorBoundary, EnvironmentBanner, OfflineIndicator, PersistQueryClientProvider, NotificationProvider, AuthProvider, AnchorContext/AppProvider)
- `functions/src/index.ts` (Functions deployment; registries per domain in `functions/src/registries/`)
- `public/sw-register.js` → `public/sw.js`; `public/firebase-messaging-sw.js` (FCM)
- `capacitor.config.ts`; `apps/ios-native/AnchorOSNativeApp.swift` (native SwiftUI)

## Routes / screens
Public: `/` marketing, `/login`, `/accept-invite`, `/500`.
Authenticated shell (`src/components/app/AuthenticatedAppShell.tsx`): `/dashboard`, `/commitments`, `/fabric`, `/fabric/transparency`, `/finance/*`, `/settings`, NotFound fallback.

## Layering (web)
UI (src/features/*, src/components/*) → hooks (src/hooks, hooks/queries) → contexts (Auth, Anchor, Finance, Task, Notification, Fabric) → API adapters (src/api/*Api.ts) → secureDb gateway (src/utils/secureDb.ts) → Firebase (Firestore/Storage/Auth/FCM) → Functions (callables + triggers + schedulers) → Firestore/Storage with rules.

## Persistence & backend
- Firestore: artifacts/{appId}/users/{uid}/… pattern observed in seeder; family_v2 migration framework exists; indexes catalog in config/firestore.indexes.json; rules in config/firestore.rules.
- Storage: account artwork etc. via accountArtworkStorage; rules in config/storage.rules.
- Functions: ~50 modules — auth/passkey/MFA/session, family v2, finance (recurring, reminders pipeline, bank link via Mono + webhooks), fabric nudges, notifications, infra (rate limit, quota, audit, tracing, health, warmUp, migrations).
- Emails: emailQueue/emailChangeSync/invitationEmailBuilder.

## Security boundaries
- Client: AuthGate routing guard, FinanceContext permission helpers, finance/utils/permissions.ts, device attestation client service.
- Server: Firestore/Storage rules (authoritative), callable-level rate limits, callableContracts validation, server-side ownership checks (to be verified per-domain in deep audits).

## Test architecture
- vitest (config/vitest.config.ts) — unit/integration; separate vitest.rules.config.ts for emulator rules suites; functions/vitest.config.ts.
- Playwright (config/playwright.config.ts) with visual snapshots; fixtures/base+seed+test-data.
- Mutation testing (stryker), Lighthouse CI, rules-coverage/index-catalog/index-usage checkers under tools/ci.

## CI/CD
- GitHub workflows (18 files), husky pre-commit, commitlint, environment deploy pipeline scripts/DEPLOY_PIPELINE.sh (dev/staging/prod), versioning via commit-and-tag-version.
