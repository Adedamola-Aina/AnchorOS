import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import {
  BehavioralEngine,
  detectCategory,
  isFinanciallyRelevant,
  parseAmountFromText,
} from '../BehavioralEngine';

const getDocument = vi.fn();
const setDocument = vi.fn();

vi.mock('../../../utils/secureDb', () => ({
  secureDb: {
    getDocument: (...args: unknown[]) => getDocument(...args),
    setDocument: (...args: unknown[]) => setDocument(...args),
  },
}));

describe('BehavioralEngine heuristics', () => {
  it('parses amounts from USD and NGN formats', () => {
    expect(parseAmountFromText('Pay $150 rent')).toBe(150);
    expect(parseAmountFromText('Pay NGN 5,000 for groceries')).toBe(5000);
  });

  it('detects finance category and relevance', () => {
    expect(detectCategory('Buy groceries this evening')).toBe('Groceries');
    expect(isFinanciallyRelevant('Pay electricity bill')).toBe(true);
    expect(isFinanciallyRelevant('Read for 20 minutes')).toBe(false);
  });
});

describe('BehavioralEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDocument.mockResolvedValue(null);
    setDocument.mockResolvedValue(undefined);
  });

  it('records new pattern and increments frequency on repeats', () => {
    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));

    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });

    const patterns = engine.getPatterns();
    expect(patterns).toHaveLength(1);
    expect(patterns[0].frequency).toBe(2);
    expect(patterns[0].confidence).toBeGreaterThan(0.4);
  });

  it('gives higher confidence to more recent patterns', () => {
    let now = new Date('2026-03-01T09:00:00.000Z');
    const engine = new BehavioralEngine(() => now);

    now = new Date('2025-09-01T09:00:00.000Z');
    for (let index = 0; index < 5; index += 1) {
      engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'finance' });
    }

    now = new Date('2026-02-20T09:00:00.000Z');
    for (let index = 0; index < 3; index += 1) {
      engine.recordAction({ type: 'transaction_recorded', category: 'Food' }, { type: 'review_budget', category: 'Food' });
    }

    const oldPattern = engine.getPatterns().find((item) => item.followUpAction.type === 'view_page');
    const recentPattern = engine.getPatterns().find((item) => item.followUpAction.type === 'review_budget');

    expect(oldPattern).toBeDefined();
    expect(recentPattern).toBeDefined();
    expect((recentPattern?.confidence ?? 0)).toBeGreaterThan(oldPattern?.confidence ?? 0);
  });

  it('promotes patterns above confidence threshold to confirmedPatterns', () => {
    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));

    for (let index = 0; index < 3; index += 1) {
      engine.recordAction(
        { type: 'commitment_completed', category: 'personal', keywords: ['rent'] },
        { type: 'record_transaction' }
      );
    }

    expect(engine.getConfirmedPatterns()).toHaveLength(1);
  });

  it('keeps recent actions bounded by TTL and max length', () => {
    let now = new Date('2025-11-01T09:00:00.000Z');
    const engine = new BehavioralEngine(() => now);

    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });

    now = new Date('2026-03-09T09:00:00.000Z');
    for (let index = 0; index < 120; index += 1) {
      engine.recordAction({ type: 'page_visited', page: `page-${index}` }, { type: 'view_page', page: `page-${index}` });
    }

    const recentActions = engine.getRecentActions();
    expect(recentActions).toHaveLength(100);
    expect(recentActions.every((entry) => Date.parse(entry.timestamp) >= Date.parse('2025-12-09T09:00:00.000Z'))).toBe(true);
  });

  it('loads and saves behavior state via secureDb', async () => {
    getDocument.mockResolvedValue({
      patterns: [
        {
          id: 'pattern-1',
          trigger: { type: 'app_opened' },
          followUpAction: { type: 'view_page', page: 'dashboard' },
          frequency: 3,
          confidence: 0.6,
          lastOccurred: '2026-03-09T09:00:00.000Z',
          averageDelayMs: 0,
          dismissed: 0,
          createdAt: '2026-03-01T09:00:00.000Z',
          updatedAt: '2026-03-09T09:00:00.000Z',
        },
      ],
      confirmedPatterns: [],
      recentActions: [],
      dismissedPatterns: [],
      updatedAt: '2026-03-09T09:00:00.000Z',
    });

    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));
    await engine.loadBehavior('user-1');
    await engine.saveBehavior('user-1');

    expect(getDocument).toHaveBeenCalledWith('user-1', ['fabric_behavior', 'state']);
    expect(setDocument).toHaveBeenCalledWith(
      'user-1',
      ['fabric_behavior', 'state'],
      expect.objectContaining({ patterns: expect.any(Array), confirmedPatterns: expect.any(Array) })
    );
  });

  it('seeds patterns from existing transaction and commitment history', () => {
    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));

    const transactions: AnchorTransaction[] = [
      {
        id: 'tx-1',
        title: 'Rent payment',
        amountCents: 150000,
        type: 'expense',
        category: 'Rent',
        accountId: 'acc-1',
        currency: 'USD',
        scope: 'personal',
        date: '2026-01-01T09:00:00.000Z',
      },
      {
        id: 'tx-2',
        title: 'Rent payment',
        amountCents: 150000,
        type: 'expense',
        category: 'Rent',
        accountId: 'acc-1',
        currency: 'USD',
        scope: 'personal',
        date: '2026-02-01T09:00:00.000Z',
      },
      {
        id: 'tx-3',
        title: 'Rent payment',
        amountCents: 150000,
        type: 'expense',
        category: 'Rent',
        accountId: 'acc-1',
        currency: 'USD',
        scope: 'personal',
        date: '2026-03-01T09:00:00.000Z',
      },
    ];

    const commitments: AnchorTask[] = [
      {
        id: 'task-1',
        title: 'Morning workout',
        type: 'daily',
        completed: true,
        category: 'personal',
        createdAt: new Date('2026-01-01T06:30:00.000Z'),
        timeOfDay: 'morning',
      },
      {
        id: 'task-2',
        title: 'Morning workout',
        type: 'daily',
        completed: true,
        category: 'personal',
        createdAt: new Date('2026-01-02T06:30:00.000Z'),
        timeOfDay: 'morning',
      },
    ];

    engine.seedFromHistory(transactions, commitments);

    const patterns = engine.getPatterns();
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns.some((item) => item.followUpAction.type === 'review_budget')).toBe(true);
    expect(patterns.some((item) => item.followUpAction.type === 'check_commitment')).toBe(true);
  });
});
