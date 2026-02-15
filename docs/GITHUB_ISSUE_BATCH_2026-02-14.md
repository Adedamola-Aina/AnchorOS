# Anchor OS — GitHub Issue Batch (Ready to Paste)

Date: 2026-02-14  
Template alignment: `.github/ISSUE_TEMPLATE/initiative.md`

Usage:
1. Open **New issue** in GitHub.
2. Select **Initiative** template.
3. Copy the matching block below into the issue body.
4. Keep labels: `initiative`, `governance` (add `P0/P1/P2` manually).

## Canonical IDs (single source of truth)

Use these IDs exactly. Do not create new IDs for rows marked “Existing roadmap item”.

| Backlog Ref | Canonical ID | Action |
|---|---|---|
| REM-001 | GAP-005 | Create/update issue with this ID |
| REM-002 | GAP-006 | Create/update issue with this ID |
| REM-003 | GAP-007 | Create/update issue with this ID |
| REM-004 | PWA-001 | Existing roadmap item — update/attach, do not duplicate |
| REM-005 | QA-003 | Existing roadmap item — update/attach, do not duplicate |
| REM-006 | QA-001 | Existing roadmap item — update/attach, do not duplicate |
| REM-007 | FIN-011 | Create/update issue with this ID |
| REM-008 | DATA-001 | Existing roadmap item — update/attach, do not duplicate |
| REM-009 | UX-035 | Create/update issue with this ID |
| REM-010 | GAP-010 | Create/update issue with this ID |
| REM-011 | GAP-008 | Create/update issue with this ID |
| REM-012 | GAP-009 | Create/update issue with this ID |

---

## 1) REM-001 — Enforce strict TypeScript safety (`no-explicit-any`)

**Title**: `[Initiative] REM-001 Enforce strict TypeScript safety (no-explicit-any)`

```md
## Initiative summary
Set `@typescript-eslint/no-explicit-any` to `error` and fix current violations so CI blocks all future `any` regressions.

## Why now?
Type safety drift compounds quickly and silently. This is low effort with high prevention ROI.

## Owner (required)
- Initiative owner: Eng Platform
- Engineering owner: TBD
- Product owner: N/A

## Scope and non-goals (required)
- In scope: ESLint rule change, violation remediation, CI pass.
- Out of scope: broad type refactors unrelated to `any`.

## Risk class (required)
B

## Success metric (required)
0 new `any` usage allowed by CI.

## Guardrail metrics (required)
- Lint pass rate
- Build pass rate
- PR lead time

## SLO impact (required)
Improves reliability by preventing type-related production defects.

## Rollout plan (required)
Apply on staging branch; merge to master once CI is green.

## Rollback plan (required)
Revert rule to previous state only if critical delivery is blocked; create follow-up with expiry date.

## Observability plan (required)
Track lint failures per PR for two weeks.

## Test strategy (required)
`npm run lint` + full CI suite.

## Dependencies and sequencing
None.

## Exit criteria (required)
Rule is `error`, all CI green, no open `any` debt.
```

---

## 2) REM-002 — Raise coverage thresholds to baseline

**Title**: `[Initiative] REM-002 Raise coverage thresholds to baseline` 

```md
## Initiative summary
Raise Vitest thresholds to policy baseline and close resulting test gaps.

## Why now?
Current branch threshold is below desired quality bar, allowing untested paths through CI.

## Owner (required)
- Initiative owner: Eng Platform
- Engineering owner: TBD
- Product owner: N/A

## Scope and non-goals (required)
- In scope: threshold update and minimum test additions required for green CI.
- Out of scope: full test architecture redesign.

## Risk class (required)
B

## Success metric (required)
Coverage thresholds enforced at approved baseline on CI.

## Guardrail metrics (required)
- Pipeline duration
- Flaky test rate
- PR merge latency

## SLO impact (required)
Improves defect prevention in branch/error path logic.

## Rollout plan (required)
Increase thresholds in staged increments if needed (branches first).

## Rollback plan (required)
Temporarily lower only one metric with explicit expiry and owner.

## Observability plan (required)
Weekly coverage trend snapshot.

## Test strategy (required)
`npm run test:coverage` + targeted new tests.

## Dependencies and sequencing
Coordinate with REM-001 for rule stability.

## Exit criteria (required)
Thresholds updated and stable for one week.
```

---

## 3) REM-003 — Add CODEOWNERS

**Title**: `[Initiative] REM-003 Add CODEOWNERS and review accountability`

```md
## Initiative summary
Create `.github/CODEOWNERS` mapping for core directories to enforce review ownership.

## Why now?
Ownership routing reduces review bottlenecks and increases change safety.

## Owner (required)
- Initiative owner: Eng Mgmt
- Engineering owner: TBD
- Product owner: N/A

## Scope and non-goals (required)
- In scope: ownership rules for `src`, `functions`, `config`, `docs`, `tools`.
- Out of scope: org/team restructuring.

## Risk class (required)
C

## Success metric (required)
100% of PRs auto-request at least one appropriate owner reviewer.

## Guardrail metrics (required)
- Review turnaround time
- Review reassignment rate

## SLO impact (required)
Improves incident prevention through domain review coverage.

## Rollout plan (required)
Add CODEOWNERS and validate with test PRs.

## Rollback plan (required)
Narrow path patterns if routing causes reviewer overload.

## Observability plan (required)
Track auto-request accuracy for one week.

## Test strategy (required)
Open test PR touching each path segment.

## Dependencies and sequencing
None.

## Exit criteria (required)
Auto-review ownership works for all major paths.
```

---

## 4) REM-004 — Add PNG PWA icons

**Title**: `[Initiative] REM-004 PWA icon hardening (PNG 192/512 + maskable)`

```md
## Initiative summary
Add PNG icon assets for PWA compatibility and update manifest references.

## Why now?
SVG-only icons can render inconsistently on mobile install surfaces.

## Owner (required)
- Initiative owner: Product Eng
- Engineering owner: TBD
- Product owner: TBD

## Scope and non-goals (required)
- In scope: generate 192x192 and 512x512 PNG icons (+ maskable), update manifest.
- Out of scope: visual redesign.

## Risk class (required)
C

## Success metric (required)
Installed app icons render correctly on Android and iOS test devices.

## Guardrail metrics (required)
- Lighthouse PWA score
- Manifest validity

## SLO impact (required)
No direct backend SLO impact; improves install UX quality.

## Rollout plan (required)
Single release with asset + manifest update.

## Rollback plan (required)
Revert manifest/icon changes if install regression appears.

## Observability plan (required)
Track install-related user feedback and PWA diagnostics.

## Test strategy (required)
Manual install verification + Lighthouse run.

## Dependencies and sequencing
None.

## Exit criteria (required)
PNG icon set merged and validated on target devices.
```

---

## 5) REM-005 — Tighten Lighthouse assertions

**Title**: `[Initiative] REM-005 Promote key Lighthouse checks to error`

```md
## Initiative summary
Promote critical web-vitals assertions from `warn` to `error` for primary user paths.

## Why now?
Performance regressions currently warn but do not block merge/deploy.

## Owner (required)
- Initiative owner: Eng Platform
- Engineering owner: TBD
- Product owner: N/A

## Scope and non-goals (required)
- In scope: FCP/LCP/TBT/category threshold hardening.
- Out of scope: large performance refactor.

## Risk class (required)
B

## Success metric (required)
CI fails on severe web-vitals regressions in core routes.

## Guardrail metrics (required)
- False-positive rate
- CI runtime
- Build success rate

## SLO impact (required)
Improves frontend responsiveness reliability.

## Rollout plan (required)
Harden one metric class at a time and monitor noise.

## Rollback plan (required)
Downgrade only problematic assertion with an expiry follow-up.

## Observability plan (required)
Track Lighthouse trend artifact per commit.

## Test strategy (required)
Existing `npm run lighthouse` CI step.

## Dependencies and sequencing
None.

## Exit criteria (required)
Selected assertions enforceable with stable CI for one week.
```

---

## 6) REM-006 — Expand mutation scope

**Title**: `[Initiative] REM-006 Expand mutation testing scope to hooks/utils`

```md
## Initiative summary
Extend Stryker mutate targets from services-only to selected hooks/utils paths.

## Why now?
Key business logic outside services currently escapes mutation-quality checks.

## Owner (required)
- Initiative owner: QA/Platform
- Engineering owner: TBD
- Product owner: N/A

## Scope and non-goals (required)
- In scope: add safe mutation targets incrementally.
- Out of scope: full-repo mutation in one pass.

## Risk class (required)
B

## Success metric (required)
Mutation coverage includes hooks/utils with acceptable runtime.

## Guardrail metrics (required)
- Mutation runtime
- CI queue time
- Flake rate

## SLO impact (required)
Improves confidence in edge-case behavior.

## Rollout plan (required)
Onboard directories in phases.

## Rollback plan (required)
Remove high-noise paths and re-stage.

## Observability plan (required)
Track mutation score trend + runtime trend.

## Test strategy (required)
`npm run test:mutation` and `test:mutation:dry`.

## Dependencies and sequencing
After REM-002 baseline stability.

## Exit criteria (required)
Hooks/utils included and CI remains healthy.
```

---

## 7) REM-007 — Feature flag + progressive rollout

**Title**: `[Initiative] REM-007 Build feature-flag and progressive rollout framework`

```md
## Initiative summary
Implement runtime flag registry, kill switches, and staged rollout policy for high-risk changes.

## Why now?
High-velocity delivery needs controlled blast radius and fast rollback.

## Owner (required)
- Initiative owner: Platform
- Engineering owner: TBD
- Product owner: TBD

## Scope and non-goals (required)
- In scope: flags, rollout stages, kill-switch mechanism, policy docs.
- Out of scope: vendor migration unless justified.

## Risk class (required)
A

## Success metric (required)
100% of risk A/B launches are flag-controlled with rollback path.

## Guardrail metrics (required)
- Post-release incident rate
- Mean rollback time
- Change failure rate

## SLO impact (required)
Reduces production incident impact and recovery time.

## Rollout plan (required)
Pilot in one high-risk feature, then standardize.

## Rollback plan (required)
Immediate flag disable + revert playbook for failed rollout.

## Observability plan (required)
Track flag exposure, cohort assignment, and guardrail alerts.

## Test strategy (required)
Unit tests for flag evaluation + e2e for on/off paths.

## Dependencies and sequencing
Should follow REM-001..REM-006 core hardening.

## Exit criteria (required)
At least one high-risk feature shipped via staged flag rollout.
```

---

## 8) REM-008 — Product analytics contract

**Title**: `[Initiative] REM-008 Define product analytics contract and KPI funnels`

```md
## Initiative summary
Define and enforce event taxonomy, critical funnels, and guardrail metrics for product learning.

## Why now?
Telemetry exists, but decision-grade product analytics contract is missing.

## Owner (required)
- Initiative owner: Product
- Engineering owner: TBD
- Product owner: TBD

## Scope and non-goals (required)
- In scope: event schema, ownership, funnel definitions, validation checks.
- Out of scope: vanity dashboard expansion.

## Risk class (required)
A

## Success metric (required)
Critical journeys (Auth, Onboarding, Finance) fully instrumented with approved schema.

## Guardrail metrics (required)
- Event drop rate
- Schema drift incidents
- Data latency

## SLO impact (required)
Faster detection of UX regressions and failed releases.

## Rollout plan (required)
Phase by journey: Auth → Onboarding → Finance.

## Rollback plan (required)
Disable or revert noisy events quickly while preserving core instrumentation.

## Observability plan (required)
Event QA dashboard + schema validation alerts.

## Test strategy (required)
Schema contract tests + integration checks.

## Dependencies and sequencing
Pairs well with REM-007.

## Exit criteria (required)
Weekly product review runs on agreed KPI set.
```

---

## 9) REM-009 — Route-level error pages

**Title**: `[Initiative] REM-009 Add dedicated 404/500 route-level error views`

```md
## Initiative summary
Implement explicit route-level `NotFound` and `ServerError` views.

## Why now?
Current wildcard behavior redirects and can hide navigation failures.

## Owner (required)
- Initiative owner: Product Eng
- Engineering owner: TBD
- Product owner: TBD

## Scope and non-goals (required)
- In scope: routes, views, and tests for invalid/failure paths.
- Out of scope: full design refresh.

## Risk class (required)
C

## Success metric (required)
Invalid routes display dedicated 404 page consistently.

## Guardrail metrics (required)
- Error-route bounce rate
- Navigation success rate

## SLO impact (required)
Improves user recovery from navigation failures.

## Rollout plan (required)
Add routes and verify with e2e.

## Rollback plan (required)
Revert route changes if navigation regressions appear.

## Observability plan (required)
Track 404/500 hits and top invalid paths.

## Test strategy (required)
Unit routing tests + e2e invalid-route case.

## Dependencies and sequencing
None.

## Exit criteria (required)
404/500 behavior tested and deployed.
```

---

## 10) REM-010 — Firestore boundary refactor

**Title**: `[Initiative] REM-010 Reduce direct Firestore imports behind service boundaries`

```md
## Initiative summary
Refactor feature/hook-level direct Firestore SDK usage into service/API boundaries.

## Why now?
Direct imports increase coupling and make policy enforcement/testing harder.

## Owner (required)
- Initiative owner: Architecture
- Engineering owner: TBD
- Product owner: N/A

## Scope and non-goals (required)
- In scope: modular refactor by domain with CI guardrail.
- Out of scope: backend platform rewrite.

## Risk class (required)
A

## Success metric (required)
Direct Firestore imports in feature/hooks reduced to agreed target.

## Guardrail metrics (required)
- Regression defects
- Test pass rate
- PR cycle time

## SLO impact (required)
Improves maintainability and reduces hidden data-path risk.

## Rollout plan (required)
Module-by-module migration (finance, settings, shared).

## Rollback plan (required)
Module-level rollback if behavior regresses.

## Observability plan (required)
Track import count via CI script over time.

## Test strategy (required)
Existing suite + targeted integration tests per migrated module.

## Dependencies and sequencing
Should start after P0/P1 stabilization.

## Exit criteria (required)
Import-boundary policy enforced and documented.
```

---

## 11) REM-011 — Remove legacy anchor color tokens

**Title**: `[Initiative] REM-011 Remove legacy anchor.* color token system`

```md
## Initiative summary
Deprecate `anchor.*` color tokens after migrating all active usages to semantic tokens.

## Why now?
Dual token systems create design drift and inconsistent UI decisions.

## Owner (required)
- Initiative owner: Design System
- Engineering owner: TBD
- Product owner: TBD

## Scope and non-goals (required)
- In scope: usage audit, migration, config cleanup.
- Out of scope: palette redesign.

## Risk class (required)
B

## Success metric (required)
0 runtime usage of `anchor.*` tokens in app code.

## Guardrail metrics (required)
- Visual regression diff count
- Contrast compliance

## SLO impact (required)
No direct backend SLO impact; reduces UI inconsistency risk.

## Rollout plan (required)
Audit → migrate → visual verify → remove token block.

## Rollback plan (required)
Restore token block temporarily if visual regressions occur.

## Observability plan (required)
Visual snapshot report + lint/search check.

## Test strategy (required)
Visual tests + smoke checks.

## Dependencies and sequencing
Can run in parallel with other P2 work.

## Exit criteria (required)
Legacy token block removed, no regressions.
```

---

## 12) REM-012 — Checkmarx workflow health decision

**Title**: `[Initiative] REM-012 Validate Checkmarx workflow health and decide keep/remove`

```md
## Initiative summary
Verify Checkmarx workflow credentials and value; keep/tune/remove intentionally.

## Why now?
Placeholder-style configuration without operational verification adds false confidence.

## Owner (required)
- Initiative owner: DevOps
- Engineering owner: TBD
- Product owner: N/A

## Scope and non-goals (required)
- In scope: secrets verification, trial run, decision record.
- Out of scope: full security program redesign.

## Risk class (required)
B

## Success metric (required)
Workflow is intentionally green and useful, or intentionally retired.

## Guardrail metrics (required)
- Scan success rate
- Runtime cost
- False-positive burden

## SLO impact (required)
Improves security signal reliability.

## Rollout plan (required)
Run on test PR, evaluate findings and maintenance burden.

## Rollback plan (required)
Disable workflow temporarily if misconfigured/noisy until corrected.

## Observability plan (required)
Track weekly scan status.

## Test strategy (required)
Controlled PR with known-safe changes and expected scan output.

## Dependencies and sequencing
None.

## Exit criteria (required)
Decision documented and workflow state aligned.
```
