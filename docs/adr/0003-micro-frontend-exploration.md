# 0003. Micro-Frontend Exploration (ARCH-020)

Date: 2026-04-10
Status: Accepted

## Context

Anchor OS is currently a single React SPA built with Vite. The roadmap item `ARCH-020` asks us to evaluate micro-frontends and module federation for independent deployability.

We need to balance deploy independence with constraints that are already critical in this codebase:

1. Shared auth/session state and route guards.
2. Shared providers (`Auth`, `Finance`, `Task`, `Fabric`, notifications).
3. Strict reliability for mobile shells (Capacitor iOS/Android).
4. High operational safety for finance/security features.

The question is not "can module federation work?" but "is it the right migration now for this product shape?"

## Decision

Use a **modular monolith with deployable boundaries first**, and defer full runtime module federation until boundary quality and release pressure justify it.

What we adopt now:

1. Keep one deployable app shell for production.
2. Enforce stronger module boundaries by domain (`features/*`, `services/*`, `hooks/*`) and shared contracts.
3. Continue route-level code splitting and explicit chunk strategy in Vite.
4. Split Cloud Functions and API contracts by domain versioning where independent backend release is needed.
5. Prepare federation-compatible seams (stable route contracts + typed public interfaces), but do not ship runtime remotes yet.

What we defer:

1. Runtime `remoteEntry` loading in production.
2. Cross-repo independent frontend deployments per feature domain.

## Option Analysis

### Option A: Full runtime module federation now

Pros:
- True independent frontend deploys per domain.
- Team-level autonomy at runtime boundary.

Cons:
- Higher runtime failure surface (remote unavailability/version mismatch).
- Extra complexity in auth/provider synchronization and shared dependency pinning.
- More difficult mobile shell QA and offline behavior guarantees.

### Option B: Modular monolith + federation-ready seams (selected)

Pros:
- Low runtime risk with immediate architecture gains.
- Keeps a single reliability envelope for mobile and finance-critical UX.
- Enables later federation with less churn.

Cons:
- Not fully independent frontend deploys yet.
- Requires disciplined boundary governance.

### Option C: Stay as-is

Pros:
- No migration work.

Cons:
- Boundary drift risk grows.
- Future federation cost becomes larger and less predictable.

## Consequences

Positive:

1. Preserves current reliability while improving architecture clarity.
2. Creates a measurable path to federation if and when needed.
3. Avoids introducing remote-runtime outages into core user journeys.

Negative:

1. Some teams still coordinate through a shared frontend release train.
2. Boundary enforcement work is required to avoid backsliding.

## Execution Plan

Phase 1 (now):

1. Treat domain surfaces as public APIs (typed exports + no deep cross-imports).
2. Track route chunk size and shared dependency drift.
3. Keep commit-level tagging for architecture boundary work.

Phase 2 (when trigger conditions are met):

1. Pilot one low-risk remote (for example, settings subdomain) behind a flag.
2. Add fallback loading and remote health telemetry.
3. Validate no regression in mobile shell and offline behaviors.

## Trigger Conditions For Reopening Federation

Re-evaluate runtime federation when at least two are true for 2+ sprints:

1. Multiple teams need same-day independent frontend releases.
2. Shared app release train blocks priority work repeatedly.
3. Domain boundaries remain stable with low cross-import violations.
4. Mobile + web observability can detect remote load failures quickly.
