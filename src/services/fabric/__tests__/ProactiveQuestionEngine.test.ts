import { describe, expect, it } from 'vitest';
import {
  generateProactiveQuestion,
  wasQuestionShownRecently,
} from '../ProactiveQuestionEngine';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ProactiveQuestionState,
  UserPattern,
} from '../../../types';

function daysAgo(n: number, from: Date = new Date('2025-06-15T12:00:00Z')): string {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const NOW = new Date('2025-06-15T12:00:00Z');

function makePattern(overrides: Partial<UserPattern> = {}): UserPattern {
  return {
    id: 'pat-1',
    trigger: { type: 'transaction_recorded', category: 'Food' },
    followUpAction: { type: 'review_budget', category: 'Food' },
    frequency: 5,
    confidence: 0.7,
    lastOccurred: daysAgo(5),
    averageDelayMs: 1000,
    dismissed: 0,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(5),
    ...overrides,
  };
}

function makeTransaction(overrides: Partial<AnchorTransaction> = {}): AnchorTransaction {
  return {
    id: 'tx-1',
    title: 'Groceries',
    amountCents: 5000,
    type: 'expense',
    category: 'Food',
    accountId: 'acc-1',
    currency: 'NGN',
    scope: 'personal',
    date: daysAgo(1),
    ...overrides,
  } as AnchorTransaction;
}

function makeCommitment(overrides: Partial<AnchorTask> = {}): AnchorTask {
  return {
    id: 'task-1',
    title: 'Exercise',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date(daysAgo(30)),
    ...overrides,
  } as AnchorTask;
}

function makeAccount(overrides: Partial<AnchorAccount> = {}): AnchorAccount {
  return {
    id: 'acc-1',
    name: 'Checking',
    type: 'checking',
    currency: 'NGN',
    balanceCents: 500_00,
    color: '#000',
    scope: 'personal',
    ...overrides,
  } as AnchorAccount;
}

describe('wasQuestionShownRecently', () => {
  it('returns false when lastState is null', () => {
    expect(wasQuestionShownRecently(null, 'missed_habit', NOW)).toBe(false);
  });

  it('returns false when questionType differs', () => {
    const state: ProactiveQuestionState = {
      question: 'test',
      questionType: 'category_spike',
      shownAt: daysAgo(1),
    };
    expect(wasQuestionShownRecently(state, 'missed_habit', NOW)).toBe(false);
  });

  it('returns true when same type shown within 7 days', () => {
    const state: ProactiveQuestionState = {
      question: 'test',
      questionType: 'missed_habit',
      shownAt: daysAgo(3),
    };
    expect(wasQuestionShownRecently(state, 'missed_habit', NOW)).toBe(true);
  });

  it('returns false when same type shown more than 7 days ago', () => {
    const state: ProactiveQuestionState = {
      question: 'test',
      questionType: 'missed_habit',
      shownAt: daysAgo(8),
    };
    expect(wasQuestionShownRecently(state, 'missed_habit', NOW)).toBe(false);
  });
});

describe('generateProactiveQuestion', () => {
  it('returns missed_habit when a confirmed pattern has not occurred for >3 days', () => {
    const patterns = [makePattern({ confidence: 0.7, lastOccurred: daysAgo(5) })];
    const result = generateProactiveQuestion(
      { patterns, transactions: [], commitments: [], accounts: [], now: NOW },
      null,
    );
    expect(result).not.toBeNull();
    expect(result!.questionType).toBe('missed_habit');
    expect(result!.question).toContain('review budget');
  });

  it('skips missed_habit if recently shown', () => {
    const patterns = [makePattern({ confidence: 0.7, lastOccurred: daysAgo(5) })];
    const lastState: ProactiveQuestionState = {
      question: 'old',
      questionType: 'missed_habit',
      shownAt: daysAgo(2),
    };
    const result = generateProactiveQuestion(
      { patterns, transactions: [], commitments: [], accounts: [], now: NOW },
      lastState,
    );
    // Should skip missed_habit and check other conditions
    expect(result === null || result.questionType !== 'missed_habit').toBe(true);
  });

  it('returns completion_drop when completion rate drops significantly', () => {
    // Previous 7 days (day 8-14): 3 completions
    // Last 7 days (day 0-7): 1 completion → 1 < 3*0.5=1.5 → triggers
    const commitments = [
      makeCommitment({ id: 'c1', completed: false, lastCompletedAt: daysAgo(2) }),
      makeCommitment({ id: 'c2', completed: false, lastCompletedAt: daysAgo(9) }),
      makeCommitment({ id: 'c3', completed: false, lastCompletedAt: daysAgo(10) }),
      makeCommitment({ id: 'c4', completed: false, lastCompletedAt: daysAgo(12) }),
    ];

    // Transactions for completion signals (not needed for this condition)
    const result = generateProactiveQuestion(
      { patterns: [], transactions: [], commitments, accounts: [], now: NOW },
      null,
    );
    expect(result).not.toBeNull();
    expect(result!.questionType).toBe('completion_drop');
  });

  it('returns category_spike when spending in a category is >1.5x average', () => {
    // Build 4 weeks of transactions at ~5000/week in Food
    const baseline: AnchorTransaction[] = [];
    for (let w = 1; w <= 4; w++) {
      baseline.push(makeTransaction({
        id: `tx-old-${w}`,
        amountCents: 5000,
        category: 'Food',
        date: daysAgo(7 * w + 1),
      }));
    }
    // This week: 10000 (2x the average of 5000)
    const spike = makeTransaction({
      id: 'tx-spike',
      amountCents: 10000,
      category: 'Food',
      date: daysAgo(1),
    });

    const result = generateProactiveQuestion(
      { patterns: [], transactions: [...baseline, spike], commitments: [], accounts: [], now: NOW },
      null,
    );
    expect(result).not.toBeNull();
    expect(result!.questionType).toBe('category_spike');
    expect(result!.question).toContain('Food');
  });

  it('returns surplus_idle when balance is high with no recent savings transactions', () => {
    const accounts = [makeAccount({ balanceCents: 100_000_00 })];
    const transactions = [
      makeTransaction({ id: 'tx-1', type: 'expense', amountCents: 5000, date: daysAgo(2) }),
    ];

    const result = generateProactiveQuestion(
      { patterns: [], transactions, commitments: [], accounts, now: NOW },
      null,
    );
    expect(result).not.toBeNull();
    expect(result!.questionType).toBe('surplus_idle');
  });

  it('returns null when no condition is met', () => {
    const result = generateProactiveQuestion(
      { patterns: [], transactions: [], commitments: [], accounts: [], now: NOW },
      null,
    );
    expect(result).toBeNull();
  });

  it('respects priority order: missed_habit > completion_drop', () => {
    // Both conditions met: missed_habit pattern + completion drop
    const patterns = [makePattern({ confidence: 0.7, lastOccurred: daysAgo(5) })];
    const commitments = [
      makeCommitment({ id: 'c1', completed: false, lastCompletedAt: daysAgo(2) }),
      makeCommitment({ id: 'c2', completed: false, lastCompletedAt: daysAgo(9) }),
      makeCommitment({ id: 'c3', completed: false, lastCompletedAt: daysAgo(10) }),
      makeCommitment({ id: 'c4', completed: false, lastCompletedAt: daysAgo(12) }),
    ];

    const result = generateProactiveQuestion(
      { patterns, transactions: [], commitments, accounts: [], now: NOW },
      null,
    );
    expect(result).not.toBeNull();
    expect(result!.questionType).toBe('missed_habit');
  });
});
