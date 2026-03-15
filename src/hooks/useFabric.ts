import { useCallback } from 'react';
import type { PatternAction, PatternTrigger } from '../types';
import type { MoodEntry } from '../types/fabricBriefing';
import { useFabricContext } from '../context/FabricContext';

export function useFabric() {
  const {
    isEnabled,
    isReady,
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

  const safeDismissPrediction = useCallback((predictionId: string) => {
    if (!isEnabled) return;
    dismissPrediction(predictionId);
  }, [dismissPrediction, isEnabled]);

  const safeRunQuery = useCallback(async (input: string) => {
    if (!isEnabled) return null;
    return runQuery(input);
  }, [isEnabled, runQuery]);

  const safeGenerateWeeklyReport = useCallback(async () => {
    if (!isEnabled) return null;
    return generateWeeklyReport();
  }, [generateWeeklyReport, isEnabled]);

  const safeSaveMood = useCallback(async (mood: MoodEntry['mood'], note?: string) => {
    if (!isEnabled) return;
    await saveMood(mood, note);
  }, [isEnabled, saveMood]);

  const safeClearAllData = useCallback(async () => {
    if (!isEnabled) return;
    await clearAllData();
  }, [clearAllData, isEnabled]);

  const safeMarkQuestionShown = useCallback((question: string) => {
    if (!isEnabled) return;
    markQuestionShown(question);
  }, [isEnabled, markQuestionShown]);

  return {
    isEnabled,
    isReady,
    context,
    patterns,
    confirmedPatterns,
    predictions,
    insights,
    lastQueryResult,
    weeklyReport,
    briefing,
    moodToday,
    learnFrom: safeLearnFrom,
    dismissPattern: safeDismissPattern,
    deletePattern: safeDeletePattern,
    dismissPrediction: safeDismissPrediction,
    runQuery: safeRunQuery,
    generateWeeklyReport: safeGenerateWeeklyReport,
    saveMood: safeSaveMood,
    clearAllData: safeClearAllData,
    proactiveQuestion,
    markQuestionShown: safeMarkQuestionShown,
    refresh,
  };
}
