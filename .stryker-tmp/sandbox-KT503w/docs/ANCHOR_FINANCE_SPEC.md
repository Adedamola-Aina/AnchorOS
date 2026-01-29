# Anchor Finance Module Specification

> "The application should feel like an anchor. Calm. Stable. Trustworthy. Never flashy. Never manipulative."

## 1. The Soul of the Application
- **Philosophy**: Personal operating system. Context-aware, permission-aware, behavior-aware.
- **Tone**: Honest, clear, quietly helpful.
- **Core Directive**: Prioritize human behavior over technical convenience.

## 2. Dependency Fabric (The "What Before How")
- **Authentication**: Gatekeeper for everything.
- **Email Verification**: Required for explicit trust actions (Sending Invites, Email Notifications).
  - *UX*: Explain *why* verification is needed when blocking an action.
- **Accounts**: The "Container".
  - *Empty State*: Welcoming, explains value, single "Create Account" call to action.
- **Transactions**:
  - *Dependency*: One account for Income/Expense, **Two** accounts for Transfer.
- **Trends**:
  - *Dependency*: Data existence. Handle "new account" state gracefully (hide or explain).
- **Family Mode**:
  - *Flow*: Verified Email -> Send Invite -> Recipient Accepts -> Owner Shares Accounts.
  - *State*: "Accepted" != "Access Granted". Owner must toggle sharing.
- **Notifications**:
  - *Dependency*: Shared Account Activity -> Notification generated.
  - *Delivery*: Inline first. Email overflow *only if* preferences enabled + email verified.

## 3. The Account Experience
- **Navigation**: Finance Tab -> Account Cards.
  - *Card*: Name, Balance, Type, Family Indicator (if shared).
- **Account Detail View**: Self-contained environment.
  - *Context*: Transaction creation here relies on **implicit** source account. No account selector needed.
  - *Content*: History, Trends, Recurring Payments.
- **Global History**: "Single Source of Truth". All transactions, filterable.

## 4. Transfers (Special Handling)
- **Logic**: Atomic operation creating **two linked transactions** (Source Debit + Destination Credit).
- **Integrity**: Editing/Deleting one updates/removes the other.
- **UX**: Prevent same source/dest selection. Guidance if only 1 account exists.

## 5. Family Invitation Journey
1. **Initiate**: Check Owner Verified Email -> Send Invite (Unique Token).
2. **Accept**: Click Link -> Login/Register -> Link Users.
3. **Share**: Owner toggles specific accounts in Settings.
4. **Collaborate**: Invitee sees shared account (marked relative to owner).
5. **Revoke**: Unsharing removes access immediately. History remains.

## 6. Notification System (Shared Awareness)
- **Trigger**: Action by "other" user on shared account.
- **Format**: Human-readable summary (e.g., "Sarah added Groceries - $45.00").
- **UI**: Slim, actionable, dismissible banner (Max 4 inline).
- **State**: **Per-user dismissal**.
- **Overflow**:
  - If >4, queue for email digest.
  - *Grouping*: Consolidate bursts of activity ("5 transactions added").
  - *Frequency*: Instant/Daily/Weekly preference.

## 7. 30-Day Trend Visualization
- **Data**: Income vs Spending.
- **Format**: Grouped Columns (4 Weeks).
  - Green Bar (Income) vs Red/Coral Bar (Spending).
  - Net difference annotation (+/- $X).
- **Interaction**: Tap bar -> Filter history to that week.

## 8. Dashboard ("Life at a Glance")
- **Goal**: "How am I doing right now?"
- **Components**:
  - **Net Worth Snapshot**: Sum of all accounts.
  - **Cash Flow (7-Day)**: Income vs Expense + Momentum (Better/Worse than last week).
  - **Asset Distribution**: Concentration/spread metric.
  - **Recent Activity**: Mixed stream from all accounts.
  - **Productivity Score**: (If commitments exist) Trend of follow-through.

## 9. Error Handling & Integrity
- **UX**: "Errors are not the user's fault."
  - Network -> Retry.
  - Validation -> Specific, highlighted fix.
  - Prerequisite -> Guide to resolution (e.g., "Verify Email").
- **Concurrency**:
  - Database Transactions for multi-record updates (Transfers).
  - Atomic notification creation.
- **Deletion**:
  - Accounts: Soft delete (Archive). Warn about orphan transactions/access loss.
  - User: Hard delete (Severe).

## 10. Human Experience
"The application never lectures. It never celebrates superficially. It is a tool that amplifies intention."
