/**
 * useFabricSuggestions Tests
 * 
 * Tests for Fabric v1.5 intelligent suggestion system.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
    useFabricSuggestions,
    parseAmountFromText,
    detectCategory,
    isFinanciallyRelevant
} from '../useFabricSuggestions';
import type { AnchorTask } from '../../types';

describe('useFabricSuggestions', () => {
    describe('parseAmountFromText', () => {
        it('parses USD amounts with $ symbol', () => {
            expect(parseAmountFromText('Pay $150 for groceries')).toBe(150);
            expect(parseAmountFromText('Spent $1,500.00 on rent')).toBe(1500);
            expect(parseAmountFromText('Buy gift for $25.99')).toBe(25.99);
        });

        it('parses USD amounts with "dollars" text', () => {
            expect(parseAmountFromText('Pay 150 dollars for internet')).toBe(150);
            expect(parseAmountFromText('Spent 50 USD on gas')).toBe(50);
        });

        it('parses NGN amounts', () => {
            expect(parseAmountFromText('Pay NGN 5000 for food')).toBe(5000);
            expect(parseAmountFromText('Spent ₦10,000 on transport')).toBe(10000);
            expect(parseAmountFromText('Buy 2500 naira worth of airtime')).toBe(2500);
        });

        it('returns null for text without amounts', () => {
            expect(parseAmountFromText('Pay electricity bill')).toBeNull();
            expect(parseAmountFromText('Go grocery shopping')).toBeNull();
        });
    });

    describe('detectCategory', () => {
        it('detects Bills & Utilities', () => {
            expect(detectCategory('Pay electric bill')).toBe('Bills & Utilities');
            expect(detectCategory('Internet subscription')).toBe('Bills & Utilities');
            expect(detectCategory('Pay phone bill')).toBe('Bills & Utilities');
        });

        it('detects Rent', () => {
            expect(detectCategory('Pay rent $1500')).toBe('Rent');
            expect(detectCategory('Lease payment due')).toBe('Rent');
        });

        it('detects Groceries', () => {
            expect(detectCategory('Buy groceries')).toBe('Groceries');
            expect(detectCategory('Go to supermarket')).toBe('Groceries');
        });

        it('detects Transportation', () => {
            expect(detectCategory('Get gas for car')).toBe('Transportation');
            expect(detectCategory('Pay Uber fare')).toBe('Transportation');
        });

        it('returns General for unknown categories', () => {
            expect(detectCategory('Random task')).toBe('General');
        });
    });

    describe('isFinanciallyRelevant', () => {
        it('returns true for financial keywords', () => {
            expect(isFinanciallyRelevant('Pay the electricity bill')).toBe(true);
            expect(isFinanciallyRelevant('Buy groceries')).toBe(true);
            expect(isFinanciallyRelevant('Rent payment due')).toBe(true);
            expect(isFinanciallyRelevant('Purchase new laptop')).toBe(true);
        });

        it('returns false for non-financial tasks', () => {
            expect(isFinanciallyRelevant('Read for 30 minutes')).toBe(false);
            expect(isFinanciallyRelevant('Exercise daily')).toBe(false);
            expect(isFinanciallyRelevant('Call mom')).toBe(false);
        });
    });

    describe('useFabricSuggestions hook', () => {
        const createMockTask = (title: string): AnchorTask => ({
            id: 'task-123',
            title,
            type: 'daily',
            completed: true,
            category: 'personal',
            createdAt: new Date('2025-01-01T00:00:00Z'),
        });

        it('generates suggestion for financial task completion', () => {
            const { result } = renderHook(() => useFabricSuggestions());
            const mockNavigate = vi.fn();

            act(() => {
                result.current.onCommitmentCompleted(
                    createMockTask('Pay $150 electricity bill'),
                    mockNavigate
                );
            });

            expect(result.current.suggestions).toHaveLength(1);
            expect(result.current.suggestions[0].type).toBe('financial');
            expect(result.current.suggestions[0].metadata?.amount).toBe(150);
            expect(result.current.suggestions[0].metadata?.category).toBe('Bills & Utilities');
        });

        it('does not generate suggestion for non-financial task', () => {
            const { result } = renderHook(() => useFabricSuggestions());
            const mockNavigate = vi.fn();

            act(() => {
                result.current.onCommitmentCompleted(
                    createMockTask('Read for 30 minutes'),
                    mockNavigate
                );
            });

            expect(result.current.suggestions).toHaveLength(0);
        });

        it('dismisses suggestion correctly', () => {
            const { result } = renderHook(() => useFabricSuggestions());
            const mockNavigate = vi.fn();

            act(() => {
                result.current.onCommitmentCompleted(
                    createMockTask('Pay rent $1500'),
                    mockNavigate
                );
            });

            expect(result.current.suggestions).toHaveLength(1);
            const suggestionId = result.current.suggestions[0].id;

            act(() => {
                result.current.dismissSuggestion(suggestionId);
            });

            expect(result.current.suggestions).toHaveLength(0);
        });

        it('navigates to finance when action is called', () => {
            const { result } = renderHook(() => useFabricSuggestions());
            const mockNavigate = vi.fn();

            act(() => {
                result.current.onCommitmentCompleted(
                    createMockTask('Pay groceries $75'),
                    mockNavigate
                );
            });

            act(() => {
                result.current.suggestions[0].action();
            });

            expect(mockNavigate).toHaveBeenCalledWith('finance');
        });
    });
});
