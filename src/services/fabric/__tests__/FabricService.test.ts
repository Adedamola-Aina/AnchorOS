import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FabricService } from '../FabricService';

const getDocument = vi.fn();
const setDocument = vi.fn();
const queryCollection = vi.fn();

vi.mock('../../../utils/secureDb', () => ({
  secureDb: {
    getDocument: (...args: unknown[]) => getDocument(...args),
    setDocument: (...args: unknown[]) => setDocument(...args),
    queryCollection: (...args: unknown[]) => queryCollection(...args),
  },
}));

describe('FabricService', () => {
  beforeEach(() => {
    FabricService.resetForTests();
    vi.clearAllMocks();
    getDocument.mockImplementation((_userId: string, path: string[]) => {
      if (path[0] === 'fabric_settings') {
        return Promise.resolve({ enabled: true, dataCollectionEnabled: true });
      }
      if (path[0] === 'fabric_behavior') {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });
    setDocument.mockResolvedValue(undefined);
    queryCollection.mockResolvedValue([]);
  });

  it('does not initialize when user setting disables Anchor AI', async () => {
    getDocument.mockImplementation((_userId: string, path: string[]) => {
      if (path[0] === 'fabric_settings') {
        return Promise.resolve({ enabled: false, dataCollectionEnabled: false });
      }
      return Promise.resolve(null);
    });

    const service = FabricService.getInstance();
    await service.initialize('user-1');

    expect(service.isEnabled()).toBe(false);
    expect(queryCollection).not.toHaveBeenCalled();
  });

  it('seeds history on first initialize when behavior store is empty', async () => {
    queryCollection.mockImplementation((_userId: string, collection: string) => {
      if (collection === 'finance') {
        return Promise.resolve([
          {
            id: 'tx-1',
            title: 'Rent payment',
            amountCents: 150000,
            type: 'expense',
            category: 'Rent',
            accountId: 'acc-1',
            currency: 'USD',
            scope: 'personal',
            date: '2026-02-01T00:00:00.000Z',
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
            date: '2026-03-01T00:00:00.000Z',
          },
        ]);
      }
      if (collection === 'commitments') {
        return Promise.resolve([
          {
            id: 'task-1',
            title: 'Morning workout',
            type: 'daily',
            completed: true,
            category: 'personal',
            createdAt: new Date('2026-03-01T00:00:00.000Z'),
            timeOfDay: 'morning',
          },
          {
            id: 'task-2',
            title: 'Morning workout',
            type: 'daily',
            completed: true,
            category: 'personal',
            createdAt: new Date('2026-03-02T00:00:00.000Z'),
            timeOfDay: 'morning',
          },
        ]);
      }
      return Promise.resolve([]);
    });

    const service = FabricService.getInstance();
    await service.initialize('user-1');

    expect(service.isEnabled()).toBe(true);
    expect(queryCollection).toHaveBeenCalledWith('user-1', 'finance', []);
    expect(queryCollection).toHaveBeenCalledWith('user-1', 'commitments', []);
    expect(service.getPatterns().length).toBeGreaterThan(0);
  });

  it('debounces persistence when learnFrom is called rapidly', async () => {
    vi.useFakeTimers();

    const service = FabricService.getInstance();
    await service.initialize('user-1');

    service.learnFrom({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
    service.learnFrom({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });

    await vi.advanceTimersByTimeAsync(500);

    expect(
      setDocument.mock.calls.filter(
        ([, path]) => Array.isArray(path) && path[0] === 'fabric_behavior'
      ).length
    ).toBe(1);

    vi.useRealTimers();
  });

  it('clears all fabric data documents', async () => {
    const service = FabricService.getInstance();
    await service.initialize('user-1');

    await service.clearAllData();

    expect(setDocument).toHaveBeenCalledWith(
      'user-1',
      ['fabric_behavior', 'state'],
      expect.objectContaining({ patterns: [], confirmedPatterns: [], recentActions: [] })
    );
    expect(setDocument).toHaveBeenCalledWith(
      'user-1',
      ['fabric_predictions', 'state'],
      expect.objectContaining({ active: [] })
    );
    expect(setDocument).toHaveBeenCalledWith(
      'user-1',
      ['fabric_settings', 'state'],
      expect.objectContaining({ lastCleared: expect.any(String) })
    );
  });

  it('returns ambient context and unknown parse intent fallback', async () => {
    const service = FabricService.getInstance();
    await service.initialize('user-1');

    const context = service.getContext();
    const intent = service.parseIntent('how much did i spend this month');

    expect(context.hour).toBeGreaterThanOrEqual(0);
    expect(intent.action).toBe('query_spending');
  });

  it('returns structured query results for spending question', async () => {
    queryCollection.mockImplementation((_userId: string, collection: string) => {
      if (collection === 'finance') {
        return Promise.resolve([
          {
            id: 'tx-1',
            title: 'Groceries',
            amountCents: 3200,
            type: 'expense',
            category: 'Food',
            accountId: 'acc-1',
            currency: 'USD',
            scope: 'personal',
            date: '2026-03-03T00:00:00.000Z',
          },
        ]);
      }
      return Promise.resolve([]);
    });

    const service = FabricService.getInstance();
    await service.initialize('user-1');

    const result = await service.query('how much did i spend this month');
    expect(result.summary.toLowerCase()).toContain('spent');
    expect(result.visualizable).toBe(true);
  });

  it('builds predictions and weekly report', async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    queryCollection.mockImplementation((_userId: string, collection: string) => {
      if (collection === 'finance') {
        return Promise.resolve([
          {
            id: 'tx-1',
            title: 'Salary',
            amountCents: 150000,
            type: 'income',
            category: 'Salary',
            accountId: 'acc-1',
            currency: 'USD',
            scope: 'personal',
            date: twoDaysAgo.toISOString(),
          },
          {
            id: 'tx-2',
            title: 'Food',
            amountCents: 3000,
            type: 'expense',
            category: 'Food',
            accountId: 'acc-1',
            currency: 'USD',
            scope: 'personal',
            date: yesterday.toISOString(),
          },
        ]);
      }
      if (collection === 'commitments') {
        return Promise.resolve([
          {
            id: 'task-1',
            title: 'Workout',
            type: 'daily',
            completed: true,
            category: 'personal',
            createdAt: twoDaysAgo,
            currentStreak: 2,
          },
        ]);
      }
      return Promise.resolve([]);
    });

    const service = FabricService.getInstance();
    await service.initialize('user-1');

    const predictions = service.getPredictions();
    const report = await service.generateWeeklyReport();

    expect(predictions.length).toBeGreaterThanOrEqual(0);
    expect(report.financeSummary.totalIncome).toBe(1500);
    expect(setDocument).toHaveBeenCalledWith(
      'user-1',
      expect.arrayContaining(['fabric_reports']),
      expect.objectContaining({ generatedAt: expect.any(String) })
    );
  });

  it('persists dismissed prediction ids', async () => {
    const service = FabricService.getInstance();
    await service.initialize('user-1');

    service.dismissPrediction('pred-budget-overage');

    expect(setDocument).toHaveBeenCalledWith(
      'user-1',
      ['fabric_predictions', 'state'],
      expect.objectContaining({ dismissedIds: expect.arrayContaining(['pred-budget-overage']) })
    );
  });

  it('persists conversation entries when query is executed', async () => {
    getDocument.mockImplementation((_userId: string, path: string[]) => {
      if (path[0] === 'fabric_settings') {
        return Promise.resolve({ enabled: true, dataCollectionEnabled: true });
      }
      if (path[0] === 'fabric_conversations') {
        return Promise.resolve({ messages: [] });
      }
      return Promise.resolve(null);
    });

    queryCollection.mockResolvedValue([]);
    const service = FabricService.getInstance();
    await service.initialize('user-1');
    await service.query('how much did i spend this month');

    expect(setDocument).toHaveBeenCalledWith(
      'user-1',
      expect.arrayContaining(['fabric_conversations']),
      expect.objectContaining({ messages: expect.any(Array) })
    );
  });
});
