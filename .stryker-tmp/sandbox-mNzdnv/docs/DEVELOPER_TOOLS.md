# DEVELOPER TOOLS REFERENCE

**Last Updated**: 2026-01-26  
**Location**: Settings → Developer Tools (Dev/Staging only)  
**Purpose**: Simulate real-world user behavior for testing

---

## 🔧 Available Tools

### 1. Seed Test Data
**Button**: `Seed Data`  
**File**: `src/utils/seeder.ts`

Generates realistic test data:

| Data Type | Count | Details |
|-----------|-------|---------|
| Accounts | 5 | Checking, Savings, Mixed currencies (USD/NGN) |
| Transactions | 60 | Expenses, Income, Transfers w/ linked pairs |
| Commitments | 11 | Daily (4), Weekly (4), Monthly (2), Todo (1) |
| Notifications | Variable | Activity notifications for shared accounts |

**Date Distribution**:
- 20 transactions: Last 7 days
- 20 transactions: 7-14 days ago
- 20 transactions: 14-30 days ago

---

### 2. Simulate Family Data
**Button**: `Simulate`  
**File**: `src/features/settings/components/DeveloperTools.tsx`

Creates mock family setup:
- Simulated spouse (Sarah)
- Family Savings account (₦5,000 shared)
- 3 notifications from spouse activity

**Use Case**: Testing family mode without needing two accounts.

---

### 3. Fix Shared Accounts
**Button**: `Fix Now`  
**Backend**: Cloud Function `fixSharedAccountScopes`

Corrects scope on all shared accounts to `family`.

**Use Case**: Data migration, fixing legacy accounts.

---

### 4. Auto-Accept Invitation
**Button**: `Auto-Accept`

Bypasses email verification for pending family invitations.

**Use Case**: Testing invite flow without email.

---

## 📋 Feature Parity Checklist

When adding a new feature, update these files:

| Feature Area | seeder.ts | DeveloperTools.tsx |
|-------------|-----------|---------------------|
| Accounts | ✅ | N/A |
| Transactions | ✅ | N/A |
| Commitments | ✅ | N/A |
| Family Mode | N/A | ✅ Simulate |
| Invitations | N/A | ✅ Auto-Accept |
| Budgets | ❌ TODO | ❌ TODO |
| Streaks | ❌ TODO | ❌ TODO |
| Reminders | ❌ TODO | ❌ TODO |

---

## 🔄 Adding New Feature Simulation

### Step 1: Update seeder.ts
```typescript
// Example: Add Budget seeding
for (let i = 0; i < 5; i++) {
    const budgetRef = doc(budgetsRef);
    batch.set(budgetRef, {
        category: 'Food',
        limitCents: 50000,
        periodType: 'monthly',
        alertAt: 0.8 // 80% warning
    });
}
```

### Step 2: Update DeveloperTools.tsx
```tsx
<div className="flex items-center justify-between mt-6 pt-6 border-t">
    <div>
        <p className="font-bold uppercase text-xs">Simulate Budgets</p>
        <p className="text-sm text-slate-500">Create sample budget limits.</p>
    </div>
    <Button onClick={handleSimulateBudgets}>
        Create Budgets
    </Button>
</div>
```

---

## 🎯 Testing Workflow

```
1. Login to Dev/Staging
2. Go to Settings
3. Scroll to Developer Tools
4. Click relevant simulation button
5. Verify feature works with simulated data
6. Run E2E tests
```

---

## 🚫 Production Safety

Developer Tools are **automatically hidden** in production:
- Component only renders when `import.meta.env.DEV` or staging
- Firebase rules prevent unauthorized data modification

---

**Related Files**:
- [seeder.ts](file:///root/anchor-os/src/utils/seeder.ts)
- [DeveloperTools.tsx](file:///root/anchor-os/src/features/settings/components/DeveloperTools.tsx)
- [SettingsView.tsx](file:///root/anchor-os/src/features/settings/SettingsView.tsx)
