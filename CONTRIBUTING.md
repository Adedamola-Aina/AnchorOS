# Internal Development Workflow

This document covers the branching strategy, code review requirements, and task-linking conventions for Anchor OS.

---

## Branching Strategy

All work is performed on short-lived feature branches created from `master`.

| Branch Pattern | Purpose | Example |
|---------------|---------|---------|
| `feat/<ticket>-description` | New feature | `feat/AOS-142-csv-export` |
| `fix/<ticket>-description` | Bug fix | `fix/AOS-215-transfer-validation` |
| `refactor/<ticket>-description` | Code improvement | `refactor/AOS-301-extract-card` |
| `chore/<ticket>-description` | Tooling, deps, config | `chore/AOS-88-upgrade-vite` |
| `test/<ticket>-description` | Test additions/fixes | `test/AOS-190-e2e-onboarding` |

### Rules

- Branch from `master`. Merge back to `master`.
- Rebase onto `master` before opening a PR — no merge commits in feature branches.
- Delete the branch after merge.
- Hotfixes follow the same pattern (`fix/<ticket>-description`) and are fast-tracked through review.

## Commit Conventions

Every commit message must use a [Conventional Commit](https://www.conventionalcommits.org/) prefix and reference the task ticket:

```
feat(finance): add CSV export for transactions [AOS-142]
fix(auth): resolve TOTP enrollment race condition [AOS-215]
chore(deps): upgrade Vite to 7.2 [AOS-88]
refactor(settings): extract AccountCard to shared component [AOS-301]
test(e2e): add onboarding happy-path coverage [AOS-190]
docs(arch): update Firestore schema documentation [AOS-305]
```

Commitlint enforces prefix validation on every commit via Husky.

## Task Linking

- Every PR title must include the ticket ID: `[AOS-142] Add CSV export for transactions`
- The PR description must link to the Jira ticket
- Use Jira smart commits where applicable (`AOS-142 #done`, `AOS-142 #in-review`)

## Code Review Requirements

All PRs require **at least one approving review** before merge.

### Reviewer Checklist

1. **Tests** — New/changed behavior has corresponding unit and/or E2E tests
2. **Types** — No `any` types in production code; strict TypeScript compliance
3. **File size** — Source files stay under 200 lines (test files exempt)
4. **Mobile-first** — UI changes tested at 375px viewport width
5. **Security** — All database access through `src/utils/secureDb.ts`; no raw Firestore calls
6. **Performance** — No unnecessary re-renders; lazy-load heavy components
7. **Accessibility** — Interactive elements have ARIA labels; `data-testid` on new components

### Merge Criteria

- All CI checks pass (lint, type check, unit tests, E2E)
- At least one approving review
- No unresolved review comments
- Branch is rebased onto latest `master`

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

## Environment Access

| Environment | Access | Deploy Method |
|-------------|--------|---------------|
| Development | All developers | `npm run dev` (local) |
| Staging | CI auto-deploy | Push to `master` → CI pipeline |
| Production | Manual approval | `npm run deploy:production` (requires authorization) |

Request environment credentials via a Jira `INFRA-*` ticket. Firebase project access is managed through IAM roles.

## Questions

Reach out on the team's internal channel or file a Jira ticket under the `AOS` project.
