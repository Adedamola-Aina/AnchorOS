# Contributing to Anchor OS

Thanks for your interest in contributing. Here's how to get started.

## Development workflow

1. **Fork and clone** the repo
2. **Create a branch** from `master`:
   ```bash
   git checkout -b feat/your-feature
   # or: fix/bug-description, refactor/component-name
   ```
3. **Install dependencies**: `npm install`
4. **Start the dev server**: `npm run dev`

## Code standards

- **TypeScript strict mode** — no `any` types in production code
- **200-line limit** per source file (test files exempt)
- **Mobile-first** — 75% of users are on mobile; test at 375px width
- **All database access** through `src/utils/secureDb.ts`

## Commit messages

Use conventional commit prefixes:

```
feat: add CSV export for transactions
fix: resolve transfer amount validation
chore: update dependencies
refactor: extract AccountCard to shared component
test: add E2E tests for onboarding flow
docs: update deployment checklist
```

## Testing

Write tests before code (TDD):

```bash
npm test              # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
npm run test:mutation # Mutation tests (Stryker)
```

### E2E test guidelines

- Prefer `data-testid` attributes and `getByRole()` over `text=` selectors
- Add `data-testid` to new UI components
- Use robust waits (`expect(locator).toBeVisible()`) instead of `waitForTimeout`

## Pull requests

- Target `master` branch
- Include a clear description of what changed and why
- Ensure all CI checks pass (unit, E2E, lint)
- Keep PRs focused — one feature or fix per PR

## Environments

| Environment | Purpose |
|-------------|---------|
| `localhost:5173` | Local development |
| `anchor-os-staging.web.app` | Staging (auto-deploy from `staging`/`develop`) |
| Production | Manual approval required after all CI gates pass |

## Questions?

Open an issue or reach out via the in-app contact form.
