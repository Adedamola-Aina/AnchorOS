## What does this PR do?

Brief description of the change.

## Why now?

Link issue/bug and explain why this should ship now.

### Risk Class

Choose one: `A` (high risk), `B` (medium), `C` (low)

### Linked Initiative Issue

Required for Risk Class `A`/`B`. Add issue reference (example: `#123`).
For Risk Class `C`, write `N/A`.

### Success Metric

Define 1 measurable outcome (example: activation rate +2%, task completion latency -20%).

### Guardrail Metrics

Define up to 3 guardrails that must not regress (errors, latency, retention, crash-free sessions).

### Rollout Plan

Describe rollout strategy (cohort/percentage, environment path, monitoring window).

### Rollback Plan

Exact rollback trigger + action (flag off, revert commit, config rollback, etc.).

### Observability

List telemetry/logs/events/traces updated, or justify why none are needed.

## How to test

1.
2.
3.

### Test-to-Risk Mapping

Map each key risk/failure mode to at least one test.

## Checklist

- [ ] I defined success + guardrail metrics
- [ ] I defined rollout + rollback plan
- [ ] I mapped tests to risk/failure modes
- [ ] Tests added/updated
- [ ] Lint passes (`npm run lint`)
- [ ] Unit tests pass (`npm test`)
- [ ] Source files under 200 lines
- [ ] Commit messages use conventional prefixes
