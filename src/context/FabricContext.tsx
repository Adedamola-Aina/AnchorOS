import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where, limit } from 'firebase/firestore';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  FabricContext as FabricAmbientContext,
  FabricQueryResult,
  Insight,
  PatternAction,
  PatternTrigger,
  Prediction,
  ProactiveQuestionType,
  RecurringTransaction,
  UserPattern,
  WeeklyReport,
} from '../types';
import type { DailyBriefing, MoodEntry } from '../types/fabricBriefing';
import { useAuth } from './AuthContext';
import { evaluateFeatureFlag } from '../features/flags/featureFlags';
import { FabricService } from '../services/fabric/FabricService';
import { db, APP_ID } from '../config/firebase';
import { secureDb } from '../utils/secureDb';

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
  briefing: DailyBriefing | null;
  moodToday: MoodEntry | null;
  learnFrom: (trigger: PatternTrigger, action: PatternAction) => void;
  dismissPattern: (patternId: string) => void;
  deletePattern: (patternId: string) => void;
  dismissPrediction: (predictionId: string) => void;
  runQuery: (input: string) => Promise<FabricQueryResult>;
  generateWeeklyReport: () => Promise<WeeklyReport | null>;
  saveMood: (mood: MoodEntry['mood'], note?: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  proactiveQuestion: string | null;
  markQuestionShown: (questionType: ProactiveQuestionType) => void;
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
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [moodToday, setMoodToday] = useState<MoodEntry | null>(null);
  const [proactiveQuestion, setProactiveQuestion] = useState<string | null>(null);

  // Live data refs — updated by Firestore subscriptions below
  const liveTransactions = useRef<AnchorTransaction[]>([]);
  const liveCommitments = useRef<AnchorTask[]>([]);
  const liveAccounts = useRef<AnchorAccount[]>([]);
  const liveRecurring = useRef<RecurringTransaction[]>([]);

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

  // Keep FabricService in sync with live Firestore data so queries reflect
  // real-time changes without requiring a full re-initialization.
  useEffect(() => {
    if (!user || !isEnabled) return;
    const uid = user.uid;

    const push = () => {
      fabricService.updateActivity(
        liveTransactions.current,
        liveCommitments.current,
        liveAccounts.current,
        liveRecurring.current,
      );
      refresh();
    };

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const unsubFinance = onSnapshot(
      query(
        collection(db, 'artifacts', APP_ID, 'users', uid, 'finance'),
        where('date', '>=', oneYearAgo.toISOString()),
        orderBy('date', 'desc'),
        limit(500),
      ),
      (snap) => {
        liveTransactions.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnchorTransaction));
        push();
      },
    );

    const unsubCommitments = onSnapshot(
      collection(db, 'artifacts', APP_ID, 'users', uid, 'commitments'),
      (snap) => {
        liveCommitments.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnchorTask));
        push();
      },
    );

    const unsubAccounts = onSnapshot(
      query(collection(db, 'artifacts', APP_ID, 'users', uid, 'accounts'), limit(50)),
      (snap) => {
        liveAccounts.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnchorAccount));
        push();
      },
    );

    const unsubRecurring = onSnapshot(
      query(
        collection(db, 'artifacts', APP_ID, 'recurring_transactions'),
        where('userId', '==', uid),
      ),
      (snap) => {
        liveRecurring.current = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurringTransaction));
        push();
      },
    );

    return () => {
      unsubFinance();
      unsubCommitments();
      unsubAccounts();
      unsubRecurring();
    };
  }, [user, isEnabled, fabricService, refresh]);

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

  const markQuestionShown = useCallback((questionType: ProactiveQuestionType) => {
    fabricService.markQuestionShown(questionType);
    setProactiveQuestion(null);
  }, [fabricService]);

  // Load today's mood on mount (once user is known)
  useEffect(() => {
    if (!user || !isEnabled) return;
    const today = new Date().toISOString().slice(0, 10);
    void secureDb.getDocument<MoodEntry>(user.uid, ['mood_entries', today])
      .then((entry) => { if (entry) setMoodToday(entry); })
      .catch(() => { /* non-critical */ });
  }, [user, isEnabled]);

  const saveMood = useCallback(async (mood: MoodEntry['mood'], note?: string) => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const entry: MoodEntry = { date: today, mood, ...(note ? { note } : {}), createdAt: new Date().toISOString() };
    setMoodToday(entry);
    await secureDb.setDocument(user.uid, ['mood_entries', today], entry as unknown as Record<string, unknown>);
  }, [user]);

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
  }), [
    briefing,
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
    markQuestionShown,
    moodToday,
    patterns,
    predictions,
    proactiveQuestion,
    refresh,
    runQuery,
    saveMood,
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
