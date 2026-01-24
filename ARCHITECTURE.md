# Anchor OS Architecture

## Overview

Anchor OS is a React-based personal finance and commitment tracking application. It follows a layered architecture with clear separation of concerns.

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Pages / Views                                      │
│  Location: src/features/*/                                   │
│  Examples: FinanceView, DashboardView, CommitmentsView       │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: Features / Components                              │
│  Location: src/features/*/components/, src/components/       │
│  Examples: AccountCard, TransactionItem, Modal               │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3: Hooks                                              │
│  Location: src/hooks/                                        │
│  Examples: useFinanceService, useFamilySharing              │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4: Context / Services                                 │
│  Location: src/context/                                      │
│  Examples: AuthContext, FinanceContext, TaskContext         │
├─────────────────────────────────────────────────────────────┤
│  LAYER 5: Utilities                                          │
│  Location: src/utils/                                        │
│  Examples: formatCurrency, validation, moneyUtils           │
├─────────────────────────────────────────────────────────────┤
│  LAYER 6: Types                                              │
│  Location: src/types/                                        │
│  Examples: AnchorAccount, AnchorTransaction, UserProfile    │
└─────────────────────────────────────────────────────────────┘
```

## Dependency Rules

1. **Dependencies flow DOWN only** - A component in Layer 2 MUST NOT import from Layer 1
2. **No circular dependencies** - Use dependency injection via context if needed
3. **Types are universal** - Types from Layer 6 can be imported anywhere

## Directory Structure

```
src/
├── components/           # Shared UI components (Layer 2)
│   ├── shared/          # Common reusable components
│   └── ui/              # Base UI primitives (Button, Input)
├── context/             # React contexts (Layer 4)
├── features/            # Feature modules (Layers 1-2)
│   ├── auth/            # Authentication
│   ├── dashboard/       # Dashboard views
│   ├── finance/         # Finance management
│   ├── commitments/     # Task/commitment tracking
│   ├── onboarding/      # User onboarding
│   └── settings/        # User settings
├── hooks/               # Custom React hooks (Layer 3)
├── types/               # TypeScript types (Layer 6)
├── utils/               # Utility functions (Layer 5)
└── config/              # Configuration (Firebase, etc.)
```

## Key Design Patterns

### 1. Context-Based State Management
All global state is managed through React Context:
- `AuthContext` - User authentication and profile
- `FinanceContext` - Accounts and transactions
- `TaskContext` - Commitments and tasks
- `NotificationContext` - Toast notifications

### 2. Feature-Based Organization
Each feature is self-contained with its own:
- View component(s)
- Feature-specific components
- Tests

### 3. Validation Layer
All user input is validated using `src/utils/validation.ts`:
- Validates at write time
- Rejects malicious content
- Returns user-friendly error messages

### 4. Virtualization for Performance
Long lists use `@tanstack/react-virtual`:
- Transaction lists
- Handles thousands of items efficiently

## Testing Strategy

```
Unit Tests:        src/**/*.test.ts(x)     - Vitest
Integration Tests: src/**/*.integration.test.ts
E2E Tests:         e2e/*.spec.ts           - Playwright
```

## Code Standards

Per CLAUDE.md Development Constitution:
- **200-line rule**: No file should exceed 200 lines without justification
- **TDD**: Tests first, implementation second
- **Single Responsibility**: One file/function = one purpose
- **Explicit Types**: No `any`, use `unknown` if type is truly unknown
