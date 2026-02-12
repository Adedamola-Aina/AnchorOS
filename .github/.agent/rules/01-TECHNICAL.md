# ANCHOR OS — TECHNICAL RULES

## Stack
TypeScript (strict) · React 19 · Vite · Tailwind CSS · Firebase (Firestore, Auth, Functions, Hosting) · Vitest (unit) · Playwright (E2E)

## Architecture Mandates

**ARCH-001**: All source files under 200 lines. Test files exempt. Check: `find src -name "*.ts" -o -name "*.tsx" | grep -v test | xargs wc -l | awk '$1>200'`

**ARCH-002**: Error boundaries on all major views.

**ARCH-003**: All DB operations through `src/utils/secureDb.ts`. Never raw Firestore.

**ARCH-004**: Mobile-first. 75% of users are mobile. Touch targets ≥44px. Design mobile → desktop.

## Testing (Non-Negotiable)
- Unit: `src/**/*.test.ts` (Vitest) — 80% coverage minimum
- E2E: `e2e/*.spec.ts` (Playwright) — critical user flows
- Integration: `npm run test:integration` with Firebase emulators
- **No code ships without tests covering every path**

## Commit Format
```
type(scope): brief description

fix(finance): BUG-XXX prevent negative balance
feat(commitments): FEAT-XXX add weekly planning
deploy(staging): v1.5.14 @ abc1234
```
The dashboard auto-detects bugs, features, and deployments from these prefixes.

## Forbidden
- ❌ `any` type in TypeScript
- ❌ `console.log` in production code
- ❌ Hardcoded API keys or secrets
- ❌ Deploying without tests passing
- ❌ Files over 200 lines (ARCH-001)
- ❌ Skipping Phase 1 (GATHER)
- ❌ Raw Firestore access (use secureDb)

## Environments
| Env | URL | Firebase Project | Deploy |
|-----|-----|-----------------|--------|
| Dev | anchor-os-dev-1c6ec.web.app | anchor-os-dev-1c6ec | `npm run deploy:dev` |
| Staging | anchor-os-staging.web.app | anchor-os-staging | `npm run deploy:staging` |
| Production | anchor-os.web.app | anchor-os | `npm run deploy:production` ⚠️ APPROVAL REQUIRED |

Dev server: `npm run dev` on LXC 107 (192.168.0.57 / Tailscale 100.112.129.21)
