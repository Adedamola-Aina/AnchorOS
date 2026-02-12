---
name: anchor-os-context
description: Deep context about Anchor OS. Load for architecture decisions, complex features, or project background.
---

# Anchor OS

Self-hosted personal finance and commitment tracking system. TypeScript + React 19 + Vite + Tailwind + Firebase. Used daily by real people.

## Key Architecture

- **Feature modules**: `src/features/{feature}/` — each with View, components/, hooks/
- **Service layer**: `src/services/` — AccountService, TransactionService, TransferOperations, AuditService
- **Hooks**: `src/hooks/` — useFinanceService, useCommitmentService, useFamilySharing, useSharedAccounts
- **Security**: `src/utils/secureDb.ts` — ALL database operations go through this
- **Design system**: `packages/design-system/` — Badge, Card, Stack, Surface, Skeleton, etc.
- **Cloud Functions**: `functions/src/` — recurring transactions, reminders, diagnostics

## Family Sharing Architecture

- Invitations via Cloud Functions with out-of-band verification codes
- `sharedWith` array on accounts — provides VISIBILITY, not ownership
- Each account has ONE owner whose net worth includes that account
- Shared viewers can see transactions but don't count the balance in their net worth
- Permission-aware Firestore queries via security rules

## Fabric (Suggestion System)

- `src/features/fabric/FabricSuggestionManager.tsx` — orchestrates suggestions
- `src/hooks/useFabricSuggestions.ts` — generates contextual suggestions
- Dependency fabric: features only appear when prerequisites are met
- Daily forms show daily options, weekly forms show weekly options

## Dashboard Integration

The Internal PM Dashboard at `tools/dashboard/` (localhost:3001) is the single source of truth:
- Parses git commit history for bug/feature/deployment tracking
- `roadmap.json` defines planned work, git detects progress
- 40+ API endpoints for project state queries
- Auto-archival after 30 days
- Velocity tracking with predictions

## Current Version: 1.7.0

Production is on v1.7.0 (stable). Dev/Staging have bug fixes pending verification.
