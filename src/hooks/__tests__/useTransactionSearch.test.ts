/**
 * useTransactionSearch Hook Tests
 * 
 * TDD: Write tests FIRST before implementation (CLAUDE.md Article 2)
 * 
 * Tests the optimized search functionality with pre-built index
 * for sub-500ms performance on 1000+ transactions.
 */
// @ts-nocheck


import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTransactionSearch } from '../useTransactionSearch';
import type { AnchorTransaction } from '../../types';

// Factory function for creating test transactions
const createTransaction = (overrides: Partial<AnchorTransaction> = {}): AnchorTransaction => ({
  id: `tx-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Transaction',
  amountCents: 10000,
  type: 'expense',
  category: 'Food',
  accountId: 'acc-1',
  accountName: 'Main Account',
  currency: 'NGN',
  scope: 'personal',
  date: new Date().toISOString(),
  ...overrides,
});

// Generate large dataset for performance tests
const generateTransactions = (count: number): AnchorTransaction[] => {
  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health'];
  const titles = ['Grocery Store', 'Uber Ride', 'Netflix', 'Amazon Purchase', 'Electricity Bill', 'Gym Membership'];
  
  return Array.from({ length: count }, (_, i) => createTransaction({
    id: `tx-${i}`,
    title: `${titles[i % titles.length]} ${i}`,
    category: categories[i % categories.length],
    accountName: `Account ${i % 3}`,
  }));
};

describe('useTransactionSearch', () => {
  describe('Basic Functionality', () => {
    it('returns all transactions when search query is empty', () => {
      const transactions = [
        createTransaction({ title: 'Grocery Shopping' }),
        createTransaction({ title: 'Uber Ride' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, '')
      );

      expect(result.current.filteredTransactions).toHaveLength(2);
      expect(result.current.isSearching).toBe(false);
    });

    it('filters transactions by title match', () => {
      const transactions = [
        createTransaction({ title: 'Grocery Shopping' }),
        createTransaction({ title: 'Uber Ride' }),
        createTransaction({ title: 'Grocery Store' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'grocery')
      );

      expect(result.current.filteredTransactions).toHaveLength(2);
      expect(result.current.filteredTransactions.every(tx => 
        tx.title.toLowerCase().includes('grocery')
      )).toBe(true);
    });

    it('filters transactions by category match', () => {
      const transactions = [
        createTransaction({ title: 'Pizza', category: 'Food' }),
        createTransaction({ title: 'Uber', category: 'Transport' }),
        createTransaction({ title: 'Burger', category: 'Food' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'food')
      );

      expect(result.current.filteredTransactions).toHaveLength(2);
      expect(result.current.filteredTransactions.every(tx => 
        tx.category.toLowerCase() === 'food'
      )).toBe(true);
    });

    it('filters transactions by account name match', () => {
      const transactions = [
        createTransaction({ title: 'Payment', accountName: 'Kuda Bank' }),
        createTransaction({ title: 'Deposit', accountName: 'GTBank' }),
        createTransaction({ title: 'Transfer', accountName: 'Kuda Savings' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'kuda')
      );

      expect(result.current.filteredTransactions).toHaveLength(2);
    });

    it('returns empty array when no matches found', () => {
      const transactions = [
        createTransaction({ title: 'Grocery Shopping' }),
        createTransaction({ title: 'Uber Ride' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'nonexistent')
      );

      expect(result.current.filteredTransactions).toHaveLength(0);
      expect(result.current.isSearching).toBe(true);
    });

    it('performs case-insensitive search', () => {
      const transactions = [
        createTransaction({ title: 'GROCERY SHOPPING' }),
        createTransaction({ title: 'grocery store' }),
        createTransaction({ title: 'Grocery Market' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'GrOcErY')
      );

      expect(result.current.filteredTransactions).toHaveLength(3);
    });

    it('sets isSearching to true when query is not empty', () => {
      const transactions = [createTransaction({ title: 'Test' })];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'test')
      );

      expect(result.current.isSearching).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty transactions array', () => {
      const { result } = renderHook(() => 
        useTransactionSearch([], 'test')
      );

      expect(result.current.filteredTransactions).toHaveLength(0);
    });

    it('handles undefined/null values in transaction fields', () => {
      const transactions = [
        createTransaction({ title: 'Valid Transaction', accountName: undefined, category: 'Transport' }),
        createTransaction({ title: undefined as unknown as string, category: 'Shopping' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'valid')
      );

      // Should not throw, should filter safely (matches title "Valid Transaction")
      expect(result.current.filteredTransactions).toHaveLength(1);
      expect(result.current.filteredTransactions[0].title).toBe('Valid Transaction');
    });

    it('handles special characters in search query', () => {
      const transactions = [
        createTransaction({ title: 'Test (special)' }),
        createTransaction({ title: 'Normal Transaction' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, '(special)')
      );

      expect(result.current.filteredTransactions).toHaveLength(1);
    });

    it('trims whitespace from search query', () => {
      const transactions = [
        createTransaction({ title: 'Grocery Shopping' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, '  grocery  ')
      );

      expect(result.current.filteredTransactions).toHaveLength(1);
    });
  });

  describe('Performance Requirements (BUG-001)', () => {
    it('filters 1000 transactions in under 500ms', () => {
      const transactions = generateTransactions(1000);
      
      const startTime = performance.now();
      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'grocery')
      );
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      
      // Must complete in under 500ms
      expect(executionTime).toBeLessThan(500);
      expect(result.current.filteredTransactions.length).toBeGreaterThan(0);
    });

    it('filters 5000 transactions in under 1000ms', () => {
      const transactions = generateTransactions(5000);
      
      const startTime = performance.now();
      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'transport')
      );
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      
      // Must complete in under 1000ms for very large datasets
      expect(executionTime).toBeLessThan(1000);
      expect(result.current.filteredTransactions.length).toBeGreaterThan(0);
    });

    it('rebuilds search index efficiently when transactions change', () => {
      const initialTransactions = generateTransactions(1000);
      
      const { result, rerender } = renderHook(
        ({ transactions, query }) => useTransactionSearch(transactions, query),
        { initialProps: { transactions: initialTransactions, query: 'grocery' } }
      );

      const firstFilterCount = result.current.filteredTransactions.length;

      // Add new transaction and rerender
      const updatedTransactions = [
        ...initialTransactions,
        createTransaction({ title: 'New Grocery Item' }),
      ];

      const startTime = performance.now();
      rerender({ transactions: updatedTransactions, query: 'grocery' });
      const endTime = performance.now();

      // Index rebuild should be fast
      expect(endTime - startTime).toBeLessThan(200);
      expect(result.current.filteredTransactions.length).toBe(firstFilterCount + 1);
    });
  });

  describe('Search Index Optimization', () => {
    it('matches partial words from the beginning', () => {
      const transactions = [
        createTransaction({ title: 'Grocery Shopping' }),
        createTransaction({ title: 'Great Food' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'gro')
      );

      // Should match "Grocery" but not "Great"
      expect(result.current.filteredTransactions).toHaveLength(1);
      expect(result.current.filteredTransactions[0].title).toBe('Grocery Shopping');
    });

    it('matches multiple words in query', () => {
      const transactions = [
        createTransaction({ title: 'Grocery Shopping at Store' }),
        createTransaction({ title: 'Grocery Market' }),
        createTransaction({ title: 'Shopping Mall' }),
      ];

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'grocery shopping')
      );

      // Should match transaction with both words
      expect(result.current.filteredTransactions).toHaveLength(1);
      expect(result.current.filteredTransactions[0].title).toBe('Grocery Shopping at Store');
    });
  });

  describe('Result Count', () => {
    it('provides accurate result count', () => {
      const transactions = generateTransactions(100);

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'food')
      );

      expect(result.current.resultCount).toBe(result.current.filteredTransactions.length);
    });

    it('returns 0 count for no matches', () => {
      const transactions = generateTransactions(100);

      const { result } = renderHook(() => 
        useTransactionSearch(transactions, 'xyznonexistent')
      );

      expect(result.current.resultCount).toBe(0);
    });
  });
});
