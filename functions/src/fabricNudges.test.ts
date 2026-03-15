import { format } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => {
  type Task = { title: string; type: string; completed: boolean; currentStreak: number };
  type FinanceTx = { date: string; type: 'income' | 'expense'; amountCents: number };
  type UserState = {
    id: string;
    fabricEnabled: boolean;
    notificationPreferences?: Record<string, unknown>;
    commitments?: Task[];
    finance?: FinanceTx[];
    fcmTokens?: string[];
    nudgeLog?: Record<string, Record<string, unknown>>;
  };

  let users = new Map<string, UserState>();

  const setUsers = (next: UserState[]) => {
    users = new Map(next.map((user) => [user.id, { ...user, nudgeLog: user.nudgeLog ?? {} }]));
  };

  const makeUserRef = (userId: string) => ({
    id: userId,
    get: async () => ({
      data: () => ({ notificationPreferences: users.get(userId)?.notificationPreferences ?? {} }),
    }),
    collection: (name: string) => {
      const user = users.get(userId);
      if (!user) throw new Error(`Unknown user: ${userId}`);

      if (name === 'fabric_settings') {
        return {
          doc: () => ({
            get: async () => ({ exists: true, data: () => ({ enabled: user.fabricEnabled }) }),
          }),
        };
      }

      if (name === 'commitments') {
        const docs = (user.commitments ?? []).map((task, i) => ({ id: `c-${i}`, data: () => task }));
        return {
          where: () => ({ get: async () => ({ empty: docs.length === 0, docs }) }),
        };
      }

      if (name === 'finance') {
        const docs = (user.finance ?? []).map((tx, i) => ({ id: `f-${i}`, data: () => tx }));
        return { get: async () => ({ empty: docs.length === 0, docs }) };
      }

      if (name === 'fcmTokens') {
        const docs = (user.fcmTokens ?? []).map((token) => ({
          id: token,
          ref: { id: token, path: `artifacts/anchor-os/users/${userId}/fcmTokens/${token}` },
        }));
        return { get: async () => ({ empty: docs.length === 0, docs }) };
      }

      if (name === 'fabric_nudge_log') {
        return {
          doc: (key: string) => ({
            get: async () => ({ data: () => user.nudgeLog?.[key] ?? {} }),
            set: async (value: Record<string, unknown>, options: { merge?: boolean }) => {
              const current = user.nudgeLog?.[key] ?? {};
              const nextValue = options?.merge ? { ...current, ...value } : value;
              user.nudgeLog = { ...(user.nudgeLog ?? {}), [key]: nextValue };
            },
          }),
        };
      }

      if (name === 'fabric_analytics') {
        return {
          doc: () => ({
            set: async () => undefined,
          }),
        };
      }

      throw new Error(`Unsupported subcollection: ${name}`);
    },
  });

  const db = {
    collection: (root: string) => {
      if (root !== 'artifacts') throw new Error(`Unsupported root collection: ${root}`);
      return {
        doc: () => ({
          collection: (col: string) => {
            if (col !== 'users') throw new Error(`Unsupported collection under app doc: ${col}`);
            return {
              get: async () => ({
                empty: users.size === 0,
                docs: [...users.keys()].map((id) => ({ id })),
              }),
              doc: (userId: string) => makeUserRef(userId),
            };
          },
        }),
      };
    },
  };

  const arrayUnion = vi.fn((value: unknown) => ({ __arrayUnion: value }));
  return { db, setUsers, arrayUnion };
});

const mocks = vi.hoisted(() => ({
  sendReminderNotification: vi.fn(async () => true),
  shouldSendReminderForCategory: vi.fn(() => true),
}));

vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: vi.fn((_opts: unknown, handler: () => Promise<void>) => handler),
}));

vi.mock('./config', () => ({
  db: state.db,
  APP_ID: 'anchor-os',
}));

vi.mock('./reminderSender', () => ({
  sendReminderNotification: mocks.sendReminderNotification,
}));

vi.mock('./reminderPreferences', () => ({
  shouldSendReminderForCategory: mocks.shouldSendReminderForCategory,
}));

vi.mock('./reminderRouting', () => ({
  getReminderLinkPath: vi.fn(() => '/notifications'),
}));

vi.mock('firebase-admin/firestore', () => ({
  FieldValue: { arrayUnion: state.arrayUnion },
}));

import {
  fabricBudgetNudge,
  fabricStreakNudge,
  fabricSurplusNudge,
  formatCurrency,
  isLastDayOfMonth,
  pickTopStreakTask,
  sumMonthlyTotals,
} from './fabricNudges';

describe('fabricNudges helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.sendReminderNotification.mockClear();
    mocks.shouldSendReminderForCategory.mockClear();
    state.arrayUnion.mockClear();
    state.setUsers([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats naira from cents', () => {
    expect(formatCurrency(123_400)).toBe('₦1,234');
  });

  it('detects last day of month correctly', () => {
    expect(isLastDayOfMonth(new Date('2026-02-28T18:00:00.000Z'))).toBe(true);
    expect(isLastDayOfMonth(new Date('2026-02-27T18:00:00.000Z'))).toBe(false);
  });

  it('returns highest qualifying streak task', () => {
    const task = pickTopStreakTask([
      { title: 'Read', type: 'daily', completed: false, currentStreak: 3 },
      { title: 'Run', type: 'daily', completed: false, currentStreak: 6 },
      { title: 'Stretch', type: 'daily', completed: true, currentStreak: 8 },
    ]);

    expect(task).toEqual({ title: 'Run', currentStreak: 6 });
  });

  it('sums income and expenses for a month range', () => {
    const start = new Date('2026-03-01T00:00:00.000Z');
    const end = new Date('2026-04-01T00:00:00.000Z');

    const totals = sumMonthlyTotals([
      { date: '2026-03-03', type: 'income', amountCents: 500_000 },
      { date: '2026-03-10', type: 'expense', amountCents: 120_000 },
      { date: '2026-03-18', type: 'expense', amountCents: 80_000 },
      { date: '2026-02-25', type: 'expense', amountCents: 999_999 },
    ], start, end);

    expect(totals).toEqual({ income: 500_000, expense: 200_000 });
  });

  it('fabricStreakNudge sends when user has incomplete daily task with streak >= 3', async () => {
    vi.setSystemTime(new Date('2026-03-15T20:00:00.000Z'));
    state.setUsers([
      {
        id: 'u1',
        fabricEnabled: true,
        commitments: [{ title: 'Read', type: 'daily', completed: false, currentStreak: 4 }],
        fcmTokens: ['tok-1'],
      },
    ]);

    await (fabricStreakNudge as unknown as () => Promise<void>)();

    expect(mocks.sendReminderNotification).toHaveBeenCalledTimes(1);
    expect(mocks.sendReminderNotification).toHaveBeenCalledWith(expect.objectContaining({ title: 'Streak alert' }));
  });

  it('fabricStreakNudge skips duplicate when already sent today', async () => {
    vi.setSystemTime(new Date('2026-03-15T20:00:00.000Z'));
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    state.setUsers([
      {
        id: 'u1',
        fabricEnabled: true,
        commitments: [{ title: 'Read', type: 'daily', completed: false, currentStreak: 5 }],
        fcmTokens: ['tok-1'],
        nudgeLog: { [todayKey]: { streak: true } },
      },
    ]);

    await (fabricStreakNudge as unknown as () => Promise<void>)();

    expect(mocks.sendReminderNotification).not.toHaveBeenCalled();
  });

  it('fabricStreakNudge skips users with fabric disabled', async () => {
    vi.setSystemTime(new Date('2026-03-15T20:00:00.000Z'));
    state.setUsers([
      {
        id: 'u1',
        fabricEnabled: false,
        commitments: [{ title: 'Read', type: 'daily', completed: false, currentStreak: 5 }],
        fcmTokens: ['tok-1'],
      },
    ]);

    await (fabricStreakNudge as unknown as () => Promise<void>)();

    expect(mocks.sendReminderNotification).not.toHaveBeenCalled();
  });

  it('fabricBudgetNudge does not send when current month spending is below 120%', async () => {
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'));
    state.setUsers([
      {
        id: 'u1',
        fabricEnabled: true,
        finance: [
          { date: '2026-02-10', type: 'expense', amountCents: 100_000 },
          { date: '2026-03-10', type: 'expense', amountCents: 119_000 },
        ],
        fcmTokens: ['tok-1'],
      },
    ]);

    await (fabricBudgetNudge as unknown as () => Promise<void>)();

    expect(mocks.sendReminderNotification).not.toHaveBeenCalled();
  });

  it('fabricBudgetNudge sends when current month spending is at least 120%', async () => {
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'));
    state.setUsers([
      {
        id: 'u1',
        fabricEnabled: true,
        finance: [
          { date: '2026-02-10', type: 'expense', amountCents: 100_000 },
          { date: '2026-03-10', type: 'expense', amountCents: 120_000 },
        ],
        fcmTokens: ['tok-1'],
      },
    ]);

    await (fabricBudgetNudge as unknown as () => Promise<void>)();

    expect(mocks.sendReminderNotification).toHaveBeenCalledTimes(1);
    expect(mocks.sendReminderNotification).toHaveBeenCalledWith(expect.objectContaining({ title: 'Mid-month check' }));
  });

  it('fabricSurplusNudge sends when income is greater than expenses', async () => {
    vi.setSystemTime(new Date('2026-03-31T18:00:00.000Z'));
    state.setUsers([
      {
        id: 'u1',
        fabricEnabled: true,
        finance: [
          { date: '2026-03-05', type: 'income', amountCents: 300_000 },
          { date: '2026-03-12', type: 'expense', amountCents: 100_000 },
        ],
        fcmTokens: ['tok-1'],
      },
    ]);

    await (fabricSurplusNudge as unknown as () => Promise<void>)();

    expect(mocks.sendReminderNotification).toHaveBeenCalledTimes(1);
    expect(mocks.sendReminderNotification).toHaveBeenCalledWith(expect.objectContaining({ title: 'Month-end surplus' }));
  });

  it('fabricSurplusNudge does not send when expenses exceed income', async () => {
    vi.setSystemTime(new Date('2026-03-31T18:00:00.000Z'));
    state.setUsers([
      {
        id: 'u1',
        fabricEnabled: true,
        finance: [
          { date: '2026-03-05', type: 'income', amountCents: 100_000 },
          { date: '2026-03-12', type: 'expense', amountCents: 300_000 },
        ],
        fcmTokens: ['tok-1'],
      },
    ]);

    await (fabricSurplusNudge as unknown as () => Promise<void>)();

    expect(mocks.sendReminderNotification).not.toHaveBeenCalled();
  });
});
