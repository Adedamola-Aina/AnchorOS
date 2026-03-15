import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Hoisted mocks ---
const mockDb = vi.hoisted(() => {
  const batchOps: Array<{ op: string; ref: unknown; data?: unknown }> = [];
  const mockBatch = {
    set: vi.fn((ref: unknown, data: unknown) => batchOps.push({ op: 'set', ref, data })),
    commit: vi.fn(async () => { }),
    _ops: batchOps,
  };

  const mockDocData = new Map<string, Record<string, unknown> | undefined>();
  const mockCollectionData = new Map<string, Array<{ id: string; data: () => Record<string, unknown> }>>();

  return {
    mockBatch,
    mockDocData,
    mockCollectionData,
    batchOps,
    collection: vi.fn(),
    doc: vi.fn(),
    batch: vi.fn(() => mockBatch),
    clear() {
      mockDocData.clear();
      mockCollectionData.clear();
      batchOps.length = 0;
      mockBatch.set.mockClear();
      mockBatch.commit.mockClear();
    },
  };
});

const mockMessaging = vi.hoisted(() => ({
  send: vi.fn(async () => 'message-id'),
}));

// --- vi.mock declarations ---
vi.mock('./config', () => ({
  db: {
    collection: (...args: unknown[]) => mockDb.collection(...args),
    doc: (...args: unknown[]) => mockDb.doc(...args),
    batch: () => mockDb.batch(),
  },
  APP_ID: 'anchor-os',
}));

vi.mock('firebase-admin/messaging', () => ({
  getMessaging: () => mockMessaging,
}));

vi.mock('./reminderSender', () => ({
  sendReminderNotification: vi.fn(async () => true),
}));

vi.mock('./reminderPreferences', () => ({
  shouldSendReminderForCategory: vi.fn(() => true),
}));

vi.mock('./reminderRouting', () => ({
  getReminderLinkPath: vi.fn(() => '/fabric'),
}));

// Prevent actual scheduler registration
vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: vi.fn((_opts: unknown, handler: Function) => handler),
}));

import { sendReminderNotification } from './reminderSender';
import { shouldSendReminderForCategory } from './reminderPreferences';

// Helper types matching what the function queries
interface MockDoc {
  id: string;
  data: () => Record<string, unknown>;
  ref: { id: string; path: string };
  exists: boolean;
}

interface MockSnapshot {
  empty: boolean;
  docs: MockDoc[];
}

function createMockDoc(id: string, data: Record<string, unknown>): MockDoc {
  return {
    id,
    data: () => data,
    ref: { id, path: `mock/${id}` },
    exists: true,
  };
}

function createMockSnapshot(docs: MockDoc[]): MockSnapshot {
  return { empty: docs.length === 0, docs };
}

// Wiring: build a mock Firestore that routes collection/doc/get calls
function setupFirestore(options: {
  users: Array<{
    id: string;
    fabricEnabled: boolean;
    notificationPreferences?: Record<string, unknown>;
    fcmTokens?: string[];
    transactions?: Array<Record<string, unknown>>;
    commitments?: Array<Record<string, unknown>>;
    recurringTransactions?: Array<Record<string, unknown>>;
    existingReport?: Record<string, unknown>;
  }>;
}) {
  // Build a path-based resolver
  const pathHandlers = new Map<string, () => unknown>();

  for (const user of options.users) {
    // fabric_settings/state sub-doc
    const settingsPath = `artifacts/anchor-os/users/${user.id}/fabric_settings/state`;
    pathHandlers.set(settingsPath, () => ({
      exists: user.fabricEnabled,
      data: () => ({ enabled: user.fabricEnabled }),
    }));

    // notificationPreferences on user doc
    const userDocPath = `artifacts/anchor-os/users/${user.id}`;
    pathHandlers.set(userDocPath, () => ({
      exists: true,
      data: () => ({ notificationPreferences: user.notificationPreferences ?? {} }),
    }));

    // fcmTokens sub-collection
    const fcmPath = `artifacts/anchor-os/users/${user.id}/fcmTokens`;
    const tokenDocs = (user.fcmTokens ?? []).map(t => createMockDoc(t, { createdAt: '2026-01-01' }));
    pathHandlers.set(fcmPath, () => createMockSnapshot(tokenDocs));

    // transactions collection
    const txPath = `artifacts/anchor-os/users/${user.id}/transactions`;
    const txDocs = (user.transactions ?? []).map((tx, i) =>
      createMockDoc(tx.id as string || `tx-${i}`, tx)
    );
    pathHandlers.set(txPath, () => createMockSnapshot(txDocs));

    // commitments collection
    const cmtPath = `artifacts/anchor-os/users/${user.id}/commitments`;
    const cmtDocs = (user.commitments ?? []).map((c, i) =>
      createMockDoc(c.id as string || `cmt-${i}`, c)
    );
    pathHandlers.set(cmtPath, () => createMockSnapshot(cmtDocs));

    // recurring_transactions (global collection, filtered by userId)
    // Handled separately below

    // existing report doc — register both at collection and doc level
    const weekKey = new Date().toISOString().split('T')[0];
    const reportColPath = `artifacts/anchor-os/users/${user.id}/fabric_reports`;
    const reportDocPath = `${reportColPath}/${weekKey}`;
    if (user.existingReport) {
      pathHandlers.set(reportColPath, () =>
        createMockSnapshot([createMockDoc(weekKey, user.existingReport!)])
      );
      pathHandlers.set(reportDocPath, () => ({
        exists: true,
        data: () => user.existingReport,
      }));
    } else {
      pathHandlers.set(reportColPath, () => createMockSnapshot([]));
      pathHandlers.set(reportDocPath, () => ({
        exists: false,
        data: () => undefined,
      }));
    }
  }

  // recurring_transactions — global
  const allRecurring = options.users.flatMap(u =>
    (u.recurringTransactions ?? []).map((rt, i) =>
      createMockDoc(rt.id as string || `rt-${i}`, { ...rt, userId: u.id })
    )
  );
  const recurringPath = 'artifacts/anchor-os/recurring_transactions';
  pathHandlers.set(recurringPath, () => createMockSnapshot(allRecurring));

  // Users collection for initial query
  const enabledUsers = options.users.filter(u => u.fabricEnabled);
  const usersPath = 'artifacts/anchor-os/users';
  pathHandlers.set(usersPath, () =>
    createMockSnapshot(enabledUsers.map(u => createMockDoc(u.id, {})))
  );

  // Chain mockDb.collection → doc → get / collection().get()
  const createChainable = (currentPath: string): Record<string, Function> => ({
    doc: (docId: string) => {
      const newPath = `${currentPath}/${docId}`;
      return {
        ...createChainable(newPath),
        get: async () => {
          const handler = pathHandlers.get(newPath);
          return handler ? handler() : { exists: false, data: () => undefined };
        },
        set: vi.fn(async () => { }),
        id: docId,
        path: newPath,
      };
    },
    collection: (colId: string) => {
      const newPath = `${currentPath}/${colId}`;
      return {
        ...createChainable(newPath),
        get: async () => {
          const handler = pathHandlers.get(newPath);
          return handler ? handler() : createMockSnapshot([]);
        },
        where: () => ({
          get: async () => {
            const handler = pathHandlers.get(newPath);
            return handler ? handler() : createMockSnapshot([]);
          },
          where: () => ({
            get: async () => {
              const handler = pathHandlers.get(newPath);
              return handler ? handler() : createMockSnapshot([]);
            },
          }),
        }),
      };
    },
    get: async () => {
      const handler = pathHandlers.get(currentPath);
      return handler ? handler() : createMockSnapshot([]);
    },
    where: () => ({
      get: async () => {
        const handler = pathHandlers.get(currentPath);
        return handler ? handler() : createMockSnapshot([]);
      },
      where: () => ({
        get: async () => {
          const handler = pathHandlers.get(currentPath);
          return handler ? handler() : createMockSnapshot([]);
        },
      }),
    }),
  });

  mockDb.collection.mockImplementation((colId: string) => {
    const path = colId;
    return createChainable(path);
  });

  mockDb.doc.mockImplementation((docId: string) => {
    return {
      ...createChainable(docId),
      get: async () => {
        const handler = pathHandlers.get(docId);
        return handler ? handler() : { exists: false, data: () => undefined };
      },
      id: docId,
    };
  });
}

describe('weeklyReport — generateWeeklyReport', () => {
  let handler: () => Promise<void>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockDb.clear();
    vi.mocked(shouldSendReminderForCategory).mockReturnValue(true);

    // Re-import to get the handler extracted by the mock onSchedule
    const mod = await import('./weeklyReport');
    handler = mod.generateWeeklyReport as unknown as () => Promise<void>;
  });

  it('skips users with fabric disabled', async () => {
    setupFirestore({
      users: [{
        id: 'user-disabled',
        fabricEnabled: false,
      }],
    });

    await handler();

    expect(sendReminderNotification).not.toHaveBeenCalled();
    expect(mockDb.batch().set).not.toHaveBeenCalled();
  });

  it('persists report but sends no notification when user has no FCM tokens', async () => {
    setupFirestore({
      users: [{
        id: 'user-no-tokens',
        fabricEnabled: true,
        fcmTokens: [],
        transactions: [
          { id: 'tx-1', type: 'expense', amountCents: 4500000, category: 'Food', date: '2026-03-14' },
        ],
        commitments: [
          { id: 'cmt-1', completed: true, createdAt: '2026-03-10' },
          { id: 'cmt-2', completed: false, createdAt: '2026-03-10' },
        ],
      }],
    });

    await handler();

    // Report should be persisted (batch.set called)
    expect(mockDb.batch().commit).toHaveBeenCalled();
    // No notification
    expect(sendReminderNotification).not.toHaveBeenCalled();
  });

  it('persists report AND sends notification when user has FCM token', async () => {
    setupFirestore({
      users: [{
        id: 'user-with-token',
        fabricEnabled: true,
        fcmTokens: ['token-abc-123'],
        transactions: [
          { id: 'tx-1', type: 'expense', amountCents: 4500000, category: 'Food', date: '2026-03-14' },
          { id: 'tx-2', type: 'expense', amountCents: 1500000, category: 'Transport', date: '2026-03-13' },
          { id: 'tx-3', type: 'income', amountCents: 20000000, category: 'Salary', date: '2026-03-10' },
        ],
        commitments: [
          { id: 'cmt-1', completed: true, createdAt: '2026-03-10' },
          { id: 'cmt-2', completed: true, createdAt: '2026-03-10' },
          { id: 'cmt-3', completed: false, createdAt: '2026-03-10' },
        ],
      }],
    });

    await handler();

    // Report persisted
    expect(mockDb.batch().commit).toHaveBeenCalled();
    // Notification sent
    expect(sendReminderNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'token-abc-123',
        title: 'Your week in review',
        body: expect.stringContaining('spent'),
      })
    );
  });

  it('is idempotent — skips user if report already exists for this week', async () => {
    setupFirestore({
      users: [{
        id: 'user-already-reported',
        fabricEnabled: true,
        fcmTokens: ['token-abc'],
        existingReport: {
          totalExpenses: 4500000,
          completionRate: 67,
          topCategory: 'Food',
          generatedAt: '2026-03-15T19:00:00.000Z',
        },
        transactions: [
          { id: 'tx-1', type: 'expense', amountCents: 4500000, category: 'Food', date: '2026-03-14' },
        ],
      }],
    });

    await handler();

    // Should NOT persist again or send notification
    expect(mockDb.batch().set).not.toHaveBeenCalled();
    expect(sendReminderNotification).not.toHaveBeenCalled();
  });
});
