import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  FabricContext as FabricAmbientContext,
  FabricQueryResult,
  Insight,
  PatternAction,
  PatternTrigger,
  Prediction,
  UserPattern,
  WeeklyReport,
} from '../types';
import { useAuth } from './AuthContext';
import { evaluateFeatureFlag } from '../features/flags/featureFlags';
import { FabricService } from '../services/fabric/FabricService';

interface FabricContextValue {
  isEnabled: boolean;
  isReady: boolean;
  initError: string | null;
  context: FabricAmbientContext;
  patterns: UserPattern[];
  confirmedPatterns: UserPattern[];
  predictions: Prediction[];
  insights: Insight[];
  lastQueryResult: FabricQueryResult | null;
  weeklyReport: WeeklyReport | null;
  learnFrom: (trigger: PatternTrigger, action: PatternAction) => void;
  dismissPattern: (patternId: string) => void;
  deletePattern: (patternId: string) => void;
  dismissPrediction: (predictionId: string) => void;
  runQuery: (input: string) => Promise<FabricQueryResult>;
  generateWeeklyReport: () => Promise<WeeklyReport | null>;
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
  const [initError, setInitError] = useState<string | null>(null);
  const [context, setContext] = useState<FabricAmbientContext>(EMPTY_CONTEXT);
  const [patterns, setPatterns] = useState<UserPattern[]>([]);
  const [confirmedPatterns, setConfirmedPatterns] = useState<UserPattern[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [lastQueryResult, setLastQueryResult] = useState<FabricQueryResult | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);

  const refresh = useCallback(() => {
    setContext(fabricService.getContext());
    setPatterns(fabricService.getPatterns());
    setConfirmedPatterns(fabricService.getConfirmedPatterns());
    setPredictions(fabricService.getPredictions());
    setInsights(fabricService.getInsightsFor('dashboard'));
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
        setPredictions([]);
        setInsights([]);
        setLastQueryResult(null);
        setWeeklyReport(null);
        setContext(EMPTY_CONTEXT);
        return;
      }

      try {
        await fabricService.initialize(user.uid);
        if (!isMounted) return;
        setInitError(null);
        refresh();
        setIsReady(true);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Failed to initialize Anchor AI';
        console.error('[Fabric] Initialization failed:', err);
        setInitError(message);
        setIsEnabled(false);
        setIsReady(true);
      }
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

  const dismissPrediction = useCallback((predictionId: string) => {
    fabricService.dismissPrediction(predictionId);
    refresh();
  }, [fabricService, refresh]);

  const runQuery = useCallback(async (input: string) => {
    const result = await fabricService.query(input);
    setLastQueryResult(result);
    return result;
  }, [fabricService]);

  const generateWeeklyReport = useCallback(async () => {
    if (!fabricService.isEnabled()) return null;
    const report = await fabricService.generateWeeklyReport();
    setWeeklyReport(report);
    return report;
  }, [fabricService]);

  const clearAllData = useCallback(async () => {
    await fabricService.clearAllData();
    refresh();
  }, [fabricService, refresh]);

  const value = useMemo<FabricContextValue>(() => ({
    isEnabled,
    isReady,
    initError,
    context,
    patterns,
    confirmedPatterns,
    predictions,
    insights,
    lastQueryResult,
    weeklyReport,
    learnFrom,
    dismissPattern,
    deletePattern,
    dismissPrediction,
    runQuery,
    generateWeeklyReport,
    clearAllData,
    refresh,
  }), [
    clearAllData,
    confirmedPatterns,
    context,
    deletePattern,
    dismissPattern,
    dismissPrediction,
    generateWeeklyReport,
    insights,
    initError,
    isEnabled,
    isReady,
    lastQueryResult,
    learnFrom,
    patterns,
    predictions,
    refresh,
    runQuery,
    weeklyReport,
  ]);

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
