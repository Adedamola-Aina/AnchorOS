# ADR-0005 — Native iOS Is iPhone-Only (No iPad Split Layout)

- Status: Accepted (2026-04-18)
- Deciders: Owner, Tech Lead, Product, Design
- Context: WS-9 of the Native Parity program (docs/NATIVE_PARITY_AUDIT.md §1)

## Context

The PWA auth page uses a split-pane layout on desktop (decorative left
panel + right form), collapsing to a single column on mobile. The native
SwiftUI `AuthView` ships only the single-column form.

Three options considered:

1. Port the split-pane layout to iPad with an adaptive `NavigationSplitView`.
2. Document native iOS as iPhone-first; leave iPad rendering as the
   single-column auth form on any size class.
3. Ship a full iPad-class UI across the whole app.

## Decision

Accept Option 2 — native iOS is iPhone-first. iPad installs render the
iPhone UI at its native aspect and size class; the split-pane auth
layout remains PWA-only.

## Rationale

- 75% of Anchor OS users are on phones; iPad traffic is < 1%.
- `TARGETED_DEVICE_FAMILY: "1,2"` stays because iPad users who install
  via App Store still get a functional app — they just don't get the
  PWA's desktop chrome.
- A true iPad UI would require a new set of snapshot baselines and
  XCUITest runs that aren't justified by the audience.

## Consequences

- docs/NATIVE_PARITY_AUDIT.md §1 no longer flags the auth layout as a
  gap — the scorecard reads `iPhone-only: accepted`.
- If iPad installs exceed 5% of MAU we revisit this ADR.
- Marketing and App Store screenshots target iPhone 15 Pro; iPad
  screenshots reuse the same renders at iPad aspect.
