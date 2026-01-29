# KNOWN ISSUES

**Last Updated**: 2026-01-29

---

## 🔴 CRITICAL (P0)

_No critical issues at this time_

---

## 🟡 HIGH (P1)


---



### [GAP-002] Design System Color Token Fragmentation
- **Reported**: 2026-01-26 (Codebase Audit)
- **Impact**: Inconsistent "Premium" feel, mixed use of `indigo`, `blue`, `violet`
- **Root Cause**: Hardcoded color values instead of semantic tokens
- **Fix**: Refactor to `anchor-finance` / `primary` tokens from `tailwind.config.js`
- **Assigned**: Unassigned
- **Target**: 2026-02-05
- **Status**: Backlog

### [GAP-003] Navigation Race Condition
- **Reported**: 2026-01-26 (Codebase Audit)
- **Impact**: Flaky navigation on slow devices
- **Root Cause**: `setTimeout(..., 100)` hack in `CommitmentsView.tsx`
- **Fix**: Use proper `useEffect` or state callback
- **Assigned**: Unassigned
- **Target**: 2026-02-05
- **Status**: Backlog

### [GAP-004] Command Palette Recent Actions Stub
- **Reported**: 2026-01-26 (Codebase Audit)
- **Impact**: Power users have static experience
- **Root Cause**: Logic to track recent actions is commented out
- **Fix**: Implement persistence for recent actions
- **Assigned**: Unassigned
- **Target**: 2026-02-10
- **Status**: Backlog

---

## 🔵 REGRESSIONS

_No regressions detected_

---

## ✅ RECENTLY FIXED

### [BUG-008] Transaction History UI Inconsistency (FIXED 2026-01-29)
- **Fix**: Unified Finance and Account Details to use `VirtualTransactionList` + `TransactionItem`
- **Verified**: Code review confirmed integration

### [BUG-009] Dark Mode White Edge (FIXED 2026-01-29)
- **Fix**: Removed background color from SwipeableRow wrapper
- **Verified**: Deployed

### [BUG-010] Transaction List Spacing (FIXED 2026-01-29)
- **Fix**: Reduced padding from `pb-4` to `pb-2`
- **Verified**: Code review

### [BUG-011] Empty List Scroll (FIXED 2026-01-29)
- **Fix**: Removed `min-h` constraint from empty state
- **Verified**: Code review

### [BUG-014] Transaction List Layout (FIXED 2026-01-29)
- **Fix**: Container-based virtualization, edge-to-edge styling
- **Verified**: Implemented in UX-017 work

### [BUG-012] Task Box Sizing (FIXED 2026-01-29)
- **Fix**: Reduced padding `p-3`, toggles `p-1.5`
- **Verified**: Code review

### [BUG-013] Redundant Mobile Icons (FIXED 2026-01-29)
- **Fix**: Hidden icons on mobile (`hidden sm:flex`)
- **Verified**: Code review


### [ARCH-001] Files Approaching 200-Line Limit (FIXED 2026-01-28)
- **Issue**: 6 files were approaching the 200-line architecture limit
- **Files Refactored**:
  - `useSharedAccounts.ts`: 196 → 149 lines (extracted `sharedAccountSubscriptions.ts`)
  - `FamilyNotificationBanner.tsx`: 189 → 157 lines (extracted `notificationStyles.ts`)
  - `ActivityFeed.tsx`: 188 → 141 lines (extracted `activityHelpers.ts`)
  - `EditTaskForm.tsx`: 186 → 136 lines (extracted `EditTaskFormFields.tsx`)
  - `useFinanceOperations.ts`: 183 → 165 lines (extracted `financeActivityLogging.ts`)
  - `InviteFamilyMember.tsx`: 187 lines (already well-structured, acceptable)
- **Verified By**: Agent (434 tests passing)
- **Deployment**: Local

### [REG-001] XSS E2E Test Failures (FIXED 2026-01-28)
- **Issue**: E2E tests `XSS Protection: Transaction Title` and `XSS Payload Neutralization` failing on Staging
- **Root Cause**: Test selectors outdated - looking for "New Transaction" button that no longer exists. UI changed to require clicking into an account first before adding transactions. Also `text=Net Worth` selector matched 2 elements (strict mode violation).
- **Fix**: Updated test selectors to match current UI flow (click account → Pay Bill), used `.first()` for ambiguous locators
- **Files**: `e2e/backlog_advanced.spec.ts`, `e2e/comprehensive.spec.ts`
- **Verified By**: Agent (3/3 XSS tests passing)
- **Deployment**: Local

### [BUG-007] Modal inputs unresponsive on mobile (FIXED 2026-01-28)
- **Issue**: Cannot type in input fields within modals (Transfer, Bills, Add Account) on mobile devices. Commitment form name field also affected.
- **Root Cause**: `PullToRefresh` and `SwipeableRow` components intercepting touch events on input elements, preventing focus and text entry
- **Fix**: Added check in `handleTouchStart` to ignore touch events from interactive elements (INPUT, TEXTAREA, SELECT, BUTTON, A)
- **Files**: `PullToRefresh.tsx`, `SwipeableRow.tsx`
- **Verified By**: Agent
- **Deployment**: Local (Ready for Dev/Staging)

### [BUG-006] Text overflow in Dashboard and Finance widgets (FIXED 2026-01-28)
- **Issue**: Text overflowing from widgets on dashboard and finance pages, breaking layout on narrow viewports and with long text strings
- **Root Cause**: Inconsistent application of truncate utilities and missing flex constraints (min-w-0) on parent containers
- **Fix**: Applied proper `min-w-0` flex constraints and `truncate` utilities across all affected widgets
- **Files**: DashboardWidgets.tsx, RecentActivityList.tsx, AssetDistributionChart.tsx, TransactionItem.tsx, AccountCard.tsx
- **Verified By**: Agent
- **Deployment**: Dev (2026-01-28)

### [BUG-003] Account edit buttons hidden on mobile (FIXED 2026-01-26)
- **Issue**: Cancel/Accept buttons hidden when editing account name on iPhone 15 Pro
- **Root Cause**: Flex row layout pushed buttons off-screen on narrow devices
- **Fix**: Changed to vertical stacking with "Save"/"Cancel" labels on mobile
- **File**: `AccountHeader.tsx`
- **Verified By**: Agent
- **Deployment**: Local/Dev

### [BUG-004] Settings 2FA text misaligned on mobile (FIXED 2026-01-26)
- **Issue**: 2FA text and button not centered on mobile, button hard to read
- **Root Cause**: Missing mobile-first flex alignment
- **Fix**: Added `flex-col sm:flex-row` with centered text/button on mobile, added Shield icon
- **File**: `SecuritySettings.tsx`
- **Verified By**: Agent
- **Deployment**: Local/Dev

### [BUG-005] Settings Contact button misaligned on mobile (FIXED 2026-01-26)
- **Issue**: "Send Message" button not centered on mobile
- **Root Cause**: Left-aligned flex layout only
- **Fix**: Added `items-center text-center` and `w-full md:w-auto` for mobile centering
- **File**: `SupportSettings.tsx`
- **Verified By**: Agent
- **Deployment**: Local/Dev

### [BUG-002] Mobile keyboard covers input fields (FIXED 2026-01-26)
- **Issue**: iOS Safari keyboard covers input fields in transaction forms
- **Root Cause**: No scroll adjustment when keyboard appears
- **Fix**: Created `useKeyboardAvoidance.ts` hook using visualViewport API
- **Test**: Created `useKeyboardAvoidance.test.ts` - ✅ 8 tests passing
- **Verified By**: Agent
- **Deployment**: Local/Dev (Ready for Staging)

### [GAP-001] Fabric AI Data Wiring (FIXED 2026-01-26)
- **Issue**: "Magic" suggestion system navigated to Finance but dropped data (amount, category, description)
- **Root Cause**: `navigateTo()` didn't support URL parameters
- **Fix**: Updated `AnchorContext` to pass params, `FinanceView` to read params, `TransactionForm` to accept `prefillData`
- **Test**: Created `TransactionForm.test.tsx` - ✅ Passing
- **Verified By**: Agent
- **Deployment**: Local/Dev (Ready for Staging)

---

## 📊 BUG STATISTICS

- **Total Active**: 9
- **Critical (P0)**: 0
- **High (P1)**: 4 (BUG-008, BUG-009, BUG-010, BUG-011)
- **Low (P2)**: 5 (BUG-012, BUG-013, BUG-014, GAP-002, GAP-003, GAP-004)
- **Fixed This Month**: 10 (GAP-001, BUG-001 thru BUG-007, ARCH-001, REG-001)
- **Average Fix Time**: < 1 day

---

## ✅ RESOLVED

### [BUG-001] Transaction search slow on 1000+ transactions ✅ FIXED
- **Reported**: 2026-01-25
- **Reporter**: Family Member
- **Impact**: Search takes 3-5 seconds
- **Root Cause**: Client-side filtering with no search optimization
- **Fix**: Created `useTransactionSearch` hook with pre-built search index
- **Assigned**: Teeto
- **Resolved**: 2026-01-28
- **Status**: ✅ FIXED
- **Results**: 1000 txns: 2ms (target: <500ms), 5000 txns: 9ms (target: <1000ms)
- **Tests**: 18 unit tests, integrated into FinanceView

---

**Triage**: Daily review at 09:00
**Update**: Real-time as bugs reported/fixed