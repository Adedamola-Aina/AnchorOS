# AnchorOS Architecture

Durable architecture contract. Executable behavior lives in code, tests, and workflows — this document explains the WHY and the stable boundaries. Detailed schemas: [FIRESTORE_SCHEMA.md](FIRESTORE_SCHEMA.md).

## One product implementation

AnchorOS is a privacy-first household finance and commitment platform. **React 19 + TypeScript (strict) is the sole canonical product implementation**, shipped as a Web/PWA bundle via Vite and wrapped by Capacitor for iOS/Android shells. Native Swift/Kotlin exists only for OS integration, Capacitor bridges/plugins, generated shell code, platform lifecycle, and permissions — never product/business logic. Do not reintroduce parallel implementations (the former native SwiftUI path is retired; see git history).

## System boundaries

```
React 19 / TS app (src/)  ──HTTPS──►  Firebase
  ├─ src/features/*        vertical slices: auth, finance, commitments,
  │                        family, dashboard, onboarding, settings, fabric
  ├─ src/services/fabric   Anchor AI query engine (QueryEngine + query routes)
  ├─ src/utils/secureDb.ts THE only client→Firestore access path
  └─ public/sw.js          PWA service worker (cache + background messaging)

Firebase
  ├─ Auth                  TOTP MFA, passkeys, custom claims
  ├─ Firestore             multi-tenant household data (see FIRESTORE_SCHEMA.md)
  ├─ Cloud Functions v2    all privileged operations (functions/src/*)
  ├─ Security Rules        config/firestore.rules, config/storage.rules
  └─ Hosting               staging + production web artifacts
```

## Security architecture

- All privileged mutations go through callable Cloud Functions with staged App Check enforcement (`ENFORCE_APPCHECK`).
- Family sharing is isolation-critical: household membership, roles (read-only / read-write), and per-account sharing are enforced server-side in rules and functions, never in the client alone.
- Authentication, financial integrity, and shared-data isolation are the highest-risk surfaces. See [SECURITY.md](SECURITY.md) for the model.

## Anchor AI (Fabric)

The Fabric query engine (`src/services/fabric/`) is the single sanctioned AI-assistance surface: deterministic query routes, typed results, no free-form data export. Coverage of the query engine is CI-gated (`test:coverage:query-gate`).

## Decisions

Durable architectural decisions are recorded as ADRs in [`adr/`](adr/). When code and documentation disagree, follow the source-of-truth rule in [`../AGENTS.md`](../AGENTS.md).
