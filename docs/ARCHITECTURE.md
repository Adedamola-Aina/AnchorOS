# AnchorOS Architecture

Durable architecture contract. Executable behavior lives in code, tests, and workflows — this document explains the WHY and the stable boundaries. Data contracts: [DATA_MODEL.md](DATA_MODEL.md); product semantics: [PRODUCT.md](PRODUCT.md).

## One product implementation

AnchorOS is a privacy-first household finance and commitment platform. **React 19 + TypeScript (strict) is the sole canonical product implementation**, shipped as a web app / installable PWA bundle via Vite. There are no native wrappers — product/business logic lives entirely in TypeScript. Do not reintroduce parallel implementations (the former native SwiftUI path is retired; see git history).

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
  ├─ Firestore             multi-tenant household data (see DATA_MODEL.md)
  ├─ Cloud Functions v2    all privileged operations (functions/src/*)
  ├─ Security Rules        config/firestore.rules, config/storage.rules
  └─ Hosting               staging + production web artifacts
```

## Security architecture

- All privileged mutations go through callable Cloud Functions with staged App Check enforcement (`ENFORCE_APPCHECK`).
- Family sharing is isolation-critical: household membership, roles (read-only / read-write), and per-account sharing are enforced server-side in rules and functions, never in the client alone.
- Authentication, financial integrity, and shared-data isolation are the highest-risk surfaces. The security model is summarized below and enforced in `config/firestore.rules`.

## Anchor AI (Fabric)

The Fabric query engine (`src/services/fabric/`) is the single sanctioned AI-assistance surface: deterministic query routes, typed results, no free-form data export.

## Durable decisions

Architectural decisions live here (there is no separate ADR directory). When code and documentation disagree, follow the source-of-truth rule in [`../AGENTS.md`](../AGENTS.md).

- **Shared UI package (`@anchor-os/ui`).** Core atoms (Button, Badge, Card, Skeleton) live in `packages/ui` and are imported as `@anchor-os/ui`, so shared vs. feature-specific components are explicit and a future npm extraction needs no import changes.
- **Anchor AI (Fabric).** A privacy-first, feature-agnostic intelligence layer under `src/services/fabric/` (it must not import from `src/features/`): typed deterministic query routes, an `anchor_ai_enabled` flag plus a per-user Settings toggle backed by `fabric_settings`, recency-weighted confidence, and a two-tier store (`recentActions` rolling 100 entries with 90-day TTL, `confirmedPatterns` until explicitly deleted). No external AI API calls; all DB access via `src/utils/secureDb.ts`.
- **No micro-frontends.** A micro-frontend split was explored and rejected: one Vite SPA is simpler and the app is not large enough to justify the runtime cost.

## Error handling rules

- **Fail gracefully**: never white screens or lost data; always a recovery path.
- **Categories** (each with a defined pattern): network (auto-retry with backoff), permission (explain and guide to grant), validation (specific, field-level fix), authentication (re-authenticate flow), application (error boundary + log).
- **Error boundaries** wrap route-level trees so features fail independently.
- **User-facing messages** are non-technical and actionable; technical detail goes to logs only.
- **Logging**: all errors logged (Sentry in production); secrets and PII never logged (PII scrubber before send).

## Security architecture (summary)

- **Principles**: zero trust, defense in depth, least privilege, explicit permissions (deny by default), audit everything sensitive.
- **Layers**: network (HTTPS, no direct DB access) → application (Firebase Auth + optional TOTP MFA, input validation, output sanitization) → data (Firestore rules, permission-based sharing, field validation, audit trails, encryption at rest/in transit) → infrastructure (isolated runner, minimal surface, Firebase monitoring).
- **Authorization model**: owner-based rules; family access exclusively via explicit share predicates and permission levels (read / transact / manage); App Check enforced on callables.
- **Threat priorities**: credential theft, financial-data exfiltration, malicious-family-member escalation, compromised devices (MFA, session handling), privilege escalation (rules).

## Testing philosophy

Risk-based, not ceremony-based (see AGENTS.md). Suites: Vitest unit/integration (colocated) and Firestore/storage rules emulator tests. `.github/workflows/ci.yml` runs lint, typecheck, unit tests and a production build.
