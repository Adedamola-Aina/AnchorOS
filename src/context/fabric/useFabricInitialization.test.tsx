import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FabricService } from '../../services/fabric/FabricService';
import { useFabricInitialization } from './useFabricInitialization';

const evaluateFeatureFlag = vi.fn();
const logEvent = vi.fn();

vi.mock('../../features/flags/featureFlags', () => ({
  evaluateFeatureFlag: (...args: unknown[]) => evaluateFeatureFlag(...args),
}));

vi.mock('../../services/telemetry', () => ({
  logEvent: (...args: unknown[]) => logEvent(...args),
}));

interface HookArgs {
  userId: string | null;
  fabricService: FabricService;
  refresh: () => void;
  resetDisabledState: () => void;
  setInitError: (value: string | null) => void;
  setIsEnabled: (value: boolean) => void;
  setIsReady: (value: boolean) => void;
}

function createArgs(overrides: Partial<HookArgs> = {}): HookArgs {
  return {
    userId: 'user-1',
    fabricService: {
      initialize: vi.fn().mockResolvedValue(undefined),
      dispose: vi.fn(),
    } as unknown as FabricService,
    refresh: vi.fn(),
    resetDisabledState: vi.fn(),
    setInitError: vi.fn(),
    setIsEnabled: vi.fn(),
    setIsReady: vi.fn(),
    ...overrides,
  };
}

describe('useFabricInitialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    evaluateFeatureFlag.mockReturnValue(true);
    logEvent.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resets disabled state when user is missing', async () => {
    const args = createArgs({ userId: null });

    renderHook(() => useFabricInitialization(args));

    await waitFor(() => {
      expect(args.resetDisabledState).toHaveBeenCalledTimes(1);
    });
    expect((args.fabricService as unknown as { initialize: ReturnType<typeof vi.fn> }).initialize).not.toHaveBeenCalled();
  });

  it('resets disabled state when feature flag is off', async () => {
    evaluateFeatureFlag.mockReturnValue(false);
    const args = createArgs();

    renderHook(() => useFabricInitialization(args));

    await waitFor(() => {
      expect(args.resetDisabledState).toHaveBeenCalledTimes(1);
    });
    expect((args.fabricService as unknown as { initialize: ReturnType<typeof vi.fn> }).initialize).not.toHaveBeenCalled();
  });

  it('initializes successfully and sets ready state', async () => {
    const args = createArgs();

    renderHook(() => useFabricInitialization(args));

    await waitFor(() => {
      expect(args.refresh).toHaveBeenCalledTimes(1);
      expect(args.setInitError).toHaveBeenCalledWith(null);
      expect(args.setIsReady).toHaveBeenCalledWith(true);
    });

    expect(logEvent).toHaveBeenCalledWith('fabric.init_succeeded', {
      level: 'info',
      attributes: { userId: 'user-1' },
    });
  });

  it('handles initialize error and marks feature disabled', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const args = createArgs({
      fabricService: {
        initialize: vi.fn().mockRejectedValue(new Error('boom')),
        dispose: vi.fn(),
      } as unknown as FabricService,
    });

    renderHook(() => useFabricInitialization(args));

    await waitFor(() => {
      expect(args.setInitError).toHaveBeenCalledWith('boom');
      expect(args.setIsEnabled).toHaveBeenCalledWith(false);
      expect(args.setIsReady).toHaveBeenCalledWith(true);
    });

    expect(logEvent).toHaveBeenCalledWith(
      'fabric.init_failed',
      expect.objectContaining({ level: 'error' }),
    );
    expect(errorSpy).toHaveBeenCalled();
  });

  it('still handles initialize failure when failure telemetry throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    logEvent.mockImplementation(() => {
      throw new Error('telemetry write failed');
    });
    const args = createArgs({
      fabricService: {
        initialize: vi.fn().mockRejectedValue(new Error('init-failed')),
        dispose: vi.fn(),
      } as unknown as FabricService,
    });

    renderHook(() => useFabricInitialization(args));

    await waitFor(() => {
      expect(args.setInitError).toHaveBeenCalledWith('init-failed');
      expect(args.setIsEnabled).toHaveBeenCalledWith(false);
      expect(args.setIsReady).toHaveBeenCalledWith(true);
    });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('ignores telemetry failures during successful initialization', async () => {
    logEvent.mockImplementation(() => {
      throw new Error('telemetry down');
    });
    const args = createArgs();

    renderHook(() => useFabricInitialization(args));

    await waitFor(() => {
      expect(args.refresh).toHaveBeenCalledTimes(1);
      expect(args.setIsReady).toHaveBeenCalledWith(true);
    });
  });

  it('calls dispose on unmount', async () => {
    const args = createArgs();
    const { unmount } = renderHook(() => useFabricInitialization(args));

    await waitFor(() => {
      expect(args.refresh).toHaveBeenCalledTimes(1);
    });

    unmount();

    expect((args.fabricService as unknown as { dispose: ReturnType<typeof vi.fn> }).dispose).toHaveBeenCalledTimes(1);
  });

  it('does not set state after unmount when initialize resolves late', async () => {
    let resolveInit: (() => void) | null = null;
    const initialize = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveInit = resolve;
        }),
    );
    const args = createArgs({
      fabricService: {
        initialize,
        dispose: vi.fn(),
      } as unknown as FabricService,
    });

    const { unmount } = renderHook(() => useFabricInitialization(args));
    unmount();
    resolveInit?.();

    await Promise.resolve();

    expect(args.setInitError).not.toHaveBeenCalled();
    expect(args.setIsReady).not.toHaveBeenCalled();
  });
});