# SwiftUI Application Retirement — 2026-09

## Architecture decision

**React + TypeScript is the sole canonical AnchorOS product implementation.**

```
React + TypeScript
     │
     ├── Web/PWA
     └── Capacitor
           ├── iOS   (ios/ — Capacitor shell)
           └── Android (android/ — Capacitor shell)
```

The parallel SwiftUI application at `apps/ios-native/` (247 files, XcodeGen
project `AnchorOSNative`, independent SwiftUI auth/Fabric/Finance/Family/
Settings implementations) is retired. Duplicate implementations are not
maintained regardless of prior investment. Git history is the archive; no
in-repo archive directory was created.

## Capability salvage audit

The SwiftUI app duplicated the canonical product across all core surfaces.
Classification per capability:

| Capability | Classification |
|---|---|
| Auth (email, Google, Apple sign-in) | DUPLICATE (React `src/features/auth`) |
| Signup / signin flows | DUPLICATE |
| Passkeys | DUPLICATE (React WebAuthn/PasskeyManager surfaces) |
| MFA / recovery codes | DUPLICATE (`mfaRecovery` callable used by `src/api/MfaRecoveryApi.ts`) |
| Session management / timeout | DUPLICATE |
| Biometrics / app lock | DUPLICATE (Capacitor NativeBiometric path) |
| Onboarding | DUPLICATE |
| Dashboard | DUPLICATE (incl. Swift-only BeyondBasics/Productivity calculators — UI-only variants) |
| Commitments / tasks | DUPLICATE (incl. offline mutation queue — mirrors `useFinanceOfflineSync`/`useCommitmentOfflineSync`) |
| Finance / net worth | DUPLICATE |
| Bank linking (Mono) | DUPLICATE — web handoff per ADR-0004; PWA embeds Mono directly |
| Family sharing / invites | DUPLICATE |
| Fabric / Anchor AI (query engine, predictions, briefing, weekly report, streak) | DUPLICATE (client mirror of canonical `src/services/fabric`) |
| Settings / notifications / deep links | DUPLICATE |
| App Check / device attestation | DUPLICATE (`deviceAttestation` callable used by `src/services/deviceAttestation.ts`) |
| Telemetry (Crashlytics/Analytics/Performance wrappers) | DUPLICATE |
| Swift-only UI polish, animation, micro-interactions, snapshot matrix CSVs | NATIVE_ONLY_NOT_REQUIRED |
| Native widgets, Live Activities, watchOS, Home-Screen integrations | NATIVE_ONLY_FOLLOW_UP (none shipped; candidates only) |

### Native-only follow-up candidates

None shipped. If desired later, these are candidates to rebuild in the
canonical architecture (Capacitor plugin or web implementation):

- Native iOS home-screen widget / Live Activity surfaces (never shipped in SwiftUI app either)
- Native push "refresh nudge" quick actions (web equivalent: FCM notification actions)

### Shared backend dependencies deliberately retained

All Firebase infrastructure consumed by the Swift client remains — React,
Capacitor and other backend paths use it (verified by usage search):

- Callables: `fabricNudges` family (`fabricStreakNudge`/`fabricBudgetNudge`/`fabricSurplusNudge`), `weeklyReport`, `mfaRecovery`, `feedback`, `deleteAccount`, `deviceAttestation`, `authAlertDetection` (used internally by `authEvents`)
- Firestore collections, Storage paths, auth/passkey/family/finance functions
- Notification (FCM `fcmTokens`) and bank/Mono infrastructure
- No backend code was deleted; this was not a backend dead-code pass.

### Deletion blockers

None. Nothing in the canonical React/Capacitor product depended on
`apps/ios-native`.

## Removed

- `apps/ios-native/**` — entire SwiftUI application (Swift sources, views, services, duplicate Fabric/Finance/Auth implementations, unit + XCUITest suites, snapshot harness, `project.yml` (XcodeGen), resources, App Store CI `ci_scripts/`, README)
- `.github/workflows/ios-native.yml` — SwiftUI build/test workflow
- `scripts/ios-native-sync.sh` — XcodeGen sync script
- Root `package.json` scripts `ios:sync` and `ios:open` (SwiftUI-specific; Capacitor `cap:*` scripts retained)
- `.github/dependabot.yml` swift ecosystem entry for `/apps/ios-native`
- Parity-program documentation: `docs/NATIVE_PARITY_AUDIT.md`, `docs/PARITY_FUNCTIONAL_MATRIX.csv`, `docs/PARITY_INTERACTION_MATRIX.csv`, `docs/PARITY_MICROINTERACTION_MATRIX.csv`
- ADRs written solely for SwiftUI-vs-PWA parity decisions: `docs/adr/0004-native-bank-link-handoff.md`, `docs/adr/0005-native-iphone-only-auth-layout.md`
- Stale engineering-console references in `tools/dashboard/server/` (`gitAnalyzer/classification.js`, `workIntelligence.js`, `envCheckerCore.js`) classifying `apps/ios-native/` as active product source

## Canonical mobile architecture after retirement

One product implementation (React + TypeScript) is bundled by Capacitor
(`webDir: dist`) into the `ios/` and `android/` shells. Native Swift/Kotlin
exists only as generated Capacitor shell code, plugin bridges, OS integration,
platform lifecycle and permissions. Product/business logic stays in
TypeScript unless a future explicit architecture decision says otherwise.
