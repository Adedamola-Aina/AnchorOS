# Mobile Optimization Phase 2 - Implementation Plan

**ID**: MOB-OPT-2  
**Created**: 2026-01-28  
**Status**: Phase 0 Complete - Ready for Implementation

---

## Executive Summary

This plan addresses four mobile UX improvements identified through user feedback:

1. **BUG-001** (P0): Transaction search slow on 1000+ transactions
2. **UX-008**: Pull-to-refresh gesture missing
3. **UX-009**: Transaction swipe actions missing
4. **UX-006**: Haptic feedback missing

**Total Effort**: 3-4 days  
**Target Completion**: 2026-02-02

---

## Architecture Decisions

### AD-1: Search Performance Strategy

**Decision**: Implement hybrid approach - optimized client-side search with optional server-side fallback

**Rationale**:
- Current approach: All transactions loaded, then filtered via `useMemo()` on every keystroke
- Problem: O(n) filtering on every character with 1000+ items = 3-5s latency
- Solution: Pre-build search index on data load, search against index in O(1) average case

**Implementation**:
```typescript
// Create search index once when transactions change
const searchIndex = useMemo(() => {
  const index = new Map<string, Set<string>>();
  transactions.forEach(tx => {
    // Index by first 3 chars of title, category, accountName
    const terms = [tx.title, tx.category, tx.accountName]
      .filter(Boolean)
      .flatMap(s => s!.toLowerCase().split(/\s+/));
    terms.forEach(term => {
      const prefix = term.slice(0, 3);
      if (!index.has(prefix)) index.set(prefix, new Set());
      index.get(prefix)!.add(tx.id);
    });
  });
  return index;
}, [transactions]);

// Search using index - O(1) lookup
const filteredTxIds = useMemo(() => {
  if (!debouncedSearch) return null;
  const prefix = debouncedSearch.toLowerCase().slice(0, 3);
  return searchIndex.get(prefix) || new Set();
}, [searchIndex, debouncedSearch]);
```

**Alternative Considered**: Firestore server-side search
- Requires `>=` and `<=` range queries with exact prefix matching
- Firestore doesn't support full-text search natively
- Would require Algolia/Typesense integration (out of scope)

---

### AD-2: Gesture Library Selection

**Decision**: Use native touch events, no external library

**Rationale**:
- Bundle size: Zero additional dependencies
- Control: Full control over gesture thresholds and animations
- Compatibility: Touch events have excellent browser support
- Complexity: Our gestures (swipe, pull) are simple enough

**Implementation Pattern**:
```typescript
// Core gesture detection
const useSwipeGesture = (options: SwipeOptions) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handlers = {
    onTouchStart: (e: React.TouchEvent) => {
      setStartX(e.touches[0].clientX);
      setIsSwiping(true);
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!isSwiping) return;
      setCurrentX(e.touches[0].clientX);
    },
    onTouchEnd: () => {
      const delta = currentX - startX;
      if (Math.abs(delta) > options.threshold) {
        options.onSwipe(delta > 0 ? 'right' : 'left');
      }
      setIsSwiping(false);
    },
  };

  return { handlers, offset: currentX - startX, isSwiping };
};
```

---

### AD-3: Haptic Feedback Pattern

**Decision**: Create centralized `useHaptic` hook with graceful degradation

**Rationale**:
- iOS Safari: Does NOT support `navigator.vibrate()` - must gracefully degrade
- Android Chrome: Full support for Vibration API
- Centralized hook ensures consistent patterns across app

**Implementation**:
```typescript
export const useHaptic = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const haptic = {
    light: () => isSupported && navigator.vibrate(10),
    medium: () => isSupported && navigator.vibrate(20),
    heavy: () => isSupported && navigator.vibrate(30),
    error: () => isSupported && navigator.vibrate([50, 100, 50]),
    success: () => isSupported && navigator.vibrate([10, 50, 20]),
  };

  return haptic;
};
```

---

## File Creation Plan

### New Files to Create

| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/hooks/useTransactionSearch.ts` | Optimized search with pre-built index | <100 |
| `src/hooks/useSwipeGesture.ts` | Reusable swipe gesture hook | <80 |
| `src/hooks/useHaptic.ts` | Haptic feedback patterns | <50 |
| `src/components/mobile/PullToRefresh.tsx` | Pull-to-refresh wrapper component | <150 |
| `src/components/mobile/SwipeableRow.tsx` | Swipeable list item wrapper | <150 |
| `src/hooks/__tests__/useTransactionSearch.test.ts` | Unit tests for search | <150 |
| `src/hooks/__tests__/useSwipeGesture.test.ts` | Unit tests for swipe | <100 |
| `src/hooks/__tests__/useHaptic.test.ts` | Unit tests for haptic | <50 |
| `src/components/mobile/PullToRefresh.test.tsx` | Component tests | <100 |
| `src/components/mobile/SwipeableRow.test.tsx` | Component tests | <100 |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/finance/FinanceView.tsx` | Replace inline search with `useTransactionSearch` |
| `src/features/finance/components/VirtualTransactionList.tsx` | Wrap with `PullToRefresh` |
| `src/features/finance/components/TransactionItem.tsx` | Integrate `SwipeableRow` on mobile |
| `src/context/FinanceContext.tsx` | Add `refetch` method for pull-to-refresh |
| `firestore.indexes.json` | Add composite index for transactions (if needed) |

---

## Implementation Phases

### Phase 1: Search Performance (BUG-001)

**Duration**: 1-2 days

```
Day 1 Morning:
├── Write failing tests for useTransactionSearch
├── Implement search index builder
├── Implement index-based filtering
└── Verify tests pass

Day 1 Afternoon:
├── Integrate useTransactionSearch into FinanceView
├── Add search loading state
├── Write E2E test for search performance
└── Benchmark: verify <500ms for 1000+ transactions

Day 2 (if needed):
├── Add pagination to useTransactionsQuery
├── Implement infinite scroll
└── Optimize for very large datasets (5000+)
```

### Phase 2: Pull-to-Refresh (UX-008)

**Duration**: 0.5 days

```
Morning:
├── Write failing tests for PullToRefresh component
├── Implement touch event handling
├── Add visual indicator (spinner + pull distance)
├── Integrate with FinanceView
└── Verify tests pass

Afternoon:
├── Integrate with Dashboard
├── Add haptic feedback on trigger
├── Test on iOS Safari
└── Test on Android Chrome
```

### Phase 3: Swipe Actions (UX-009)

**Duration**: 1 day

```
Morning:
├── Write failing tests for useSwipeGesture hook
├── Implement swipe detection with velocity
├── Write failing tests for SwipeableRow component
├── Implement SwipeableRow with action reveal
└── Verify tests pass

Afternoon:
├── Integrate SwipeableRow into TransactionItem
├── Implement delete confirmation modal
├── Implement undo toast with soft delete
├── Add haptic feedback on swipe trigger
└── Test on real devices
```

### Phase 4: Haptic Feedback (UX-006)

**Duration**: 0.5 days

```
Morning:
├── Write failing tests for useHaptic hook
├── Implement haptic patterns
├── Integrate into existing interactions:
│   ├── Transaction save
│   ├── Task completion
│   ├── Account selection
│   └── Error states
└── Verify tests pass and graceful degradation works
```

### Phase 5: Documentation & Verification

**Duration**: 0.5 days

```
├── Run full test suite (unit + integration + E2E)
├── Generate coverage report
├── Create walkthrough document
├── Update ROADMAP.md, FEATURE_SUGGESTIONS.md, KNOWN_ISSUES.md
├── Deploy to dev environment
├── Smoke test on real devices
└── Create PR for staging deploy
```

---

## Test Strategy

### Unit Tests (Vitest)

| Component | Test Cases |
|-----------|------------|
| `useTransactionSearch` | Index building, prefix matching, empty query, no results |
| `useSwipeGesture` | Swipe detection, threshold, velocity, cancel |
| `useHaptic` | Pattern execution, unsupported browser graceful degradation |
| `PullToRefresh` | Threshold detection, refresh trigger, loading state |
| `SwipeableRow` | Action reveal, snap-back, tap passthrough |

### E2E Tests (Playwright)

| Test | Description |
|------|-------------|
| `mobile.spec.ts` | Search performance benchmark (<500ms) |
| `mobile.spec.ts` | Pull-to-refresh triggers data reload |
| `mobile.spec.ts` | Swipe-left reveals delete, triggers confirmation |
| `mobile.spec.ts` | Swipe-right opens edit form |
| `mobile.spec.ts` | Undo toast appears after swipe delete |

### Performance Benchmarks

| Metric | Threshold |
|--------|-----------|
| Search latency (1000 txns) | <500ms |
| Search latency (5000 txns) | <1000ms |
| Swipe animation FPS | ≥60 FPS |
| Pull-to-refresh detection | <100ms |

---

## Rollback Plan

If any phase introduces regressions:

1. **Immediate**: Revert commits for that phase
2. **Investigate**: Run failing tests to identify root cause
3. **Fix Forward**: If fix is simple (<1hr), fix and re-deploy
4. **Skip Phase**: If fix is complex, skip phase and document for future sprint

---

## Dependencies

### External
- None (using native touch events)

### Internal
- `useResponsive()` hook for mobile detection
- `useNotification()` for undo toast
- React Query `refetch` for pull-to-refresh
- Existing `ConfirmationModal` for delete confirmation

---

## Approval

- [ ] Technical Review: (pending)
- [ ] Product Review: (pending)
- [ ] Ready to Begin: ✅

---

## Next Steps

1. **Begin Phase 1**: Create `useTransactionSearch` hook with TDD
2. **Deploy Index**: Add any needed Firestore indexes before code
3. **Daily Standups**: Update PROJECT_STATUS.md with progress
4. **Final Review**: Run full verification checklist before merge
