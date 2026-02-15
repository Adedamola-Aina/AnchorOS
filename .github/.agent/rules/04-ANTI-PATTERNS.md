# ANCHOR OS — ANTI-PATTERNS (NEVER REPEAT)

These are real failures from this project's history. Every one caused user pain, wasted time, or broke production. Memorize them.

## 1. DEPLOYING WITHOUT APPROVAL (2026-01-29 Incident)
Untested code was deployed to production without explicit approval. Production was rolled back to commit `c189779`. **Always verify in staging. Always get "yes, deploy to production" before deploying.**

## 2. CREATING DUPLICATE BUGS/FEATURES
Agent logged BUG-XXX without checking if it already existed. Always query `/api/git/bugs` and `/api/git/features` BEFORE creating anything new.

## 3. FORGETTING TO READ DOCS FIRST
Agent started coding without reading relevant docs, introduced patterns that contradicted existing architecture. **Phase 1 (GATHER) exists for a reason.**

## 4. SHARED ACCOUNT DOUBLE-COUNTING
Family Mode bug: shared account balances were added to BOTH users' net worth. Each account has ONE owner. Sharing provides visibility, not ownership. Net worth = sum of accounts YOU own, never shared-with accounts.

## 5. BREAKING THE 200-LINE RULE (ARCH-001)
Agent created files over 200 lines "because it was easier." Now we have 5 production files that need refactoring. Extract logic into separate files BEFORE they grow past 200 lines.

## 6. WRITING CODE WITHOUT TESTS
Agent wrote implementation first, then "added tests later." Tests were superficial and missed edge cases. **RED → GREEN → REFACTOR. Always.**

## 7. IGNORING MOBILE USERS
Agent built desktop-first UI. 75% of users are mobile. Touch targets were too small, forms were unusable on phones. **Design mobile-first, always.**

## 8. USING RAW FIRESTORE ACCESS
Agent bypassed `secureDb.ts` for "quick" database operations. This broke security rules and caused permission errors. **All DB operations through secureDb.ts.**

## 9. SILENT FAILURES IN OPTIMISTIC UPDATES
Agent implemented optimistic UI updates without rollback on failure. Users saw success states for operations that actually failed. **Every optimistic update must have error recovery.**

## 10. UPDATING DELETED DOCS
Agent tried to update `PROJECT_STATUS.md`, `KNOWN_ISSUES.md`, `ROADMAP.md` — files that were intentionally deleted. **Git commits with correct prefixes are the single source of truth. The dashboard auto-detects everything from git history.**

## 11. DIRECT FIREBASE DEPLOY (2026-02-06 Incident)
Agent ran `firebase deploy --only hosting:staging` directly instead of using `npm run deploy:staging`. This deployed a dev build (missing `VITE_APP_ENV=staging`) to staging, causing the environment banner to disappear.

**NEVER run `firebase deploy` directly. ALWAYS use:**
- `npm run deploy:dev` → Development
- `npm run deploy:staging` → Staging  
- `npm run deploy:production` → Production

These commands build with the correct `--mode` flag and verify the build environment before deploying.

## 12. PRODUCTION DEPLOY WITHOUT TESTING (2026-02-09 Incident)
Agent deployed Cloud Functions v2 and CSP headers directly to production (commit 43c1b41) without:
- Running the full test suite first
- Verifying in staging
- Getting explicit user approval

**The pipeline is NOT optional.** Every production change MUST:
1. Pass all unit tests (`npm run test -- --run`)
2. Pass E2E tests (`npm run test:e2e`)
3. Pass mutation tests (`npm run test:mutation`)
4. Pass rules tests (`npm run test:rules`)
5. Verify in staging first
6. Get explicit "yes, deploy to production" from user

If CI/CD is unavailable, run the deploy pipeline which enforces all gates:
```bash
npm run deploy:production
```

## 13. SKIPPING PHASE 1 GATHER
Agent started coding without checking dashboard state first. This leads to:
- Duplicate bug/feature creation
- Missing context from recent changes
- Conflicting with in-progress work

**BEFORE ANY WORK, always run:**
```bash
curl -s http://localhost:3001/api/command-center | head -100
```
