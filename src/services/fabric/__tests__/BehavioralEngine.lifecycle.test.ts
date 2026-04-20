import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BehavioralEngine } from '../BehavioralEngine';

const getDocument = vi.fn();
const setDocument = vi.fn();

vi.mock('../../../utils/secureDb', () => ({
  secureDb: {
    getDocument: (...args: unknown[]) => getDocument(...args),
    setDocument: (...args: unknown[]) => setDocument(...args),
  },
}));

describe('BehavioralEngine — dismiss/delete/reset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDocument.mockResolvedValue(null);
    setDocument.mockResolvedValue(undefined);
  });

  it('dismissPattern increments dismissed count and keeps pattern in list', () => {
    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));
    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });

    const [pattern] = engine.getPatterns();
    engine.dismissPattern(pattern.id);

    const afterDismiss = engine.getPatterns();
    expect(afterDismiss).toHaveLength(1);
    expect(afterDismiss[0].dismissed).toBe(1);
  });

  it('dismissPattern is idempotent via dismissedPatterns set', () => {
    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));
    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
    const [pattern] = engine.getPatterns();

    engine.dismissPattern(pattern.id);
    engine.dismissPattern(pattern.id);

    expect(engine.getPatterns()[0].dismissed).toBe(2);
  });

  it('deletePattern removes the pattern entirely', () => {
    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));
    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
    engine.recordAction({ type: 'transaction_recorded', category: 'Food' }, { type: 'record_transaction' });

    const patterns = engine.getPatterns();
    expect(patterns.length).toBeGreaterThanOrEqual(2);
    const victim = patterns[0].id;

    engine.deletePattern(victim);
    const after = engine.getPatterns();
    expect(after.find((p) => p.id === victim)).toBeUndefined();
  });

  it('reset clears all state', () => {
    const engine = new BehavioralEngine(() => new Date('2026-03-09T09:00:00.000Z'));
    engine.recordAction({ type: 'app_opened' }, { type: 'view_page', page: 'finance' });
    expect(engine.getPatterns().length).toBeGreaterThan(0);

    engine.reset();
    expect(engine.getPatterns()).toEqual([]);
    expect(engine.getConfirmedPatterns()).toEqual([]);
    expect(engine.getRecentActions()).toEqual([]);
  });
});
