# ANCHOR OS — TECHNICAL REFERENCE

## Stack
TypeScript (strict) · React 19 · Vite · Tailwind CSS · Firebase (Firestore, Auth, Functions, Hosting) · Vitest (unit) · Playwright (E2E)

## Architecture Mandates

| ID | Rule | Check |
|----|------|-------|
| ARCH-001 | Source files under 200 lines (test files exempt) | `find src -name "*.ts" -o -name "*.tsx" \| grep -v test \| xargs wc -l \| awk '$1>200'` |
| ARCH-002 | Error boundaries on all major views | Verify in `src/features/*/` |
| ARCH-003 | All DB through `src/utils/secureDb.ts` | Never raw Firestore imports |
| ARCH-004 | Mobile-first (75% mobile users, touch targets ≥44px) | Test on 375px viewport |

## Testing Requirements

| Type | Location | Tool | Minimum |
|------|----------|------|---------|
| Unit | `src/**/*.test.ts` | Vitest | 80% coverage |
| E2E | `e2e/*.spec.ts` | Playwright | Critical user flows |
| Integration | `npm run test:integration` | Firebase emulators | Service layer |
| Mutation | `npm run test:mutation` | Stryker | Score > 70% |
| Rules | `npm run test:rules` | Vitest | Firestore security rules |

## Commit Prefixes (Dashboard auto-detects these)

```
fix(scope): BUG-XXX description     — Bug fix
feat(scope): FEAT-XXX description   — New feature
refactor(scope): description        — Code improvement
test(scope): description            — Test additions
docs(scope): description            — Documentation
chore(scope): description           — Maintenance
deploy(env): vX.X.X @ HASH          — Deployment record
```

## Environments

| Env | URL | Deploy Command |
|-----|-----|----------------|
| Dev | anchor-os-dev-1c6ec.web.app | `npm run deploy:dev` |
| Staging | anchor-os-staging.web.app | `npm run deploy:staging` |
| Production | anchor-os.web.app | `npm run deploy:production` ⚠️ |

Dev server: `npm run dev` on LXC 107 (192.168.0.57 / Tailscale 100.112.129.21)

## Forbidden

- `any` type in TypeScript
- `console.log` in production code
- Hardcoded API keys or secrets
- Raw Firestore access (use secureDb)
- Raw `firebase deploy` (use npm scripts)
- Files over 200 lines
- Skipping Phase 1 (GATHER)
- Deploying without tests passing
- Optimistic UI updates without rollback

## Key Directories

```
src/features/{feature}/     — Feature modules (View + components/ + hooks/)
src/services/               — AccountService, TransactionService, AuditService
src/hooks/                  — Shared hooks (useFinanceService, useFamilySharing)
src/utils/secureDb.ts       — ALL database operations
src/components/             — Shared UI components
packages/design-system/     — Badge, Card, Stack, Surface, Skeleton
functions/src/              — Cloud Functions (recurring txns, reminders)
tools/dashboard/            — Internal PM Dashboard (localhost:3001)
tools/mcp-server/           — MCP server wrapping dashboard API
e2e/                        — Playwright E2E tests
config/                     — Build configs (vite, tailwind, playwright, etc.)
```
