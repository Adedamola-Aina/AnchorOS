import type {
  FabricContext as FabricAmbientContext,
  FabricQueryResult,
  Insight,
  PatternAction,
  PatternTrigger,
  Prediction,
  UserPattern,
  WeeklyReport,
} from '../../types';
import type { DailyBriefing, MoodEntry } from '../../types/fabricBriefing';

export interface FabricContextValue {
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
  markQuestionShown: (question: string) => void;
  refresh: () => void;
}

export const EMPTY_FABRIC_CONTEXT: FabricAmbientContext = {
  timeOfDay: 'morning',
  dayOfWeek: 0,
  isWeekend: false,
  isFirstOfMonth: false,
  isEndOfMonth: false,
  dayOfMonth: 1,
  hour: 0,
  specialContext: null,
};
