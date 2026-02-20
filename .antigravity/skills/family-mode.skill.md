# Family Mode — On-Demand Skill

Load this when working on shared account access, family invitations, or multi-user features.

## Core Principle (FAMILY-01)
Ownership ≠ Visibility.

- Wife and sister-in-law have controlled access to SPECIFIC applications only
- Shared accounts appear in family members' views but are NOT counted in their net worth
- The owner's personal financial totals NEVER include shared account balances of others
- Family invitation system uses secure tokens (no direct UID sharing)

## Data Model
- `sharedWith: string[]` — UIDs of users who can VIEW the account
- `ownerId: string` — the single owner whose net worth includes this account
- Family members query: `where('sharedWith', 'array-contains', currentUserUid)`
- Net worth calculation MUST filter: `where('ownerId', '==', currentUserUid)`

## UI Separation
- Family-shared accounts display with a "Shared" badge
- Financial summary and net worth widgets filter on ownerId, not sharedWith
- Family members can VIEW transactions but cannot MUTATE them (read-only)

## Access Control (Tailscale ACL)
- Wife and sister-in-law have tag:family — ACL restricts to specific service ports only
- No cross-contamination of personal data between family accounts

## Known Bug to Watch
- Previous bug: shared account balances were incorrectly added to viewer's net worth
- Fix: all aggregation queries MUST use ownerId filter, not just uid match
