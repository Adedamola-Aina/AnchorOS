# Contributing to AnchorOS

This is a short contributor guide. The engineering operating model lives in [`AGENTS.md`](AGENTS.md) — read it first; it is the single canonical contract for humans and coding agents.

## Getting started

1. Branch from `master`:
   ```bash
   git switch master && git pull --ff-only origin master
   git switch -c <type>/<short-topic>
   ```
2. Install dependencies: `npm install`.
3. For local development, run the app (`npm run dev`, http://localhost:5173) against the **Firebase Emulator Suite** (`npm run emulator:start`) — see [`docs/OPERATIONS.md`](docs/OPERATIONS.md) for the environment model. There is no deployable development cloud environment; retired legacy dev-project references must not be targeted.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) (`fix:`, `feat:`, `refactor:`, `test:`, `docs:`, `chore:`) with focused, unrelated-work-free commits. Commitlint is enforced via Husky.

## Pull requests

Every change lands through a PR — no direct pushes to `master`. PRs use `.github/PULL_REQUEST_TEMPLATE.md`, including risk classification, verification performed, and rollout/rollback notes. CI gates must pass before review.

## Risk & governance

- Auth, Firestore rules/schema, shared finances/family permissions, financial integrity, and deployment logic are high-risk surfaces: include a short design/risk plan (data/security impact, rollback, verification) in the PR.
- Production deploys and production migration applies require explicit Product Owner approval.
- One approved remediation bundle per implementation branch.

## Testing

Targeted first: run the narrowest tests relevant to your change, then broader checks (typecheck, lint, unit/integration) as the touched surface warrants. See `docs/TESTING_STRATEGY.md`.

## Key documentation

| Doc | Purpose |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Canonical engineering contract |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture |
| [`docs/OPERATIONS.md`](docs/OPERATIONS.md) | Environments & release runbook |
| [`docs/FIRESTORE_SCHEMA.md`](docs/FIRESTORE_SCHEMA.md) | Data model |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Security model (reporting: [`.github/SECURITY.md`](.github/SECURITY.md)) |
| [`docs/TESTING_STRATEGY.md`](docs/TESTING_STRATEGY.md) | Test strategy |
| [`docs/adr/`](docs/adr/) | Architecture decision records |

## Questions

Contact the Product Owner (Adedamola Aina) or open a GitHub Issue using the appropriate template.
