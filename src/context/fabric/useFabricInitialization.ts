import { useEffect } from 'react';
import { evaluateFeatureFlag } from '../../features/flags/featureFlags';
import { logEvent } from '../../services/telemetry';
import type { FabricService } from '../../services/fabric/FabricService';

interface UseFabricInitializationArgs {
  userId: string | null;
  fabricService: FabricService;
  refresh: () => void;
  resetDisabledState: () => void;
  setInitError: (value: string | null) => void;
  setIsEnabled: (value: boolean) => void;
  setIsReady: (value: boolean) => void;
}

export function useFabricInitialization({
  userId,
  fabricService,
  refresh,
  resetDisabledState,
  setInitError,
  setIsEnabled,
  setIsReady,
}: UseFabricInitializationArgs): void {
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const enabledByFlag = evaluateFeatureFlag('anchor_ai_enabled', { userId });
      if (!userId || !enabledByFlag) {
        if (!isMounted) return;
        resetDisabledState();
        return;
      }

      try {
        await fabricService.initialize(userId);
        if (!isMounted) return;
        setInitError(null);
        refresh();
        setIsReady(true);
        try {
          logEvent('fabric.init_succeeded', { level: 'info', attributes: { userId } });
        } catch {
          // telemetry must never break init
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Failed to initialize Anchor AI';
        try {
          logEvent('fabric.init_failed', {
            level: 'error',
            attributes: { userId, error: message, timestamp: new Date().toISOString() },
          });
        } catch {
          // telemetry must never break init
        }
        console.error('[Fabric] Initialization failed:', err);
        setInitError(message);
        setIsEnabled(false);
        setIsReady(true);
      }
    };

    void initialize();

    return () => {
      isMounted = false;
      fabricService.dispose();
    };
  }, [fabricService, refresh, resetDisabledState, setInitError, setIsEnabled, setIsReady, userId]);
}
