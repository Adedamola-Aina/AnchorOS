import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FabricContext as FabricAmbientContext, PatternAction, PatternTrigger, UserPattern } from '../types';
import { useAuth } from './AuthContext';
import { evaluateFeatureFlag } from '../features/flags/featureFlags';
import { FabricService } from '../services/fabric/FabricService';

interface FabricContextValue {
  isEnabled: boolean;
  isReady: boolean;
  context: FabricAmbientContext;
  patterns: UserPattern[];
  confirmedPatterns: UserPattern[];
  learnFrom: (trigger: PatternTrigger, action: PatternAction) => void;
  dismissPattern: (patternId: string) => void;
  deletePattern: (patternId: string) => void;
  clearAllData: () => Promise<void>;
  refresh: () => void;
}

const FabricContext = createContext<FabricContextValue | undefined>(undefined);

const EMPTY_CONTEXT: FabricAmbientContext = {
  timeOfDay: 'morning',
  dayOfWeek: 0,
  isWeekend: false,
  isFirstOfMonth: false,
  isEndOfMonth: false,
  dayOfMonth: 1,
  hour: 0,
  specialContext: null,
};

export const FabricProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const fabricService = useMemo(() => FabricService.getInstance(), []);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<FabricAmbientContext>(EMPTY_CONTEXT);
  const [patterns, setPatterns] = useState<UserPattern[]>([]);
  const [confirmedPatterns, setConfirmedPatterns] = useState<UserPattern[]>([]);

  const refresh = useCallback(() => {
    setContext(fabricService.getContext());
    setPatterns(fabricService.getPatterns());
    setConfirmedPatterns(fabricService.getConfirmedPatterns());
    setIsEnabled(fabricService.isEnabled());
  }, [fabricService]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const enabledByFlag = evaluateFeatureFlag('anchor_ai_enabled', { userId: user?.uid ?? null });
      if (!user || !enabledByFlag) {
        if (!isMounted) return;
        setIsEnabled(false);
        setIsReady(false);
        setPatterns([]);
        setConfirmedPatterns([]);
        setContext(EMPTY_CONTEXT);
        return;
      }

      await fabricService.initialize(user.uid);
      if (!isMounted) return;
      refresh();
      setIsReady(true);
    };

    initialize();

    return () => {
      isMounted = false;
      fabricService.dispose();
    };
  }, [fabricService, refresh, user]);

  const learnFrom = useCallback((trigger: PatternTrigger, action: PatternAction) => {
    fabricService.learnFrom(trigger, action);
    refresh();
  }, [fabricService, refresh]);

  const dismissPattern = useCallback((patternId: string) => {
    fabricService.dismissPattern(patternId);
    refresh();
  }, [fabricService, refresh]);

  const deletePattern = useCallback((patternId: string) => {
    fabricService.deletePattern(patternId);
    refresh();
  }, [fabricService, refresh]);

  const clearAllData = useCallback(async () => {
    await fabricService.clearAllData();
    refresh();
  }, [fabricService, refresh]);

  const value = useMemo<FabricContextValue>(() => ({
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
  }), [clearAllData, confirmedPatterns, context, deletePattern, dismissPattern, isEnabled, isReady, learnFrom, patterns, refresh]);

  return (
    <FabricContext.Provider value={value}>
      {children}
    </FabricContext.Provider>
  );
};

export const useFabricContext = (): FabricContextValue => {
  const context = useContext(FabricContext);
  if (!context) throw new Error('useFabricContext must be used within FabricProvider');
  return context;
};
