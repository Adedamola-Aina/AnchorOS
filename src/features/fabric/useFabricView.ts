import { useEffect, useRef, useState } from 'react';
import { useFabric } from '../../hooks/useFabric';
import { useApp } from '../../context/AnchorContext';
import { logProductEvent } from '../../services/telemetry';
import type { FabricQueryResult, TabView } from '../../types';
import type { Currency } from '../../services/fabric/fabricUtils';

interface UseFabricViewResult {
  isEnabled: boolean;
  isReady: boolean;
  patterns: ReturnType<typeof useFabric>['patterns'];
  insights: ReturnType<typeof useFabric>['insights'];
  predictions: ReturnType<typeof useFabric>['predictions'];
  weeklyReport: ReturnType<typeof useFabric>['weeklyReport'];
  briefing: ReturnType<typeof useFabric>['briefing'];
  moodToday: ReturnType<typeof useFabric>['moodToday'];
  learnFrom: ReturnType<typeof useFabric>['learnFrom'];
  dismissPrediction: ReturnType<typeof useFabric>['dismissPrediction'];
  generateWeeklyReport: ReturnType<typeof useFabric>['generateWeeklyReport'];
  saveMood: ReturnType<typeof useFabric>['saveMood'];
  proactiveQuestion: ReturnType<typeof useFabric>['proactiveQuestion'];
  markQuestionShown: ReturnType<typeof useFabric>['markQuestionShown'];
  queryResult: FabricQueryResult | null;
  isQuerying: boolean;
  freeText: string;
  setFreeText: (text: string) => void;
  questionDismissed: boolean;
  setQuestionDismissed: (dismissed: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  submitPrompt: (prompt: string) => Promise<void>;
  handleAction: (type: string, payload: Record<string, unknown>) => void;
  currency: Currency;
}

export function useFabricView(): UseFabricViewResult {
  const { navigateTo } = useApp();
  const [queryResult, setQueryResult] = useState<FabricQueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [questionDismissed, setQuestionDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isEnabled,
    isReady,
    patterns,
    insights,
    predictions,
    weeklyReport,
    briefing,
    moodToday,
    learnFrom,
    dismissPrediction,
    runQuery,
    generateWeeklyReport,
    saveMood,
    proactiveQuestion,
    markQuestionShown,
  } = useFabric();

  useEffect(() => {
    learnFrom({ type: 'page_visited', page: 'fabric' }, { type: 'view_page', page: 'fabric' });
  }, [learnFrom]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestionDismissed(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [isReady]);

  const submitPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setIsQuerying(true);
    setQueryResult(null);
    const result = await runQuery(trimmed);
    setQueryResult(result ?? null);
    setIsQuerying(false);
    try {
      logProductEvent('fabric_query_submitted', {
        intentAction: 'unknown',
        confidence: 0,
        hasResult: !!result?.summary,
      });
    } catch { /* telemetry must never break the UI */ }
  };

  const handleAction = (type: string, payload: Record<string, unknown>) => {
    if (type === 'navigate' && typeof payload.page === 'string') {
      navigateTo(payload.page as TabView);
    }
    if (type === 'record_transaction') {
      navigateTo('finance', {
        amount: payload.amount as number | undefined,
        category: payload.category as string | undefined,
        description: payload.title as string | undefined,
      });
    }
  };

  const currency = (briefing?.currency ?? 'USD') as Currency;

  return {
    isEnabled,
    isReady,
    patterns,
    insights,
    predictions,
    weeklyReport,
    briefing,
    moodToday,
    learnFrom,
    dismissPrediction,
    generateWeeklyReport,
    saveMood,
    proactiveQuestion,
    markQuestionShown,
    queryResult,
    isQuerying,
    freeText,
    setFreeText,
    questionDismissed,
    setQuestionDismissed,
    inputRef,
    submitPrompt,
    handleAction,
    currency,
  };
}
