---
name: family-mode
description: Family sharing architecture and rules. Use when working on shared accounts, invitations, net worth calculations, or any feature involving multi-user data access.
---

# Family Mode Architecture

## Core Principle
`sharedWith` array on accounts provides VISIBILITY, not OWNERSHIP. Each account has exactly ONE owner.

## Net Worth Calculation
Net worth = sum of accounts where `userId === currentUser.uid`. NEVER include accounts where user appears only in `sharedWith` array. This was anti-pattern #4 (double-counting bug).

## Invitation Flow
1. Owner initiates share via Cloud Function
2. Function generates out-of-band verification code
3. Recipient enters code to accept invitation
4. Account's `sharedWith` array is updated server-side
5. Firestore security rules grant read access to shared users

## Data Access Patterns
- Owner: full CRUD on account and its transactions
- Shared viewer: read-only access to account and transactions
- Cloud Functions (admin): cross-user data access for invitation handling

## Firestore Security Rules
Permission-aware queries enforce user boundaries. Shared users can read but not write. Owner field is immutable after creation.

## Key Files
- `src/hooks/useFamilySharing.ts` — Sharing state management
- `src/hooks/useSharedAccounts.ts` — Shared account queries
- `functions/src/` — Invitation Cloud Functions
- `docs/adr/FAMILY_SHARING_V3_*.md` — Architecture Decision Records
- `docs/SECURITY.md` — Security model documentation
