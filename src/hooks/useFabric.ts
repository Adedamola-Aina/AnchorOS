import { useCallback } from 'react';
import type { PatternAction, PatternTrigger } from '../types';
import { useFabricContext } from '../context/FabricContext';

export function useFabric() {
  const {
    isEnabled,
    isReady,
    context,
    patterns,
    confirmedPatterns,
    learnFrom,
    dismissPattern,
    deletePattern,
    clearAllData,
    refresh,
  } = useFabricContext();

  const safeLearnFrom = useCallback((trigger: PatternTrigger, action: PatternAction) => {
    if (!isEnabled) return;
    learnFrom(trigger, action);
  }, [isEnabled, learnFrom]);

  const safeDismissPattern = useCallback((patternId: string) => {
    if (!isEnabled) return;
    dismissPattern(patternId);
  }, [dismissPattern, isEnabled]);

  const safeDeletePattern = useCallback((patternId: string) => {
    if (!isEnabled) return;
    deletePattern(patternId);
  }, [deletePattern, isEnabled]);

  const safeClearAllData = useCallback(async () => {
    if (!isEnabled) return;
    await clearAllData();
  }, [clearAllData, isEnabled]);

  return {
    isEnabled,
    isReady,
    context,
    patterns,
    confirmedPatterns,
    learnFrom: safeLearnFrom,
    dismissPattern: safeDismissPattern,
    deletePattern: safeDeletePattern,
    clearAllData: safeClearAllData,
    refresh,
  };
}
