# Service Layer Tests

This directory contains comprehensive unit and integration tests for the Anchor OS service layer, covering all business logic for finance operations.

## 📊 Test Coverage Summary

| Test Suite | Tests | Type | Status |
|-------------|-------|------|--------|
| [AccountService.test.ts](./AccountService.test.ts) | 20 | Unit | ✅ Passing |
| [TransactionService.test.ts](./TransactionService.test.ts) | 21 | Unit | ✅ Passing |
| [TransferOperations.test.ts](./TransferOperations.test.ts) | 16 | Unit | ✅ Passing |
| [FinanceService.test.ts](./FinanceService.test.ts) | 12 | Unit | ✅ Passing |
| [FinanceService.integration.test.tsx](./FinanceService.integration.test.tsx) | 15 | Integration | ✅ Passing |
| **Total** | **84** | - | **100%** |

**Last Updated**: 2026-01-27  
**Test Pass Rate**: 84/84 (100%)  
**Average Execution Time**: <20ms per unit test file

---

## 🚀 How to Run Tests

### Run All Service Tests
```bash
npm run test:run AccountService TransactionService TransferOperations FinanceService
```

### Run Individual Test Suites
```bash
# Unit tests (fast, mocked)
npm run test:run AccountService.test.ts
npm run test:run TransactionService.test.ts
npm run test:run TransferOperations.test.ts
npm run test:run FinanceService.test.ts

# Integration tests (requires Firebase Emulator)
npm run test:run FinanceService.integration
```

### Run Integration Tests with Emulator
```bash
# Option 1: Use helper script (recommended)
./scripts/test-with-emulator.sh

# Option 2: Manual setup
firebase emulators:start &
npm run test:integration
```

### Watch Mode (Development)
```bash
npm run test -- --watch AccountService
```

### Coverage Report
```bash
npm run test:coverage -- --include=src/services/**
```

---

## 🏗️ Test Organization

### Unit Tests (69 tests)
Fast, isolated tests that mock all external dependencies. Ideal for TDD and rapid iteration.

**AccountService.test.ts** (20 tests)
- ✅ Account creation with ownership and initialization
- ✅ Account deletion (soft delete) with notification cascade
- ✅ Account renaming with history tracking and transaction sync
- ✅ Batch chunking for 400+ transactions
- ✅ Permission enforcement (read vs manage)

**TransactionService.test.ts** (21 tests)
- ✅ Transaction creation (standard + transfers)
- ✅ Transaction deletion with balance reversal
- ✅ Transaction updates with optimistic locking
- ✅ Linked transaction handling
- ✅ Delegation to TransferOperations

**TransferOperations.test.ts** (16 tests)
- ✅ Linked transfer transaction creation
- ✅ Balance calculations for both accounts
- ✅ Cross-account ownership preservation
- ✅ Permission checks for both source and destination
- ✅ Backdated transaction handling

**FinanceService.test.ts** (12 tests)
- ✅ Facade delegation to underlying services
- ✅ Error propagation from AccountService
- ✅ Error propagation from TransactionService
- ✅ Service initialization

### Integration Tests (15 tests)
End-to-end tests using Firebase Emulator. Tests real Firestore operations and security rules.

**FinanceService.integration.test.tsx** (15 tests)
- ✅ Complete account lifecycle (create/update/delete)
- ✅ Complete transaction lifecycle (create/update/delete)
- ✅ Transfer flows with linked transactions
- ✅ Shared account permissions (manage vs read-only)
- ✅ Batch operations (500+ transactions)
- ✅ Security rule enforcement
- ✅ Cross-user data isolation

---

## 🎭 Mocking Patterns

### 1. Firebase Firestore Mocking

All unit tests use **global Firebase mocks** defined in [src/test/setup.ts](../../test/setup.ts):

```typescript
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(() => ({ id: 'mock-id', path: 'mock/path' })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
    writeBatch: vi.fn(() => ({
        update: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
        commit: vi.fn(() => Promise.resolve()),
    })),
    runTransaction: vi.fn(async (db, callback) => {
        const tx = {
            get: vi.fn(() => Promise.resolve({ 
                exists: () => true, 
                data: () => ({}) 
            })),
            update: vi.fn(),
            set: vi.fn(),
        };
        return callback(tx);
    }),
}));
```

**When to override**: Use `vi.mocked()` in specific tests to change behavior:

```typescript
it('handles database errors gracefully', async () => {
    vi.mocked(addDoc).mockRejectedValue(new Error('Database offline'));
    
    await expect(service.addAccount(userId, payload))
        .rejects.toThrow('Failed to add account');
});
```

### 2. Permission Utility Mocking

Permission checks are mocked at the module level:

```typescript
vi.mock('../../features/finance/utils/permissions', () => ({
    canAddTransaction: vi.fn((account, userId) => 
        account.ownerId === userId || account.shares?.[userId]
    ),
    canManageAccount: vi.fn((account, userId) => 
        account.ownerId === userId || account.shares?.[userId] === 'manage'
    ),
}));
```

### 3. Module Delegation Mocking

For testing delegation patterns:

```typescript
vi.mock('../TransferOperations', () => ({
    processTransferTransaction: vi.fn(),
    processStandardTransaction: vi.fn(),
}));
```

### 4. Service Method Spying

For facade tests (FinanceService):

```typescript
vi.spyOn(AccountService.prototype, 'addAccount')
    .mockImplementation(mockAccountService.addAccount);
```

---

## 📝 Test Naming Conventions

All tests follow the **behavioral naming pattern**:

```typescript
// ✅ Good: Describes behavior
it('creates linked transactions for transfers with bidirectional references')
it('soft-deletes account and notifies shared users')
it('reverses balance when deleting expense transaction')

// ❌ Avoid: Describes implementation
it('calls processTransferTransaction')
it('sets isArchived to true')
it('updates balanceCents field')
```

---

## 🧩 Test Structure (AAA Pattern)

Every test follows **Arrange-Act-Assert**:

```typescript
it('deletes account and notifies shared users', async () => {
    // Arrange - Set up test data and mocks
    const userId = 'user-123';
    const sharedUserId = 'user-456';
    const account = createMockAccount('acc-1', userId);
    account.shares = { [sharedUserId]: 'read' };
    
    // Act - Execute the function under test
    await service.deleteAccount(userId, 'John Doe', account);
    
    // Assert - Verify the expected outcomes
    expect(mockBatch.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ isArchived: true })
    );
    expect(mockBatch.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
            type: 'system',
            message: expect.stringContaining('deleted by the owner')
        })
    );
});
```

---

## ⚡ Performance Guidelines

### Unit Tests
- **Target**: < 100ms per test file
- **Current**: ~14ms average (well below target)
- **Why**: Unit tests should be fast for rapid TDD workflow

### Integration Tests
- **Target**: < 1s per test (emulator overhead)
- **Current**: ~50-100ms per test
- **Why**: Emulator operations are slower than mocks

**If tests are slow**:
1. Check for unnecessary `await` statements
2. Reduce mock setup complexity
3. Verify Firebase mocks are properly configured
4. Ensure beforeEach clears state efficiently

---

## 🐛 Common Patterns & Solutions

### Testing Batch Operations

```typescript
it('handles batch chunking for 400+ transactions', async () => {
    const largeTxSet = Array.from({ length: 500 }, (_, i) => 
        createMockTransaction(`tx-${i}`, 'expense', 1000)
    );
    
    vi.mocked(getDocs).mockResolvedValue({
        docs: largeTxSet,
        size: 500,
    } as any);
    
    await service.renameAccount(userId, userName, account, 'New Name');
    
    // Firestore batch limit is 500, so expect 2 batches (400 + 100)
    expect(mockBatch.commit).toHaveBeenCalledTimes(2);
});
```

### Testing Error Propagation

```typescript
it('propagates AnchorError from underlying service', async () => {
    const error = new AnchorError('Account not found', 'VALIDATION');
    mockAccountService.deleteAccount.mockRejectedValue(error);
    
    await expect(service.deleteAccount(userId, userName, account))
        .rejects.toThrow(AnchorError);
    
    await expect(service.deleteAccount(userId, userName, account))
        .rejects.toThrow('Account not found');
});
```

### Testing Optimistic Locking

```typescript
it('uses runTransaction for optimistic updates', async () => {
    await service.updateTransaction(userId, txId, accountId, updates, [account]);
    
    expect(runTransaction).toHaveBeenCalled();
    
    // Verify transaction callback
    const txCallback = vi.mocked(runTransaction).mock.calls[0][1];
    const mockTx = {
        get: vi.fn(() => Promise.resolve({ 
            exists: () => true,
            data: () => mockTransaction 
        })),
        update: vi.fn(),
    };
    
    await txCallback(mockTx);
    expect(mockTx.update).toHaveBeenCalled();
});
```

---

## 📚 Additional Resources

- **Testing Strategy**: See [docs/TESTING_STRATEGY.md](../../../docs/TESTING_STRATEGY.md) for global patterns
- **Error Handling**: See [docs/ERROR_HANDLING.md](../../../docs/ERROR_HANDLING.md) for AnchorError patterns
- **Walkthrough**: See ARCH-003 walkthrough artifact for implementation details
- **Vitest Docs**: https://vitest.dev/
- **Firebase Emulator**: https://firebase.google.com/docs/emulator-suite

---

## 🎯 Coverage Goals

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Statement Coverage | 80%+ | **95.13%** | ✅ **Exceeds (+15%)** |
| Branch Coverage | 70%+ | **77.68%** | ✅ **Exceeds (+7%)** |
| Function Coverage | 90%+ | **100%** | ✅ **Perfect** |
| Line Coverage | 80%+ | **96.36%** | ✅ **Exceeds (+16%)** |
| Integration Tests | 10+ | 15 | ✅ Exceeds |

**Coverage by File**:
- **FinanceService.ts**: 100% across all metrics (perfect score)
- **TransferOperations.ts**: 100% line coverage
- **AccountService.ts**: 96.55% line coverage
- **TransactionService.ts**: 94.73% line coverage

---

## 🚀 Future Enhancements

See [FEATURE_SUGGESTIONS.md](../../../docs/FEATURE_SUGGESTIONS.md) for planned improvements:

- **ARCH-010**: Test Coverage Reporting (CI integration)
- **ARCH-011**: Mutation Testing (Stryker.js)
- **ARCH-012**: Performance Benchmarking
- **ARCH-013**: Expanded Integration Tests (concurrent scenarios)

---

**Maintained by**: Anchor OS Team  
**Last Review**: 2026-01-27  
**ARCH Initiative**: ARCH-003 Service Layer Tests
