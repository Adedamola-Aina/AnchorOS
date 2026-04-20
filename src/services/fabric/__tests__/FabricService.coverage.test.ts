// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FabricService } from '../FabricService';

const getDocument = vi.fn();
const setDocument = vi.fn();
const queryCollection = vi.fn();
const deleteDocument = vi.fn();

vi.mock('../../../utils/secureDb', () => ({
  secureDb: {
    getDocument: (...args: unknown[]) => getDocument(...args),
    setDocument: (...args: unknown[]) => setDocument(...args),
    queryCollection: (...args: unknown[]) => queryCollection(...args),
    deleteDocument: (...args: unknown[]) => deleteDocument(...args),
  },
}));

describe('FabricService — additional method coverage', () => {
  beforeEach(() => {
    FabricService.resetForTests();
    vi.clearAllMocks();
    getDocument.mockImplementation((_userId: string, path: string[]) => {
      if (path[0] === 'fabric_settings') {
        return Promise.resolve({ enabled: true, dataCollectionEnabled: true });
      }
      return Promise.resolve(null);
    });
    setDocument.mockResolvedValue(undefined);
    deleteDocument.mockResolvedValue(undefined);
    queryCollection.mockResolvedValue([]);
  });

  it('getContext returns ambient context with timezone', () => {
    const service = FabricService.getInstance();
    const ctx = service.getContext();
    expect(ctx).toBeDefined();
    expect(typeof ctx.timeOfDay).toBe('string');
  });

  it('parseIntent delegates to parser and returns a parsed intent', () => {
    const service = FabricService.getInstance();
    const result = service.parseIntent('how much did I spend on food?');
    expect(result).toBeDefined();
    expect(result).toHaveProperty('action');
  });

  it('getPatterns and getConfirmedPatterns return arrays', () => {
    const service = FabricService.getInstance();
    expect(Array.isArray(service.getPatterns())).toBe(true);
    expect(Array.isArray(service.getConfirmedPatterns())).toBe(true);
  });

  it('learnFrom is a no-op when service is not initialized', () => {
    const service = FabricService.getInstance();
    expect(() => service.learnFrom({ kind: 'time', hour: 9 } as any, { kind: 'log_transaction' } as any)).not.toThrow();
  });

  it('dismissPattern and deletePattern are no-ops when not initialized', () => {
    const service = FabricService.getInstance();
    expect(() => service.dismissPattern('p1')).not.toThrow();
    expect(() => service.deletePattern('p1')).not.toThrow();
  });

  it('updateActivity stores new arrays without requiring initialization', () => {
    const service = FabricService.getInstance();
    expect(() =>
      service.updateActivity(
        [{ id: 't1' } as any],
        [{ id: 'c1' } as any],
        [{ id: 'a1' } as any],
        [{ id: 'r1' } as any],
      ),
    ).not.toThrow();
  });

  it('getProactiveQuestion returns null when disabled', () => {
    const service = FabricService.getInstance();
    expect(service.getProactiveQuestion()).toBeNull();
  });

  it('generateWeeklyReport rejects when no user is active', async () => {
    const service = FabricService.getInstance();
    await expect(service.generateWeeklyReport()).rejects.toThrow(/not initialized/i);
  });

  it('clearAllData is a no-op when no user is active', async () => {
    const service = FabricService.getInstance();
    await expect(service.clearAllData()).resolves.toBeUndefined();
  });

  it('dismissPrediction is a no-op when no user is active', () => {
    const service = FabricService.getInstance();
    expect(() => service.dismissPrediction('pred-1')).not.toThrow();
  });

  it('dispose clears pending timers without error', () => {
    const service = FabricService.getInstance();
    expect(() => service.dispose()).not.toThrow();
  });

  it('isEnabled is false before initialization', () => {
    const service = FabricService.getInstance();
    expect(service.isEnabled()).toBe(false);
  });
});
