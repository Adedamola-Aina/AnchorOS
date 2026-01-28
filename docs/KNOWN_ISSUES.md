# KNOWN ISSUES

**Last Updated**: 2026-01-28

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

## 🔴 CRITICAL (P0)

### [REG-001] XSS Validation Failure in E2E Tests
- **Reported**: 2026-01-26 (Codebase Audit)
- **Reporter**: Agent (Automated Test)
- **Impact**: E2E test `XSS Protection: Transaction Title` failing on Staging
- **Root Cause**: Validation logic timeout or selector issue
- **Fix**: Debug test selector, verify `containsDangerousPatterns` is called
- **Assigned**: Unassigned
- **Target**: 2026-01-28
- **Status**: Investigating
- **Workaround**: Backend Firestore Rules should still block malicious content

---

## 🟡 HIGH (P1)

_No high priority issues at this time_

---

## 🟢 LOW (P2)

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

- **Total Active**: 4
- **Critical (P0)**: 2 (BUG-001, REG-001)
- **High (P1)**: 0
- **Low (P2)**: 3 (GAP-002, GAP-003, GAP-004)
- **Fixed This Month**: 6 (GAP-001, BUG-002, BUG-003, BUG-004, BUG-005, BUG-006)
- **Average Fix Time**: < 1 day

---

**Triage**: Daily review at 09:00
**Update**: Real-time as bugs reported/fixed