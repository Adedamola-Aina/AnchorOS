# Changelog

All notable changes to Anchor OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-01-29

### Fixed

#### Architecture & Reliability
- **Transaction Form Interactivity**: Fixed z-index stacking issue causing unresponsive inputs in Account Details view; unlocked "From" account selection.
- **BUG-015 (Real-time Updates)**: Fixed account balance latency by correctly awaiting Firestore operations and implementing optimistic updates.
- **BUG-016 (Exchange Rates)**: Fixed cross-currency transfers ignoring calculated exchange rates in `TransferOperations`.

### Added

#### Finance Features
- **FIN-003: Recurring Transactions**:
  - **Automation**: Scheduled Cloud Function runs daily to process recurring rules.
  - **UI**: Added "Make Recurring" toggle to Transaction Form with Frequency (Weekly/Monthly/Yearly) and Interval support.
  - **Management**: New "Recurring" tab in Finance View to pause, resume, and delete recurring rules.

#### Architecture & Brand Sprint (2026-01-29)
- **ARCH-007: Optimistic Updates**: Created `useOptimisticMutation` hook with automatic rollback; applied to all recurring transaction mutations.
- **ARCH-012: Performance Benchmarking**: Added `src/benchmarks/` with Vitest bench; `npm run test:bench` script.
- **ARCH-014: Bundle Analysis**: Added `rollup-plugin-visualizer`; `npm run build:analyze` generates `dist/stats.html`.
- **ARCH-015: Architecture Decision Records**: Created `docs/adr/` with template and first ADR (Shared Component Library).
- **ARCH-016: Telemetry Tracing**: Created `TelemetryService` in `src/services/telemetry/` with `trace()`, `logEvent()`, `createTracer()`.
- **BRAND-002: App Icon Polish**: Generated premium anchor PWA icon (`public/pwa-512x512.png`).

#### Transaction History UI Harmonization
- **Unified Transaction Components**: Finance page and Account Detail view now use the same `TransactionItem`/`SwipeableTransactionItem` components
- **Mobile Swipe Actions**: Edit/delete icons hidden on mobile since swipe gestures handle these actions (swipe left = delete, swipe right = edit)
- **Dark Mode Edge Fix**: Fixed white edges showing on rounded corners in dark mode (`Card` now uses `dark:border-slate-700 dark:bg-slate-900/95`)
- **Transaction Spacing**: Reduced gap between transaction cards from `pb-4` to `pb-2` for denser, cleaner lists
- **Empty State Fix**: Removed excessive `min-h-[300px]` on empty transaction list to prevent unnecessary scroll space

#### Finance UI Refinements
- **Centered Layout**: Aligned transaction amounts with titles for better visual balance
- **Pill Badges**: Converted metadata (Category, Family, Backdated) to distinct visual pills
- **End of List**: Added "End of list" indicator to Transaction lists
- **Unified Components**: Migrated Account Details to use the main `VirtualTransactionList` for consistency
- **Virtual List Stacking Fix**: Resolved critical regression where transactions stacked on mobile. Fixed virtualization offset calculation.
- **UX-017**: Independent transaction scrolling (container-based) for app-like feel. Height constrained to `calc(100vh - 320px)`.

#### Commitments Task Box Sizing
- **Compact Task Items**: Reduced padding from `p-4` to `p-3`, smaller toggle buttons (`p-1.5` from `p-2`)
- **Inline Layout**: Task title and badges now display inline for more compact view
- **Consistent Actions**: Edit/delete buttons use same pattern as transactions (hover-only on desktop)

### Removed

#### OLED Theme Option
- **Removed OLED theme variant** - Did not provide meaningful value over standard dark mode
- **Files Updated**: 
  - `ThemeToggle.tsx` - Simplified to light/dark only
  - `AppearanceSettings.tsx` - Updated UI and description
  - `App.tsx` - Removed OLED class handling
  - `MainLayout.tsx` - Removed `oled:` Tailwind classes
  - `AuthView.tsx` - Removed `hideOled` prop usage
  - `tailwind.config.js` - Removed OLED variant plugin
  - `types/index.ts` - UserProfile.theme now `'light' | 'dark'`
- **Tests**: 434 passing (no regressions)

### Added

#### Mobile Optimization Phase 2
- **iOS Keyboard Avoidance (BUG-002 Fix)**: New `useKeyboardAvoidance` hook using visualViewport API to auto-scroll focused inputs into view when virtual keyboard appears
- **Full-Screen Modals on Mobile**: Updated `Modal.tsx` with `fullScreenMobile` prop (default: true) - modals now take full screen on mobile with safe area padding
- **44px Touch Targets**: Verified all Button variants have minimum 44px height on mobile (per Apple HIG / WCAG 2.5.5)

### Fixed

#### Mobile UI Bugs (iPhone 15 Pro)
- **Account Edit Buttons Hidden**: Renamed input/buttons now stack vertically on mobile with "Save"/"Cancel" labels
- **Settings 2FA Alignment**: 2FA section now centers on mobile with improved "Setup 2FA" button styling  
- **Settings Contact Button**: "Send Message" button now centers and takes full width on mobile

### Fixed

#### Fabric AI v1.5 - Data Wiring (GAP-001)
- **Fabric Suggestion Pre-fill**: Clicking "Record Transaction?" from a completed commitment now correctly pre-fills the transaction form with detected amount, category, and description
- **Navigation Enhancement**: `AnchorContext.navigateTo()` now supports URL parameters for cross-view data passing
- **Technical Details**:
  - Updated `src/context/AnchorContext.tsx` to accept optional `params` object
  - Modified `src/hooks/useFabricSuggestions.ts` to pass `amount`, `category`, `description` via query params
  - Enhanced `src/features/finance/FinanceView.tsx` to read `?action=new` and populate `prefillData`
  - Extended `src/features/finance/TransactionForm.tsx` to accept `prefillData` prop
  - Added test coverage: `src/features/finance/TransactionForm.test.tsx` (✅ Passing)

### Added

#### Internal PM Dashboard (tools/dashboard)
- **Real-time Project Dashboard**: Built internal PM dashboard at http://localhost:3001 with 6 tabs:
  - **Overview**: Sprint progress, bug count, git status, in-progress/completed tasks
  - **Environment Parity**: Dev/Staging/Prod version comparison and feature deployment status
  - **Documentation**: Freshness tracking for all docs/ files
  - **Kanban Board**: Visual PROJECT_BOARD.md representation
  - **Git Timeline**: Commit history grouped by day
  - **Feature Backlog**: 82 feature suggestions with filtering and search
- **Reliability**: PM2 process management with auto-restart, boot persistence, logging
- **Control Script**: `tools/dashboard/dashboard.sh` for start/stop/restart/status/logs

#### Codebase Audit (docs/FEATURE_SUGGESTIONS.md)
- **Comprehensive Audit**: Analyzed entire codebase across 10 verticals
- **82 Feature Suggestions**: Categorized by Architecture, Auth, UI/UX, Finance, Tasks, Family, Settings, Onboarding, Brand, Support
- **Priority Matrix**: High/Medium/Low with effort estimates and impact assessments
- **Top Candidates Identified**: AUTH-001 (Social Sign-In), FIN-001 (Budget Tracking), TASK-002 (Streaks)

#### Onboarding
- **Skip Option**: Users can now skip onboarding and explore the app first via "Skip for now" link.
- **Progress Indicator**: Added "Step X of 3" indicator with visual progress bar on all onboarding steps.
- **Account Type Selection**: Users can now choose account type (Checking, Savings, Salary, Investment) during onboarding instead of hardcoded 'checking'.

#### Dashboard
- **Interactive Widgets**: Cash Flow, Recent Activity, and Portfolio widgets now navigate to Finance when clicked.
- **Dynamic Currency**: Dashboard displays actual account currency instead of hardcoded NGN.
- **Smart Greeting**: Time-based greeting (Good morning/afternoon/evening).
- **Daily Focus Widget**: Shows incomplete daily tasks only when relevant.

#### Finance Module
- **Virtual Scrolling**: Implemented `@tanstack/react-virtual` for transaction list to handle thousands of records without performance degradation.
- **Enhanced Transfer UX**: Added clear "From" and "To" visual indicators in the transaction form.
- **Currency Conversion**: Automatic "Manual Exchange Rate" field appears when transferring between accounts of different currencies.
- **Overdraft Protection**: Real-time warning banner when a proposed transaction would result in a negative balance.
- **Custom Categories**: Replaced static category dropdown with a flexible input + datalist, allowing both preset and custom categories.

#### Authentication & Security
- **MFA Step-by-Step Wizard**: Replaced confusing single-screen MFA setup with a guided 3-step wizard (Download App → Scan QR → Verify Code).
- **Session Expiry Handling**: Users now see "Session expired" message instead of silent failures when tokens expire.
- **Client-Side Rate Limiting**: Login button locks after 5 failed attempts within 60 seconds to prevent hammering.

#### Commitments Module
- **Streak Tracking**: Added "🔥 [Count]" badge to commitment cards to gamify consistency.
- **Weekly View**: New calendar-style 7-day view for commitments.
- **View Toggles**: Added toggle buttons to switch between List and Weekly/Calendar views.
- **Reminders System**: Implemented system-wide notifications. Users now receive in-app toasts and browser notifications for task reminders, regardless of their current page.

#### Fabric v1.5 - Intelligent Suggestions
- **Smart Suggestions Hook**: New `useFabricSuggestions` hook detects financially-relevant completed commitments
- **Amount Parsing**: Automatically extracts dollar amounts ($150, NGN 5000, 50 dollars) from task titles
- **Category Detection**: Smart detection of categories (Bills, Rent, Groceries, Transportation, etc.)
- **Suggestion Toast**: Beautiful animated toast appears when completing financial tasks, with 8-second auto-dismiss
- **Command Palette Actions**: Added "Add Expense", "Add Income", "New Commitment" quick actions
- **Skeleton Components**: Loading skeletons for transactions, accounts, commitments, and dashboard widgets
- **Keyboard Shortcuts Help**: Modal showing all available keyboard shortcuts (Ctrl+K, etc.)
- **Full Integration**: FabricSuggestionManager integrated into App.tsx, suggestions trigger automatically on task completion

### Fixed
- **Dashboard Navigation**: `navigateTo` now uses React Router's `navigate()` for proper URL changes.
- **E2E Tests**: Updated `finance_regressions.spec.ts` to align with the new Transaction Form UI.
- **Settings Page**: Verified functionality of `SettingsView.tsx` via `SecuritySettings.test.tsx` (Passing).
- **Test Suite**: 219 tests passing (10 skipped with documented reasons).
- **Firestore Mocks**: Updated onSnapshot mocks to support both collection and document snapshots.

### Changed
- **Architecture**: Moved `useTaskReminders` from `CommitmentsView` to `TaskContext` to ensure global notification availability.
- **Barrel Exports**: Added comprehensive `index.ts` barrel exports to finance components for cleaner imports.
- **Documentation**: Created comprehensive `ARCHITECTURE.md` documenting layer architecture and code standards.
- **TransactionForm Refactor**: Split 477-line form into 5 smaller components (~280 lines main + focused sub-components):
  - `TransactionTypeSelector.tsx` - Type toggle (expense/income/transfer)
  - `AccountSelector.tsx` - Account selection grid
  - `TransferDetails.tsx` - Transfer-specific fields & exchange rate
  - `CategorySelector.tsx` - Category input with smart suggestions
  - `OverdraftWarning.tsx` - Overdraft risk indicator

### Performance Optimizations
- **Bundle Size Reduced**: Main bundle reduced from 360KB to 279KB (22% reduction)
- **Enhanced Code Splitting**: Separate chunks for vendor, query, virtual, recharts, and firebase
- **Firestore Query Limits**: Added limits to prevent over-fetching:
  - Transactions: 500 per month
  - Accounts: 50 maximum
  - Tasks: 100 maximum
  - Recent Transactions: 20 maximum

### Security & Code Quality Audit
- **XSS Protection**: TransactionForm now uses `containsDangerousPatterns` from validation.ts
- **Secure IDs**: Transfer linkId now uses `crypto.randomUUID()` instead of predictable `Math.random()`
- **Race Condition Fix**: TaskContext captures task data before async toggle to prevent stale closure
- **Atomic Streak Updates**: toggleTask now uses Firestore runTransaction for streak counting
- **Memory Leak Fix**: FabricSuggestionToast properly clears timer on action/dismiss
- **Null Safety**: VirtualTransactionList adds bounds check for array access
- **O(n) Deduplication**: useFinanceService now uses Map instead of Set+loop for better performance
- **Safe Date Parsing**: Transaction sorting handles both Date objects and ISO strings
- **Network Timeouts**: All finance operations now have 10s timeout via `withTimeout` wrapper
- **Category Suggestion Debounce**: 300ms debounce prevents running on every keystroke
- **Modal Accessibility**: Focus trap, ESC key handling, ARIA attributes, focus restoration

## [1.2.6] - 2026-01-19

### Added
- **MFA Security**: Full implementation of Multi-Factor Authentication (TOTP) for enhanced account security.
- **Smart Suggestions**: Intelligent prompts to record transactions after completing financial-related commitments.
- **Command Palette**: Quick navigation and action search (Ctrl+K).
- **Contact System**: New integrated contact and feedback form in settings.

### Changed
- Refined Dashboard UI with "Life at a Glance" aesthetics.
- Optimized responsive layouts for mobile, tablet, and desktop.
- Enhanced production deployment pipeline with staging verification.

### Fixed
- Stabilized E2E test suite for complex authentication and family flows.
- Resolved various UI minor regressions in dark mode.

## [1.1.0] - 2026-01-15

### Fixed
- **Critical**: Transaction recording now works correctly by setting `ownerId` on account creation
- Removed duplicate `date` field from transaction form (service sets it automatically)
- Fixed type signature mismatch in `AnchorContext` for `addTransaction`

### Added
- Password visibility toggle (Eye icon) on login/signup page
- Semantic versioning and changelog tracking
- CI/CD pipeline with automated testing and build verification

### Changed
- Consolidated source code to `anchor-os/src` directory structure
- Updated `vitest.config.ts`, `tsconfig.app.json`, and `vite.config.ts` paths

## [1.0.0] - 2026-01-01

### Added
- Initial release of Anchor OS
- Dashboard view with task overview
- Commitments management (daily, weekly, monthly tasks)
- Finance tracking with accounts and transactions
- Family Mode with spouse connection and account sharing
- Dark/Light theme support
- Firebase authentication and Firestore data storage
