# Capability Inventory (Phase 1 first pass)

Status legend: UNVERIFIED = mapped but not behaviorally verified (default for this pass).

## Top-level surfaces

| Surface | Files (git) | Notes |
|---|---|---|
| src/** | 720 | React 19 + TS strict web app (also Capacitor shell) |
| apps/ios-native | 247 | Separate native SwiftUI app (Auth, Fabric engines, Finance) — parallel to web |
| functions/src | 121 | Firebase Functions (nodejs22, codebase anchor-os-functions) |
| e2e | 35 | Playwright suites |
| config | 21 | All build/lint/firebase/rules configs |
| packages | 9 | packages/types, packages/ui (shared lib) |
| public | 12 | sw.js, manifest, messaging SW, legal pages, icons |
| android/, ios/ | — | Capacitor native shells |
| tools/ | 79 | dashboard (read-only observability), mcp-server, ci checks |


## Capability map (UNVERIFIED unless noted)

### Authentication
- Sign in/up: AuthGate, AuthView, AuthFormFields, AuthSubmitButton, PasswordStrengthMeter, context/auth/socialAuth.ts
- Passkeys/WebAuthn: features/auth/passkeyUtils.ts, usePasskeyAuth.ts; functions/src/passkeyAuth.ts, passkeyRegistration.ts
- MFA: context/auth/useMfaOperations.ts; functions/src/mfaRecovery.ts; settings InviteMfaStep, useMfaEnrollmentUI
- Recovery: MfaRecoveryApi; RecoveryCodeService (native)
- Rate limiting: useAuthRateLimit (client), functions/src/rateLimit.ts, rateLimitCallables.ts
- Session handling: AuthContext; functions/src/sessionManagement.ts; SecuritySettings/AuthSessionList
- Auth events: authEventService, functions/src/authEvents.ts, authAlertDetection; AuthEventHistory panel
- Email verification: EmailVerificationWarning, emailTemplates, emailQueue (functions)
- Social sign-in: SocialSignInButtons, useSocialSignIn; native Apple/Google coordinators

### Account lifecycle
- Onboarding: OnboardingView + Welcome/Account/Goal/Habit steps, OnboardingProgress
- Profile/settings: AuthProfileApi, SettingsView
- Account deletion: functions/src/deleteAccount.ts; DangerZone.tsx
- Data management: DataManagement.tsx

### Home / Dashboard
- DashboardWidgets.tsx, AssetAllocationWidget, BeyondBasicsChecklist (+useBeyondBasics), ProductivityScoreCard, CompletionRing, RecentActivityList

### Commitments / Tasks
- CommitmentsView (timeline/list/calendar views, filters all/daily/weekly/monthly/todo), TaskForm, EditTaskForm, TaskItem, SwipeableTaskItem, TaskList, WeeklyView, MonthCalendarView
- Ops: add/update/delete/toggle via TaskContext + useCommitmentService; CommitmentApi, CommitmentResetApi, useCommitmentReset, useCommitmentBadge, useTaskReminders, useCommitmentOfflineSync
- Query layer: TaskQueryApi, hooks/queries/useTaskQueries
- Known stubs: Focus mode ("coming soon" toast), export ("next update" toast) — F-01

### Finance
- FinanceView + routes (FinanceAccountsRoute, AccountDetailsContainer/View)
- Accounts: AccountForm, AccountCard(s), CardArtwork/ColorPickers, CardStack, reordering, account artwork storage (Storage)
- Transactions: TransactionForm (transfer support), SwipeableTransactionItem, VirtualTransactionList, TransactionHistorySection, ActivityFeed, TransferDetails, TransactionTypeSelector, CategorySelector
- Services: FinanceService, AccountService, TransactionService, LedgerService, TransferOperations, TransactionUpdateOps, CategoryService, FieldEncryption, financeTypes
- Recurring: RecurringApi, useRecurringQueries/useRecurringMutations, RecurringOptions, functions/src/recurring*.ts
- Bills/reminders: FinanceBillsSection, UpcomingBillsPanel, billReminderScheduler/billReminders + reminder* pipeline (claim, dedupe, batching, routing, delivery, token cleanup, preferences)
- Bank link (Mono): LinkBankAccount, useBankConnection; functions bankLink/bankSync/bankSyncConnection/bankUnlink/bankWebhook/webhookHandlers, mono/ client+mapper
- Shared/family finance: SharedAccountSubscriptionsApi, sharedTransactions (functions), SharePermissionPicker, SharedActivitySection, useSharedAccounts, finance/utils/permissions.ts
- Insights/charts: MonthlyInsight, InsightCards, NetWorthCards, SpendingTrendsChart, OverdraftWarning, utils/insights

### Family Mode / Sharing
- FamilyConnectionApi, FamilyInvitationApi, FamilyNotificationApi; useFamilySharing
- Functions: familyConnection(Confirm), familyDisconnect, familyInvitationValidation, familyInvitations, familySharing, familyTriggers, familyMigration (001_family_v2)
- Settings: FamilySettingsV2, InviteFamilyMember, InviteEmailStep, InviteMfaStep, FamilySettingsStates
- Onboarding: AcceptInviteView, InviteCodeEntry, InviteDetails, InviteStatusDisplay

### Fabric / Anchor AI
- Context: FabricContext, fabric/useFabricInitialization, useFabricLiveSync
- Engines: FabricService, QueryEngine, IntentParser, InsightsEngine, PredictionsEngine, DailyBriefingEngine, WeeklyReportEngine, MonthlyReviewEngine, ProactiveQuestionEngine, BehavioralEngine, AmbientContext, ScenarioCalculator, SubscriptionDetector
- UI: FabricView, useFabricView, FabricPredictionsSection, FabricUpcomingCard, FabricWeeklySnapshotSection, MonthlyReviewModal, transparency route
- Functions: fabricNudges, registries/fabric.ts

### Settings
- SettingsView + SectionNav; panels: AppearanceSettings, AccessibilityControls, AnchorAISettings (+KnowledgePanel), SecuritySettings(+Parts), AuthSessionList, AuthEventHistory, DataManagement, DangerZone, EmailChangeForm, EmailVerificationWarning, ReauthModal, NotificationSettings, NotificationCategoryToggles, FamilySettingsV2, DeveloperTools, AwaitingConfirmationCard, PendingConfirmation

### Notifications
- NotificationContext(+Definition), usePushNotifications, useAccountNotifications, PushTokenApi, AccountNotificationsApi, fcmTokenService, FamilyNotificationBanner, finance NotificationBanner, notificationStyles
- public/firebase-messaging-sw.js; functions/src/notifications.ts, reminder* pipeline

### Design / UI
- Shared: Modal, ConfirmationModal, ActionSheet, PopoverMenu, SegmentedControl, ToggleSwitch, DatePickerSheet, TimeWheelPicker, InlineDatePicker, CommandPalette, ErrorBoundary, FeatureErrorBoundary, OfflineIndicator, EnvironmentBanner, AnchorLoadingSpinner, Skeletons, StateIllustration, ContactModal, ThemeToggle
- Mobile: BottomNavigation + AnimatedNavIcons, PullToRefresh, SwipeableRow, useSwipeGesture, useHaptic, useKeyboardAvoidance, useIOSKeyboardFix, useAndroidBackButton
- Tokens: src/styles, src/index.css, config/tailwind.config.js, docs/DESIGN_TOKENS.md, animations/microInteractions.ts

### PWA / Native
- public/sw.js (caches '/'+index.html+favicon+manifest; versioned cache name; firebase messaging), sw-register.js, boot-splash-failsafe.js, manifest.webmanifest, InstallPrompt.tsx
- capacitor.config.ts; android/, ios/ shells; apps/ios-native SwiftUI app (separate full implementation: Auth+MFA+passkeys, Fabric engines, Finance views, biometric lock, session timeout)

### Cross-cutting
- Analytics/telemetry: analytics/contract.ts (+gates), services/telemetry, ExperimentService
- Error handling: utils/error (captureError), ErrorBoundary, /500 route
- State/query: queryClient (react-query + IndexedDB persist; tasks/finance excluded from dehydration), persister, AnchorContext, FinanceContext, TaskContext, NotificationContext
- Data access: src/utils/secureDb.ts (mandated gateway), AuditService, deviceAttestation
- Feature flags: features/flags (fabric_suggestions, anchor_ai_enabled — both default-on, 100% rollout, all envs)
- Seeder: src/utils/seeder.ts (dev/demo data seeding via DevToolActions)

### Backend / data / security
- Firestore rules: config/firestore.rules (392 lines); Storage rules: config/storage.rules (51 lines); indexes: config/firestore.indexes.json
- Rules tests: src/__tests__/firestore-rules.{core,family,fabric,security}.emulator.ts, storage-rules.emulator.ts (via config/vitest.rules.config.ts + emulator)
- Functions registries: auth, bank, fabric, family, finance, infra, notifications, passkey, security + callableRegistry/callableContracts; rate limiting, quotaMonitor, deviceAttestation, audit.ts, tracing, coldStartProfiler, warmUp, health, migrations framework

### CI
- .github/workflows (18 files), husky hooks, commitlint, stryker mutation configs, lighthouse CI

- Pagination: financePagination

## Web routes

- `/` MarketingLanding (public)
- `/login` AuthGate → dashboard redirect
- `/500` ServerErrorView
- `/accept-invite` AcceptInviteView (public, invite flow)
- `/*` AuthGate → AuthenticatedAppShell: `dashboard`, `commitments`, `fabric`, `fabric/transparency`, `finance/*`, `settings`, NotFound fallback
