# Anchor OS — Ship Gates

Date: 2026-02-14

This document defines mandatory gates so quality, learning, and reversibility are enforced by default.

## Gate 1: Pre-Work (before implementation)
Every feature/initiative must define:
- Risk class: A / B / C
- Success metric: one measurable outcome
- Guardrail metrics: up to three non-regression constraints
- Rollout plan: staged release path
- Rollback plan: explicit trigger + action

If any are missing, work is not ready.

## Gate 2: Merge (PR governance)
PRs must include and complete these sections:
- `Risk Class`
- `Linked Initiative Issue` (required for Risk Class A/B)
- `Success Metric`
- `Guardrail Metrics`
- `Rollout Plan`
- `Rollback Plan`
- `Observability`
- `Test-to-Risk Mapping`

Required checked checklist items:
- `I defined success + guardrail metrics`
- `I defined rollout + rollback plan`
- `I mapped tests to risk/failure modes`

CI enforces this automatically in `.github/workflows/ci-cd.yml` using the `PR Governance Gates` job.

Additional automated safeguard:
- PRs that reference roadmap IDs in title/body (for example, `GAP-005`) are blocked if those IDs are already `completed` or `deferred` in roadmap state.
- Exception path requires one explicit override label: `governance-override` or `allow-completed-id`.
- Any override must include a clear justification in the PR body.

### Governance PR comment lifecycle
- On governance failure, CI posts (or updates) one bot comment with exact failures and a fix checklist.
- On governance pass, CI removes the old governance-failure bot comment automatically.
- This keeps PR threads clean while preserving actionable guidance when needed.

## Gate 3: Release
For high-risk features (Class A/B):
- Prefer staged rollouts (cohort or percentage).
- Ensure rollback can execute in minutes.
- Monitor guardrails during rollout window.

If guardrails breach thresholds, rollback immediately.

## Gate 4: Weekly Review
Run one weekly 45-minute review covering:
- Product learning: metric movement vs hypothesis
- Reliability: error trends and latency trends
- Incidents: root cause + prevention tasks
- Open risk items and owners

## Definition of Done (upgrade)
An item is done only when it is:
- Working
- Measured
- Reversible
- Owned in production

Missing any one means not done.
