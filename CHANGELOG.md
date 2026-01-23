# Changelog

All notable changes to Anchor OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-01-23

### Added

#### Finance Module
- **Virtualization**: Implemented `react-window` / `@tanstack/react-virtual` for the transaction list to handle thousands of records without performance degradation.
- **Enhanced Transfer UX**: Added clear "From" and "To" visual indicators in the transaction form.
- **Currency Conversion**: Automatic "Manual Exchange Rate" field appears when transferring between accounts of different currencies.
- **Overdraft Protection**: Real-time warning banner when a proposed transaction would result in a negative balance.
- **Custom Categories**: Replaced static category dropdown with a flexible input + datalist, allowing both preset and custom categories.

#### Commitments Module
- **Streak Tracking**: Added "🔥 [Count]" badge to commitment cards to gamify consistency.
- **Weekly View**: New calendar-style 7-day view for commitments.
- **View Toggles**: Added toggle buttons to switch between List and Weekly/Calendar views.
- **Reminders System**: Implemented system-wide notifications. Users now receive in-app toasts and browser notifications for task reminders, regardless of their current page.

### Fixed
- **E2E Tests**: Updated `finance_regressions.spec.ts` to align with the new Transaction Form UI.
- **Settings Page**: Verified functionality of `SettingsView.tsx` via `SecuritySettings.test.tsx` (Passing).

### Changed
- **Architecture**: Moved `useTaskReminders` from `CommitmentsView` to `TaskContext` to ensure global notification availability.

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
