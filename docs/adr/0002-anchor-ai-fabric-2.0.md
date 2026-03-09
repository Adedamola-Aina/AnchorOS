# 0002. Anchor AI (Fabric 2.0) Foundation

Date: 2026-03-09
Status: Accepted

## Context

Anchor OS is evolving from a static feature set into a cross-cutting intelligence layer called Anchor AI (code name: fabric). Existing Fabric v1.5 behavior is limited to keyword-based suggestion toasts and does not support cross-feature insights, conversational queries, or progressive learning.

We need a privacy-first architecture that can learn from commitments and finance activity, remain non-blocking in UX, and be explicitly user-controlled. We also need a staged rollout that ships visible value early while keeping risk low.

## Decision

Anchor AI foundation is implemented in two steps:

1. Slice 1a (gating):
- Add fabric type definitions (`src/types/fabric.ts`, `src/types/fabricPrediction.ts`).
- Add `anchor_ai_enabled` feature flag.
- Add user-facing Settings toggle backed by Firestore `fabric_settings` document.
- Add Firestore security rules for `fabric_*` user documents.

2. Slice 1b (foundation + first visible value):
- Introduce FabricService, BehavioralEngine, AmbientContext, FabricContext, and `useFabric` hook.
- Add Anchor AI tab with guided prompt chips and cold-start UX.
- Add transparency screen: "What Anchor AI Knows".
- Use history seeding for existing users so cold-start only applies to truly new users.

Architectural constraints:
- Feature-agnostic core (`src/services/fabric/` must not import from `src/features/`).
- All DB access through `src/utils/secureDb.ts`.
- No external AI API calls for v2.0.
- Non-blocking, dismissible UX.
- Two-layer gating: global feature flag + per-user Settings toggle.

Learning model constraints:
- Recency-weighted confidence scoring.
- Two-tier storage:
  - `recentActions`: rolling 100 entries with 90-day TTL.
  - `confirmedPatterns`: persistent until explicit user deletion.

## Consequences

Positive:
- Ships quickly with explicit user consent and clear privacy boundaries.
- Preserves mobile performance by avoiding external API dependency.
- Enables future conversational and predictive features without reworking core contracts.
- Improves trust via transparency and per-pattern deletion controls.

Negative:
- Additional complexity in navigation/state due to conditional tab rendering.
- Temporary coexistence with legacy v1.5 code paths until full retirement cleanup.
- More integration tests needed for tab permutations and Firestore security rules.
