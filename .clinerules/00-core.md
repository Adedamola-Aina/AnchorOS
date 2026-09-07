# AnchorOS — Cline core rule

`AGENTS.md` is the canonical engineering contract. Follow it; do not recreate the old multi-agent workflow.

- Search before reading. Pull only the files/symbols needed for the current goal.
- Small/obvious work can go directly to Act. Normal work gets a short plan. Auth, schema/rules, family permissions, financial integrity, core Fabric AI, deployment, and prod infrastructure require deeper planning/risk review.
- Do not query the internal dashboard unless the task actually needs deployment/environment/release telemetry.
- Do not preload `docs/`, `CHANGELOG.md`, dashboard data, or unrelated feature trees.
- Prefer targeted tests/typecheck/lint before broad suites.
- Never run raw `firebase deploy` or deploy production without explicit owner approval.
- Never read or expose secrets from `.env*`.
- One task = one goal. Start a new task after a completed unrelated goal instead of carrying old context forward.
- If Context7 is connected, use it only for current external library/API documentation; AnchorOS behavior comes from this repository.
