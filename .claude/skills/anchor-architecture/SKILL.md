---
name: anchor-architecture
description: Deep domain context for Anchor OS architecture. Use when working on feature modules, service layer, cross-cutting concerns, or understanding system patterns.
---

# Anchor OS Architecture

## Feature Module Pattern
Each feature lives in `src/features/{feature}/` with: View component, `components/` subdirectory, `hooks/` subdirectory. Views must have error boundaries (ARCH-002).

## Service Layer
`src/services/` — AccountService, TransactionService, TransferOperations, AuditService. Services handle business logic; hooks orchestrate UI state.

## Database Access
ALL operations through `src/utils/secureDb.ts`. This enforces security rules, user scoping, and audit logging. Never import Firestore directly.

## Shared Hooks
`src/hooks/` — useFinanceService, useCommitmentService, useFamilySharing, useSharedAccounts. These orchestrate service calls and manage loading/error states.

## Design System
`packages/design-system/` — Badge, Card, Stack, Surface, Skeleton. Use these primitives; don't create ad-hoc styled components.

## Cloud Functions
`functions/src/` — Recurring transaction processing, reminders, family invitation handling, diagnostics. Functions use admin SDK with elevated privileges for cross-user data access.

## Fabric (Suggestion System)
`src/features/fabric/FabricSuggestionManager.tsx` orchestrates contextual suggestions. `src/hooks/useFabricSuggestions.ts` generates them. Dependency fabric ensures features only appear when prerequisites are met.

## Key Files
- `src/utils/secureDb.ts` — Database gateway
- `src/contexts/AuthContext.tsx` — Authentication state
- `src/contexts/ThemeContext.tsx` — Dark/light mode
- `firebase.json` — Hosting, functions, firestore rules config
