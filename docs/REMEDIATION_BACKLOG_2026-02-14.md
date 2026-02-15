# Anchor OS — Remediation Backlog (P0/P1/P2)

Date: 2026-02-14  
Source of truth: [VERIFIED_CODEBASE_AUDIT_2026-02-14.md](VERIFIED_CODEBASE_AUDIT_2026-02-14.md)

## Execution rules
- Create one GitHub `Initiative` issue per item below using [.github/ISSUE_TEMPLATE/initiative.md](../.github/ISSUE_TEMPLATE/initiative.md).
- Ship `P0` first, then `P1`, then `P2`.
- Do not start `P1` until all `P0` items have owners and rollout/rollback plans.

## Canonical ID map (pre-numbered, deduplicated)

These IDs are now reserved in dashboard roadmap/intake. Use these IDs in GitHub issues, branch names, commits, and deploy notes.

| Backlog Ref | Canonical ID | Status | Notes |
|---|---|---|---|
| REM-001 | GAP-005 | New | Created via intake |
| REM-002 | GAP-006 | New | Created via intake |
| REM-003 | GAP-007 | New | Created via intake |
| REM-004 | PWA-001 | Existing | Reuse existing roadmap item (no duplicate) |
| REM-005 | QA-003 | Existing | Reuse existing roadmap item (no duplicate) |
| REM-006 | QA-001 | Existing | Reuse existing roadmap item (no duplicate) |
| REM-007 | FIN-011 | New | Created via intake |
| REM-008 | DATA-001 | Existing | Reuse existing roadmap item (no duplicate) |
| REM-009 | UX-035 | New | Created via intake |
| REM-010 | GAP-010 | New | Created via intake |
| REM-011 | GAP-008 | New | Created via intake |
| REM-012 | GAP-009 | New | Created via intake |

## Tracking semantics (important)

To ensure items show up correctly in Dashboard Kanban, environment parity, and git timeline:

- Use dashboard-recognized IDs in commit messages (examples: `BUG-###`, `FEATURE-###`/`FEAT-###`, `GAP-###`, `UX-###`, `REG-###`).
- Keep conventional commit prefixes (`fix:`, `feat:`, `refactor:`) and include the ID in the title/body.
- Prefer one primary work ID per PR/merge commit to avoid mixed classification.
- For high-risk remediation, map IDs to `GAP-###` (architecture/process gap closure) unless it is an actual production defect (`BUG-###`).

### Recommended type mapping for this backlog

| Backlog Item | Recommended Dashboard Type | Why |
|---|---|---|
| REM-001, REM-002, REM-005, REM-006, REM-010, REM-012 | GAP | Engineering/system hardening and governance closure |
| REM-003 | GAP | Process/ownership enforcement gap |
| REM-004, REM-009 | UX | User-facing quality and error-state UX |
| REM-007, REM-008 | FEATURE | New platform capabilities (progressive delivery + analytics contract) |
| REM-011 | GAP | Design-system consistency gap closure |

### ID creation workflow

1. Use `get_next_id(type)` from dashboard MCP (`bug|feature|gap|ux|reg`).
2. Create issue title/body using that ID (e.g., `GAP-041`).
3. Include same ID in branch name and commit subject.
4. Keep that ID in deploy commit message so environment parity can trace it.

## Priority board

| Priority | ID | Initiative | Owner | ETA | Risk |
|---|---|---|---|---|---|
| P0 | GAP-005 | Enforce strict TypeScript safety (`no-explicit-any`) | Eng Platform | 0.5d | B |
| P0 | GAP-006 | Raise test coverage thresholds to policy baseline | Eng Platform | 0.5d | B |
| P0 | GAP-007 | Add `CODEOWNERS` and review accountability | Eng Mgmt | 0.25d | C |
| P0 | PWA-001 | Add PNG PWA icons (192/512 + maskable) | Product Eng | 0.5d | C |
| P0 | QA-003 | Tighten Lighthouse assertions from warn→error (core paths) | Eng Platform | 0.5d | B |
| P1 | QA-001 | Expand mutation testing scope to hooks/utils | QA/Platform | 1.5d | B |
| P1 | FIN-011 | Add formal feature flag and progressive rollout framework | Platform + Product | 3d | A |
| P1 | DATA-001 | Add product analytics contract (events + funnels + guardrails) | Product + Data | 3d | A |
| P1 | UX-035 | Add dedicated 404/500 route-level error views | Product Eng | 1d | C |
| P2 | GAP-010 | Rationalize direct Firestore imports behind service boundaries | Architecture | 4d | A |
| P2 | GAP-008 | Deprecate legacy `anchor.*` color token block safely | Design System | 1d | B |
| P2 | GAP-009 | Validate Checkmarx secret/config health and keep/remove workflow | DevOps | 0.5d | B |

---

## Initiative-ready issue blocks (copy/paste)

### REM-001 — Enforce strict TypeScript safety
- Initiative owner: Eng Platform
- Engineering owner: TBD
- Product owner: N/A
- In scope: Set `@typescript-eslint/no-explicit-any` to `error`; fix any resulting violations.
- Out of scope: Large refactors unrelated to `any` usage.
- Risk class: B
- Success metric: CI blocks all new `any` usage.
- Guardrail metrics: Lint pass rate; build pass rate; PR lead time.
- SLO impact: Improves defect prevention on core flows.
- Rollout plan: Apply on staging branch first, then master after green CI.
- Rollback plan: Revert ESLint rule change if CI deadlocks release path.
- Observability plan: Track lint failures per PR for 2 weeks.
- Test strategy: Lint + existing unit/e2e pipeline.
- Exit criteria: Rule set to `error` and merged with green CI.

### REM-002 — Raise coverage thresholds
- Initiative owner: Eng Platform
- Engineering owner: TBD
- Product owner: N/A
- In scope: Raise Vitest thresholds to 80/80/80/80 or approved staged target.
- Out of scope: Non-critical broad test rewrites in first pass.
- Risk class: B
- Success metric: CI enforces approved coverage baseline.
- Guardrail metrics: Flaky test rate; pipeline duration.
- SLO impact: Better branch-path reliability for financial logic.
- Rollout plan: Stage thresholds in 2 steps if needed (`branches` first).
- Rollback plan: Temporarily relax only one threshold with documented expiry date.
- Observability plan: Weekly coverage trend report.
- Test strategy: `npm run test:coverage` in CI gate.
- Exit criteria: Thresholds updated and stable for 1 week.

### REM-003 — Add CODEOWNERS
- Initiative owner: Eng Mgmt
- Engineering owner: TBD
- Product owner: N/A
- In scope: Create `.github/CODEOWNERS` for `src`, `functions`, `config`, `docs`, `tools`.
- Out of scope: Team/org redesign.
- Risk class: C
- Success metric: All PRs request at least one owner reviewer automatically.
- Guardrail metrics: Review turnaround time.
- SLO impact: Faster and safer ownership decisions.
- Rollout plan: Land file + monitor reviewer routing.
- Rollback plan: Narrow patterns if routing is too broad.
- Observability plan: PR reviewer assignment accuracy.
- Test strategy: Open test PR and verify auto-requested reviewers.
- Exit criteria: Auto-review ownership works on all major paths.

### REM-004 — PWA icon hardening
- Initiative owner: Product Eng
- Engineering owner: TBD
- Product owner: TBD
- In scope: Add PNG icons and update manifest references.
- Out of scope: Full brand redesign.
- Risk class: C
- Success metric: Install prompt/home-screen icons render correctly on iOS/Android.
- Guardrail metrics: Lighthouse PWA score; manifest validity.
- SLO impact: None directly; improves install UX consistency.
- Rollout plan: Update assets in one release.
- Rollback plan: Revert manifest/icon set if install regressions appear.
- Observability plan: Track install errors/support reports.
- Test strategy: Manual install check on iOS + Android + Lighthouse.
- Exit criteria: PNG icon set live and verified.

### REM-005 — Lighthouse gating hardening
- Initiative owner: Eng Platform
- Engineering owner: TBD
- Product owner: N/A
- In scope: Promote key vitals assertions from `warn` to `error`.
- Out of scope: Broad perf rewrite.
- Risk class: B
- Success metric: CI fails on severe perf regressions.
- Guardrail metrics: Build time; false-positive rate.
- SLO impact: Improves user-perceived performance reliability.
- Rollout plan: Start with FCP/LCP/TBT on primary routes.
- Rollback plan: Restore one metric to warn with expiry ticket.
- Observability plan: Lighthouse trend by commit.
- Test strategy: Existing LHCI workflow.
- Exit criteria: New error-level assertions stable for 1 week.

### REM-006 — Mutation scope expansion
- Initiative owner: QA/Platform
- Engineering owner: TBD
- Product owner: N/A
- In scope: Add `src/hooks/**/*.ts` and selected `src/utils/**/*.ts` to Stryker mutate list.
- Out of scope: Full-repo mutation in one pass.
- Risk class: B
- Success metric: Mutation score coverage extends beyond services.
- Guardrail metrics: CI runtime; flake rate.
- SLO impact: Better defect detection in business logic.
- Rollout plan: Incremental folder onboarding.
- Rollback plan: Drop the noisiest paths and re-stage.
- Observability plan: Mutation score trend.
- Test strategy: `npm run test:mutation` and dry-run checks.
- Exit criteria: Hooks/utils included with acceptable runtime.

### REM-007 — Feature flag + progressive rollout system
- Initiative owner: Platform
- Engineering owner: TBD
- Product owner: TBD
- In scope: Runtime flag registry, kill switches, staged rollout policy.
- Out of scope: Paid vendor migration unless justified.
- Risk class: A
- Success metric: 100% of high-risk launches ship behind kill-switchable flags.
- Guardrail metrics: Incident count post-release; rollback time.
- SLO impact: Reduces production incident blast radius.
- Rollout plan: Internal-only flag first, then risky features.
- Rollback plan: Global flag disable + targeted revert path.
- Observability plan: Flag state telemetry and exposure logs.
- Test strategy: Unit tests for gate logic + e2e for flag on/off paths.
- Exit criteria: At least one high-risk feature successfully staged via flags.

### REM-008 — Product analytics contract
- Initiative owner: Product
- Engineering owner: TBD
- Product owner: TBD
- In scope: Event taxonomy, funnel definitions, metric owners, guardrails.
- Out of scope: Vanity dashboard expansion.
- Risk class: A
- Success metric: 100% critical journeys instrumented with owner-approved events.
- Guardrail metrics: Event drop rate; schema drift rate.
- SLO impact: Faster detection of UX regressions.
- Rollout plan: Start with Auth/Onboarding/Finance journey events.
- Rollback plan: Disable noisy events and revert schema change.
- Observability plan: Event validation + analytics QA dashboard.
- Test strategy: Contract tests for event payload schema.
- Exit criteria: Weekly product review powered by agreed metrics.

### REM-009 — Route-level error pages
- Initiative owner: Product Eng
- Engineering owner: TBD
- Product owner: TBD
- In scope: Add explicit `NotFoundView` and `ServerErrorView` routes.
- Out of scope: Full visual redesign.
- Risk class: C
- Success metric: Invalid routes no longer redirect ambiguously.
- Guardrail metrics: Error route bounce rate.
- SLO impact: Better failure-state UX.
- Rollout plan: Add routes and navigation fallbacks.
- Rollback plan: Revert route config if unexpected navigation regressions occur.
- Observability plan: Track 404/500 route hits.
- Test strategy: Unit route tests + e2e invalid-route flow.
- Exit criteria: 404/500 behavior verified in e2e.

### REM-010 — Firestore boundary refactor
- Initiative owner: Architecture
- Engineering owner: TBD
- Product owner: N/A
- In scope: Reduce direct `firebase/firestore` imports in feature/hooks through service boundaries.
- Out of scope: Full backend rewrite.
- Risk class: A
- Success metric: Direct Firestore imports in feature/hooks reduced by target percentage.
- Guardrail metrics: Regression bug count; test runtime.
- SLO impact: Improves reliability and maintainability.
- Rollout plan: Refactor by module (finance → settings → shared).
- Rollback plan: Module-level revert if regressions found.
- Observability plan: Track import count in CI check.
- Test strategy: Existing unit/integration/e2e suite + targeted contract tests.
- Exit criteria: Architectural boundary policy enforced by CI rule.

### REM-011 — Remove legacy anchor color tokens
- Initiative owner: Design System
- Engineering owner: TBD
- Product owner: TBD
- In scope: Replace legacy `anchor.*` token usage and remove config block.
- Out of scope: New theme palette.
- Risk class: B
- Success metric: Zero runtime usage of `anchor.*` tokens.
- Guardrail metrics: Visual regression diffs; accessibility contrast.
- SLO impact: None direct; reduces design drift risk.
- Rollout plan: migrate usages, run visual tests, then remove tokens.
- Rollback plan: restore token block temporarily if regressions detected.
- Observability plan: visual regression report.
- Test strategy: visual snapshots + smoke.
- Exit criteria: token block removed with no visual regressions.

### REM-012 — Checkmarx workflow health decision
- Initiative owner: DevOps
- Engineering owner: TBD
- Product owner: N/A
- In scope: verify secrets, workflow status, and decide keep/tune/remove.
- Out of scope: full security program redesign.
- Risk class: B
- Success metric: Checkmarx pipeline is intentionally green or intentionally retired.
- Guardrail metrics: scan runtime; false-positive burden.
- SLO impact: security posture confidence.
- Rollout plan: verify in staging branch workflow runs.
- Rollback plan: disable workflow if misconfigured/noisy until fixed.
- Observability plan: monitor scan success rate weekly.
- Test strategy: trigger controlled PR and inspect security checks.
- Exit criteria: explicit go-forward decision documented.

---

## Suggested sequencing (2-week sprint)
- Week 1: REM-001, REM-002, REM-003, REM-004, REM-005
- Week 2: REM-006, REM-009, REM-012
- Next cycle (after stability): REM-007, REM-008, REM-010, REM-011
