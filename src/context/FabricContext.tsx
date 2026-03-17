import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  FabricQueryResult,
  Insight,
  PatternAction,
  PatternTrigger,
  Prediction,
  UserPattern,
  WeeklyReport,
} from '../types';
import type { DailyBriefing, MoodEntry } from '../types/fabricBriefing';
import type { FabricContext as FabricAmbientContext } from '../types';
import { useAuth } from './AuthContext';
import { FabricService } from '../services/fabric/FabricService';
import { secureDb } from '../utils/secureDb';
import { EMPTY_FABRIC_CONTEXT, type FabricContextValue } from './fabric/fabricContext.types';
import { useFabricInitialization } from './fabric/useFabricInitialization';
import { useFabricLiveSync } from './fabric/useFabricLiveSync';

const FabricContext = createContext<FabricContextValue | undefined>(undefined);

export const FabricProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const fabricService = useMemo(() => FabricService.getInstance(), []);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [context, setContext] = useState<FabricAmbientContext>(EMPTY_FABRIC_CONTEXT);
  const [patterns, setPatterns] = useState<UserPattern[]>([]);
  const [confirmedPatterns, setConfirmedPatterns] = useState<UserPattern[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [lastQueryResult, setLastQueryResult] = useState<FabricQueryResult | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [moodToday, setMoodToday] = useState<MoodEntry | null>(null);
  const [proactiveQuestion, setProactiveQuestion] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setContext(fabricService.getContext());
    setPatterns(fabricService.getPatterns());
    setConfirmedPatterns(fabricService.getConfirmedPatterns());
    setPredictions(fabricService.getPredictions());
    // Merge dashboard + family insights; family is a no-op if no shared transactions exist
    const dashboardInsights = fabricService.getInsightsFor('dashboard');
    const familyInsights = fabricService.getInsightsFor('family');
    const seenIds = new Set(dashboardInsights.map((i) => i.id));
    setInsights([...dashboardInsights, ...familyInsights.filter((i) => !seenIds.has(i.id))]);
    setIsEnabled(fabricService.isEnabled());
    setBriefing(fabricService.getBriefing());
    setProactiveQuestion(fabricService.getProactiveQuestion());
  }, [fabricService]);

  const resetDisabledState = useCallback(() => {
    setIsEnabled(false);
    setIsReady(false);
    setPatterns([]);
    setConfirmedPatterns([]);
    setPredictions([]);
    setInsights([]);
    setLastQueryResult(null);
    setWeeklyReport(null);
    setContext(EMPTY_FABRIC_CONTEXT);
  }, []);

  useFabricInitialization({
    userId,
    fabricService,
    refresh,
    resetDisabledState,
    setInitError,
    setIsEnabled,
    setIsReady,
  });

  useFabricLiveSync({
    userId,
    isEnabled,
    fabricService,
    refresh,
  });

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

  const markQuestionShown = useCallback((question: string) => {
    fabricService.markQuestionShown(question);
    setProactiveQuestion(null);
  }, [fabricService]);

  useEffect(() => {
    if (!userId || !isEnabled) return;
    const today = new Date().toISOString().slice(0, 10);
    void secureDb.getDocument<MoodEntry>(userId, ['mood_entries', today])
      .then((entry) => { if (entry) setMoodToday(entry); })
      .catch(() => { /* non-critical */ });
  }, [userId, isEnabled]);

  const saveMood = useCallback(async (mood: MoodEntry['mood'], note?: string) => {
    if (!userId) return;
    const today = new Date().toISOString().slice(0, 10);
    const entry: MoodEntry = { date: today, mood, ...(note ? { note } : {}), createdAt: new Date().toISOString() };
    setMoodToday(entry);
    await secureDb.setDocument(userId, ['mood_entries', today], entry as unknown as Record<string, unknown>);
  }, [userId]);

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
    briefing,
    moodToday,
    learnFrom,
    dismissPattern,
    deletePattern,
    dismissPrediction,
    runQuery,
    generateWeeklyReport,
    saveMood,
    clearAllData,
    proactiveQuestion,
    markQuestionShown,
    refresh,
  }), [briefing, clearAllData, confirmedPatterns, context, deletePattern, dismissPattern, dismissPrediction, generateWeeklyReport, insights, initError, isEnabled, isReady, lastQueryResult, learnFrom, markQuestionShown, moodToday, patterns, predictions, proactiveQuestion, refresh, runQuery, saveMood, weeklyReport]);

  return <FabricContext.Provider value={value}>{children}</FabricContext.Provider>;
};

export const useFabricContext = (): FabricContextValue => {
  const context = useContext(FabricContext);
  if (!context) throw new Error('useFabricContext must be used within FabricProvider');
  return context;
};
