# 🚀 ANCHOR OS - Feature Suggestions & Improvements

**Created**: 2026-01-26  
**Purpose**: Comprehensive audit of feature opportunities across all product verticals  
**Status**: Internal Tracking - Ready for Team Review

---

## 📊 Summary

| Category | Suggestions | Priority Count |
|----------|-------------|----------------|
| Architecture & Code Quality | 12 | 4 High, 5 Medium, 3 Low |
| Authentication & Security | 10 | 3 High, 4 Medium, 3 Low |
| UI/UX & Design System | 15 | 5 High, 6 Medium, 4 Low |
| Finance Module | 8 | 2 High, 4 Medium, 2 Low |
| Commitments (Todo) | 7 | 2 High, 3 Medium, 2 Low |
| Family Mode | 6 | 2 High, 2 Medium, 2 Low |
| Settings & Account | 5 | 1 High, 3 Medium, 1 Low |
| Onboarding & User Journey | 8 | 3 High, 3 Medium, 2 Low |
| Brand & Marketing | 6 | 2 High, 2 Medium, 2 Low |
| Support & Help | 5 | 1 High, 2 Medium, 2 Low |

**Total: 82 Suggestions**

---

## 🏗️ 1. ARCHITECTURE & CODE QUALITY

### HIGH Priority

#### [ARCH-001] Reduce Monolithic Context Files
- **Current State**: `AuthContext.tsx` (355 lines), `FinanceContext.tsx` (large)
- **Problem**: Violates CLAUDE.md 200-line rule, even with justification
- **Suggestion**: Split into focused contexts:
  - `AuthSessionContext.tsx` - User session state
  - `AuthOperationsContext.tsx` - Sign in/up/out functions
  - `MfaContext.tsx` - MFA enrollment and verification
- **Impact**: Better testing, clearer ownership, reduced re-renders
- **Effort**: Medium (2-3 days)

#### [ARCH-002] Implement Proper Error Boundaries Per Feature
- **Current State**: Single `ErrorBoundary.tsx` at app level
- **Problem**: One error crashes entire app section
- **Suggestion**: Add feature-level boundaries:
  - `FinanceErrorBoundary` - Graceful finance failures
  - `CommitmentsErrorBoundary` - Graceful task failures
- **Impact**: Better user experience, isolated failures
- **Effort**: Low (1 day)

#### [ARCH-003] Add Service Layer Tests
- **Current State**: Most tests are component-level
- **Problem**: Service logic (TransactionService, AccountService) under-tested
- **Suggestion**: Create `services/__tests__/` with unit tests for all service functions
- **Impact**: Catch business logic bugs earlier
- **Effort**: Medium (3-4 days)

#### [ARCH-004] Implement Feature Flags System
- **Current State**: No feature flags infrastructure
- **Problem**: Can't gradually rollout features
- **Suggestion**: Add feature flags using Firebase Remote Config:
  ```typescript
  const { isEnabled } = useFeatureFlag('new_transaction_flow');
  ```
- **Impact**: Safer deployments, A/B testing capability
- **Effort**: Medium (2 days)

### MEDIUM Priority

#### [ARCH-005] Create Shared Component Library Package
- **Problem**: `components/ui/` and `components/shared/` are tightly coupled
- **Suggestion**: Extract to `@anchor-os/ui` internal package
- **Impact**: Reusable across future products (dashboard, marketing site)
- **Effort**: High (1 week)

#### [ARCH-006] Add API Client Abstraction
- **Current State**: Direct Firestore calls in hooks/services
- **Suggestion**: Create `src/api/` layer with abstraction:
  - `AccountsApi.ts`
  - `TransactionsApi.ts`
  - `TasksApi.ts`
- **Impact**: Easier mocking, potential backend migration path
- **Effort**: Medium (3 days)

#### [ARCH-007] Implement Optimistic Updates with Rollback
- **Current State**: Wait for Firestore write completion
- **Suggestion**: Implement optimistic UI updates with rollback on failure
- **Impact**: Faster perceived performance
- **Effort**: Medium (3 days)

#### [ARCH-008] Add Request Deduplication
- **Problem**: Multiple components can trigger same Firestore query
- **Suggestion**: Use React Query or TanStack Query for caching
- **Impact**: Reduced Firebase reads (cost savings), faster UI
- **Effort**: High (1 week)

#### [ARCH-009] Create E2E Test Fixtures/Factories
- **Current State**: E2E tests create data manually
- **Suggestion**: Factory pattern for test data:
  ```typescript
  const account = await createTestAccount({ balance: 5000 });
  ```
- **Impact**: More reliable, faster E2E tests
- **Effort**: Medium (2 days)

### LOW Priority

#### [ARCH-010] Add Bundle Analysis to CI
- **Suggestion**: Add `vite-bundle-visualizer` to CI pipeline
- **Impact**: Prevent bundle size regressions

#### [ARCH-011] Create Architecture Decision Records (ADRs)
- **Suggestion**: Document major architecture decisions in `/docs/adr/`
- **Impact**: Better onboarding, historical context

#### [ARCH-012] Add OpenTelemetry Tracing
- **Suggestion**: Instrument critical paths for performance monitoring
- **Impact**: Production debugging capability

---

## 🔐 2. AUTHENTICATION & SECURITY

### HIGH Priority

#### [AUTH-001] Add Social Sign-In (Google/Apple)
- **Current State**: Only email/password auth
- **Problem**: High friction for new users
- **Suggestion**: Implement OAuth providers:
  - Sign in with Google (Firebase Auth)
  - Sign in with Apple (required for iOS)
- **UI Change**: Add social buttons below email form
  ```
  ─────── or continue with ───────
  [ Google ] [ Apple ]
  ```
- **Impact**: 30-50% signup conversion improvement (industry standard)
- **Effort**: Medium (2-3 days)

#### [AUTH-002] Implement Passkey / WebAuthn Support
- **Current State**: TOTP MFA only
- **Problem**: TOTP requires authenticator app
- **Suggestion**: Add passkey support (biometric login):
  - `navigator.credentials.create()` for registration
  - `navigator.credentials.get()` for authentication
- **Impact**: Seamless, phishing-resistant auth
- **Effort**: High (1 week)

#### [AUTH-003] Add "Remember This Device" for MFA
- **Current State**: MFA required every login
- **Problem**: Friction for trusted devices
- **Suggestion**: Store device token for 30-day bypass:
  - "Remember this device for 30 days" checkbox
  - Secure device fingerprinting
- **Impact**: Better UX for family members
- **Effort**: Medium (2 days)

### MEDIUM Priority

#### [AUTH-004] Improve Password Reset Flow
- **Current State**: Basic email reset
- **Suggestion**: 
  - Custom branded email template
  - In-app password change (authenticated)
  - Security question recovery (optional)
- **Effort**: Low (1 day)

#### [AUTH-005] Add Account Lockout Protection
- **Current State**: Client-side rate limiting only
- **Suggestion**: Server-side lockout after 5 failed attempts
- **Impact**: Brute force protection
- **Effort**: Low (1 day)

#### [AUTH-006] Session Timeout Configuration
- **Current State**: No configurable session timeout
- **Suggestion**: Add to Security Settings:
  - "Auto-logout after: 15min / 1hr / 8hr / Never"
- **Impact**: Enterprise security compliance
- **Effort**: Low (1 day)

#### [AUTH-007] Login Activity Log
- **Suggestion**: Show in Security Settings:
  ```
  Recent Logins:
  - Jan 26, 10:30 AM • Chrome on Mac • San Francisco
  - Jan 25, 8:15 PM • Safari on iPhone • San Francisco
  ```
- **Impact**: Security awareness, detect unauthorized access
- **Effort**: Medium (2 days)

### LOW Priority

#### [AUTH-008] "Sign in as Different User" Quick Switch
- **Suggestion**: For multi-account households (parent/child accounts)

#### [AUTH-009] Biometric App Lock (Mobile PWA)
- **Suggestion**: Local biometric check before app access

#### [AUTH-010] Trusted Contacts Recovery
- **Suggestion**: Recovery via family member verification

---

## 🎨 3. UI/UX & DESIGN SYSTEM

### HIGH Priority

#### [UX-001] Unified Color Token System
- **Current State**: Mixed `indigo`, `blue`, `violet` usage
- **Problem**: Inconsistent "premium" feel (GAP-002)
- **Suggestion**: Define semantic tokens:
  ```css
  --color-primary: /* Anchor Blue */
  --color-finance: /* Money Green */
  --color-task: /* Action Purple */
  --color-family: /* Warm Coral */
  ```
- **Impact**: Cohesive brand, easier theming
- **Effort**: Medium (3 days)

#### [UX-002] Dark Mode Polish
- **Current State**: Functional but not refined
- **Suggestion**: 
  - Add OLED-true-black option
  - Review all contrast ratios
  - Add theme-specific accent colors
- **Impact**: Premium feel, accessibility
- **Effort**: Medium (2 days)

#### [UX-003] Skeleton Loading States
- **Current State**: Spinner on load
- **Suggestion**: Add skeleton loading patterns:
  - Account card skeletons
  - Transaction list skeletons
  - Dashboard widget skeletons
- **Impact**: Perceived faster loading
- **Effort**: Low (2 days)

#### [UX-004] Empty State Illustrations
- **Current State**: Text-only empty states
- **Suggestion**: Add branded illustrations:
  - "No transactions yet" → Friendly piggy bank illustration
  - "No tasks today" → Celebratory checkmark illustration
- **Impact**: Delightful, premium feel
- **Effort**: Medium (illustrations needed + implementation)

#### [UX-005] Onboarding Tour / Hints
- **Current State**: One-time onboarding only
- **Suggestion**: Add contextual hints for new features:
  - "Did you know? Tap Magic to auto-fill transactions"
  - First-time feature discovery tooltips
- **Impact**: Feature adoption, reduced support
- **Effort**: Medium (3 days)

### MEDIUM Priority

#### [UX-006] Haptic Feedback (Mobile)
- **Suggestion**: Add vibration on key actions:
  - Transaction saved
  - Task completed
  - Account selected
- **Impact**: Tactile premium experience
- **Effort**: Low (1 day)

#### [UX-007] Keyboard Navigation Improvements
- **Current State**: Basic keyboard support
- **Suggestion**: 
  - `Tab` for focus navigation
  - `Escape` to close modals (already done)
  - Arrow keys for list navigation
- **Impact**: Accessibility, power user experience
- **Effort**: Medium (2 days)

#### [UX-008] Pull-to-Refresh (Mobile)
- **Current State**: Manual refresh button only
- **Suggestion**: Native pull-to-refresh gesture
- **Impact**: Expected mobile behavior
- **Effort**: Low (1 day)

#### [UX-009] Transaction Swipe Actions
- **Suggestion**: 
  - Swipe left → Delete
  - Swipe right → Edit
- **Impact**: Faster mobile editing
- **Effort**: Medium (2 days)

#### [UX-010] Toast Position & Duration Configuration
- **Suggestion**: Allow user preference for toast location
- **Impact**: Less intrusive notifications
- **Effort**: Low (half day)

#### [UX-011] Consistent Button Styles
- **Current State**: Mix of button variants across pages
- **Suggestion**: Audit and standardize to 3 variants:
  - Primary (filled)
  - Secondary (outlined)
  - Ghost (minimal)
- **Impact**: Visual consistency
- **Effort**: Low (1 day)

### LOW Priority

#### [UX-012] Animation System
- **Suggestion**: Define entry/exit animations catalog

#### [UX-013] Typography Scale Audit
- **Suggestion**: Ensure consistent heading sizes across views

#### [UX-014] Icon Consistency
- **Suggestion**: Audit for consistent icon usage (Lucide)

#### [UX-015] Right-to-Left (RTL) Support
- **Suggestion**: Arabic/Hebrew language preparation

---

## 💰 4. FINANCE MODULE

### HIGH Priority

#### [FIN-001] Budget Tracking
- **Current State**: Transaction tracking only
- **Suggestion**: Add budget feature:
  - Set monthly budgets per category
  - Visual spending vs budget gauge
  - Alerts when approaching limit
- **Impact**: Core financial planning feature
- **Effort**: High (1-2 weeks)

#### [FIN-002] Transaction Search Index (BUG-001 Fix)
- **Current State**: Client-side filtering (slow)
- **Suggestion**: 
  - Add Firestore composite indexes
  - Implement cursor-based pagination
  - Add search by title/description
- **Impact**: 10x faster search
- **Effort**: Medium (2-3 days)

### MEDIUM Priority

#### [FIN-003] Recurring Transactions
- **Suggestion**: 
  - Mark transaction as recurring
  - Auto-create on schedule (daily/weekly/monthly)
  - Edit series vs single occurrence
- **Impact**: Reduce manual entry
- **Effort**: High (1 week)

#### [FIN-004] Transaction Attachments
- **Suggestion**: Attach receipt photos to transactions
- **Impact**: Record keeping, expense tracking
- **Effort**: Medium (3 days)

#### [FIN-005] Multi-Currency Dashboard
- **Current State**: Shows individual currency accounts
- **Suggestion**: Add net worth in preferred currency with conversion
- **Impact**: Unified wealth view
- **Effort**: Medium (2 days)

#### [FIN-006] CSV/PDF Export
- **Suggestion**: Export transactions for tax/accounting
- **Impact**: Enterprise users, tax season
- **Effort**: Medium (2-3 days)

### LOW Priority

#### [FIN-007] Transaction Categories Customization
- **Suggestion**: User-defined categories beyond defaults

#### [FIN-008] Split Transactions
- **Suggestion**: Split one payment across categories

---

## ✅ 5. COMMITMENTS (TODO) MODULE

### HIGH Priority

#### [TASK-001] Task Templates
- **Suggestion**: Pre-built habit templates:
  - "Morning Routine" (exercise, journal, devotional)
  - "Financial Habits" (check accounts, review spending)
  - "Family Time" (dinner together, game night)
- **Impact**: Easier onboarding, inspiration
- **Effort**: Medium (2 days)

#### [TASK-002] Task Streaks & Gamification
- **Suggestion**: 
  - Show current streak for recurring tasks
  - Streak achievements/badges
  - "Don't break the chain" visualization
- **Impact**: Habit formation, engagement
- **Effort**: Medium (3 days)

### MEDIUM Priority

#### [TASK-003] Subtasks / Checklists
- **Current State**: Single-level tasks only
- **Suggestion**: Add expandable subtasks
- **Impact**: Complex task management
- **Effort**: Medium (3 days)

#### [TASK-004] Task Due Dates & Reminders
- **Current State**: Time of day only
- **Suggestion**: Add specific due dates with push notifications
- **Impact**: Proactive task management
- **Effort**: Medium (2-3 days, requires push notification setup)

#### [TASK-005] Drag-and-Drop Reordering
- **Suggestion**: Drag to reorder task priority
- **Impact**: Quick prioritization
- **Effort**: Low (1 day)

### LOW Priority

#### [TASK-006] Task Sharing Between Family
- **Suggestion**: Assign tasks to family members

#### [TASK-007] Task Notes/Comments
- **Suggestion**: Add notes field to tasks

---

## 👨‍👩‍👧‍👦 6. FAMILY MODE

### HIGH Priority

#### [FAM-001] Family Activity Feed
- **Current State**: No visibility into family activity
- **Suggestion**: Add activity feed showing:
  - "Wife added $500 to Joint Savings"
  - "Husband completed 'Exercise' streak: 30 days!"
- **Impact**: Family connection, accountability
- **Effort**: Medium (3-4 days)

#### [FAM-002] Spending Approval Workflow
- **Suggestion**: For purchases over threshold:
  - Request spouse approval
  - Push notification
  - Approve/Deny flow
- **Impact**: Joint financial decisions
- **Effort**: High (1 week)

### MEDIUM Priority

#### [FAM-003] Shared Task Lists
- **Suggestion**: Family-scoped tasks (grocery list, chores)
- **Impact**: Household coordination
- **Effort**: Medium (2-3 days)

#### [FAM-004] Family Dashboard Widget
- **Suggestion**: Overview of family finances on dashboard
- **Impact**: Quick family status check
- **Effort**: Low (1-2 days)

### LOW Priority

#### [FAM-005] Family Chat/Notes
- **Suggestion**: Simple shared notes between family members

#### [FAM-006] Child Accounts (Parental Controls)
- **Suggestion**: Teen-appropriate limited access mode

---

## ⚙️ 7. SETTINGS & ACCOUNT

### HIGH Priority

#### [SET-001] Account Profile Photo
- **Current State**: No profile customization
- **Suggestion**: Allow profile photo upload
- **Impact**: Personal touch, family identification
- **Effort**: Low (1-2 days)

### MEDIUM Priority

#### [SET-002] Notification Preferences Granularity
- **Current State**: Basic notification toggles
- **Suggestion**: Per-feature notification control:
  - Finance alerts: On/Off
  - Task reminders: On/Off
  - Family activity: On/Off
- **Effort**: Low (1 day)

#### [SET-003] Data Export (GDPR)
- **Suggestion**: "Download my data" feature
- **Impact**: Privacy compliance
- **Effort**: Medium (2 days)

#### [SET-004] Currency Preference
- **Suggestion**: Set preferred display currency for all views
- **Effort**: Low (1 day)

### LOW Priority

#### [SET-005] First Day of Week Preference
- **Suggestion**: Sunday vs Monday week start

---

## 🚪 8. ONBOARDING & USER JOURNEY

### HIGH Priority

#### [ONB-001] Invitation Email Enhancement
- **Current State**: Basic welcome email
- **Suggestion**: 
  - Branded HTML email template with logo
  - Quick start guide
  - Video walkthrough link
- **Impact**: Professional first impression
- **Effort**: Low (1 day, template design)

#### [ONB-002] Family Invite Flow Improvement
- **Current State**: Email-based invite from Settings
- **Suggestion**: 
  - QR code invite (scan to join)
  - SMS invite option
  - Copy link to share
- **Impact**: Easier family onboarding
- **Effort**: Medium (2-3 days)

#### [ONB-003] Progressive Onboarding
- **Current State**: 3-step onboarding then done
- **Suggestion**: Milestone-based guidance:
  - After 5 transactions: "Great start! Set your first budget?"
  - After 7-day streak: "You're on fire! Enable notifications?"
- **Impact**: Feature discovery over time
- **Effort**: Medium (3 days)

### MEDIUM Priority

#### [ONB-004] Demo Mode / Sandbox
- **Suggestion**: Try the app without creating account
- **Impact**: Reduce signup friction
- **Effort**: Medium (2-3 days)

#### [ONB-005] Import from Bank Statement
- **Suggestion**: Upload CSV to seed initial transactions
- **Impact**: Faster data population
- **Effort**: Medium (2 days)

#### [ONB-006] Re-Onboarding Option
- **Suggestion**: "Show me around again" in Settings
- **Impact**: Refresh users on features
- **Effort**: Low (half day)

### LOW Priority

#### [ONB-007] Personalization Questions
- **Suggestion**: Ask goals during onboarding to customize experience

#### [ONB-008] Progress Indicator Dashboard Widget
- **Suggestion**: Show account setup completion percentage

---

## 🎯 9. BRAND & MARKETING

### HIGH Priority

#### [BRAND-001] Marketing Landing Page
- **Current State**: No public marketing site
- **Suggestion**: Create `anchor-os.dev` or `anchor.app`:
  - Hero with value proposition
  - Feature showcase
  - Testimonials
  - Pricing (Free tier)
- **Impact**: User acquisition channel
- **Effort**: High (2-3 weeks, separate project)

#### [BRAND-002] App Icon & Splash Screen Polish
- **Current State**: Basic PWA icons
- **Suggestion**: Professional app icon set:
  - iOS home screen icon
  - Android adaptive icon
  - Splash screen with animation
- **Impact**: First impression quality
- **Effort**: Low (design + 1 day implementation)

### MEDIUM Priority

#### [BRAND-003] In-App Changelog
- **Current State**: CHANGELOG.md only
- **Suggestion**: "What's New" modal on version update
- **Impact**: Feature awareness
- **Effort**: Low (1 day)

#### [BRAND-004] Social Sharing Templates
- **Suggestion**: "Share your streak" with branded graphics
- **Impact**: Organic marketing
- **Effort**: Medium (2 days)

### LOW Priority

#### [BRAND-005] Referral Program
- **Suggestion**: "Invite 3 friends, get premium features"

#### [BRAND-006] Press Kit / Media Assets
- **Suggestion**: Downloadable logos, screenshots, copy

---

## 🆘 10. SUPPORT & HELP

### HIGH Priority

#### [HELP-001] In-App Help Center
- **Current State**: Basic "Contact Support" link
- **Suggestion**: Searchable FAQ and help articles:
  - "How do I share an account?"
  - "How do I set up MFA?"
  - Video tutorials
- **Impact**: Reduce support burden
- **Effort**: Medium (content + 3 days implementation)

### MEDIUM Priority

#### [HELP-002] Feedback Widget
- **Suggestion**: Quick feedback form in Settings:
  - Rating stars
  - Bug report
  - Feature request
- **Impact**: User voice, bug discovery
- **Effort**: Low (1-2 days)

#### [HELP-003] About Page Enhancement
- **Current State**: Minimal about page
- **Suggestion**: 
  - Team introduction
  - Mission statement
  - Privacy philosophy
  - Open source credits
- **Impact**: Trust building
- **Effort**: Low (content + 1 day)

### LOW Priority

#### [HELP-004] Keyboard Shortcut Reference
- **Suggestion**: `?` key shows shortcuts modal

#### [HELP-005] Contextual Help Tooltips
- **Suggestion**: `(?)` icons with explain popvers

---

## 📅 Prioritization Matrix

### Immediate (This Sprint)
1. **AUTH-001** - Social Sign-In (High impact, medium effort)
2. **UX-001** - Unified Color Tokens (Fixes GAP-002)
3. **FIN-002** - Transaction Search (Fixes BUG-001)
4. **UX-003** - Skeleton Loading (Quick win)

### Next Sprint
1. **AUTH-002** - Passkey Support
2. **TASK-002** - Streaks & Gamification
3. **FAM-001** - Family Activity Feed
4. **ONB-002** - Family Invite QR/Link

### Q1 2026 Goals
1. **FIN-001** - Budget Tracking
2. **BRAND-001** - Marketing Website
3. **HELP-001** - In-App Help Center
4. **ARCH-004** - Feature Flags

---

## 🗳️ Team Voting Template

| ID | Feature | Your Priority (1-5) | Notes |
|----|---------|---------------------|-------|
| AUTH-001 | Social Sign-In | | |
| AUTH-002 | Passkey Support | | |
| UX-001 | Color Token System | | |
| FIN-001 | Budget Tracking | | |
| TASK-002 | Streaks & Gamification | | |
| FAM-001 | Family Activity Feed | | |

---

**Next Steps**:
1. Team reviews and votes on priorities
2. Create Jira/Linear tickets for selected features
3. Add to PROJECT_BOARD.md backlog
4. Schedule sprint planning

---

*Generated by Anchor OS Internal PM Dashboard*
