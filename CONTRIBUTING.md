# Internal Development Workflow

This document covers commit conventions, quality standards, and the development process for Anchor OS.

---

## How Work Is Tracked

Anchor OS uses **git commits as the single source of truth**. The Internal PM Dashboard (`localhost:3001`) auto-detects bugs, features, and deployments from commit history. There is no external issue tracker.

### ID Prefixes (auto-detected by dashboard)

| Prefix | Purpose | Example |
|--------|---------|---------|
| `BUG-XXX` | Bug fix | `BUG-077` |
| `FEAT-XXX` | New feature | `FEAT-012` |
| `GAP-XXX` | Missing capability | `GAP-005` |
| `REG-XXX` | Regression | `REG-003` |
| `UX-XXX` | UX improvement | `UX-032` |
| `REM-XXX` | Remediation item | `REM-007` |

Use `get_next_id` MCP tool (or `/api/intake/next-id?type=bug`) to get the next available ID.

## Commit Conventions

Every commit message must use a [Conventional Commit](https://www.conventionalcommits.org/) prefix:

```
fix(scope): BUG-XXX description        — Bug fix
feat(scope): FEAT-XXX description       — New feature
refactor(scope): description            — Code improvement
test(scope): description                — Test additions
docs(scope): description                — Documentation
chore(scope): description               — Maintenance
deploy(env): vX.X.X @ HASH             — Deployment record
```

Commitlint enforces prefix validation on every commit via Husky.

## Quality Checklist (Self-Review)

Every change must pass this checklist before commit:

1. **Tests** — New/changed behavior has corresponding unit and/or E2E tests
2. **Types** — No `any` types in production code; strict TypeScript compliance
3. **File size** — Source files stay under 200 lines (test files exempt) — ARCH-001
4. **Mobile-first** — UI changes tested at 375px viewport width; touch targets ≥ 44px
5. **Security** — All database access through `src/utils/secureDb.ts`; no raw Firestore calls
6. **Performance** — No unnecessary re-renders; lazy-load heavy components
7. **Accessibility** — Interactive elements have ARIA labels; `data-testid` on new components

## PR Governance (CI-Enforced)

PRs require these sections (see `.github/PULL_REQUEST_TEMPLATE.md`):

- Risk Class (A/B/C)
- Success Metric
- Guardrail Metrics
- Rollout & Rollback Plan
- Observability
- Test-to-Risk Mapping

CI automatically blocks PRs that are missing governance sections. See `docs/SHIP_GATES.md` for full gate definitions.

## Development Standards

### TypeScript

- Strict mode enabled — no escape hatches without explicit justification
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use Zod schemas for runtime validation of external data

### Testing

- **TDD workflow**: red → green → refactor
- Unit tests colocated with source (`*.test.ts` / `*.test.tsx`)
- E2E tests in `e2e/` directory
- Prefer `data-testid` and `getByRole()` selectors over text matching
- Use robust waits (`expect(locator).toBeVisible()`) — never `waitForTimeout`

### Code Organization

- Feature-based directory structure under `src/features/`
- Shared components in `src/components/`
- Custom hooks in `src/hooks/`
- Max 200 lines per source file; refactor if exceeded

## Environments & Deployment

| Environment | URL | Deploy Command |
|-------------|-----|----------------|
| Development | anchor-os-dev-1c6ec.web.app | `npm run deploy:dev` |
| Staging | anchor-os-staging.web.app | `npm run deploy:staging` |
| Production | anchor-os.web.app | `npm run deploy:production` ⚠️ |

**Never run `firebase deploy` directly.** Always use `npm run deploy:{env}`.

Production deploys require: all tests passing → staging verification → explicit owner approval.

## Questions

Contact the Product Owner (Adedamola Aina) directly or file a GitHub Issue using the appropriate template.
