import type {
  FabricQueryResult,
  ParsedIntent,
  Prediction,
  WeeklyReport,
} from './fabricPrediction';

export interface FabricContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  isWeekend: boolean;
  isFirstOfMonth: boolean;
  isEndOfMonth: boolean;
  dayOfMonth: number;
  hour: number;
  specialContext: SpecialContext | null;
}

export type SpecialContext =
  | 'tax_season'
  | 'holiday_season'
  | 'end_of_year'
  | 'new_year';

export interface UserPattern {
  id: string;
  trigger: PatternTrigger;
  followUpAction: PatternAction;
  frequency: number;
  confidence: number;
  lastOccurred: string;
  averageDelayMs: number;
  dismissed: number;
  createdAt: string;
  updatedAt: string;
}

export type PatternTrigger =
  | { type: 'commitment_completed'; commitmentId?: string; category?: string; keywords?: string[] }
  | { type: 'time_of_day'; hour: number; dayOfWeek?: number }
  | { type: 'transaction_recorded'; category?: string }
  | { type: 'app_opened' }
  | { type: 'page_visited'; page: string }
  | { type: 'period_start'; period: 'day' | 'week' | 'month' };

export type PatternAction =
  | { type: 'record_transaction'; prefill?: Partial<TransactionPrefill> }
  | { type: 'check_commitment'; commitmentId?: string }
  | { type: 'view_page'; page: string }
  | { type: 'review_budget'; category?: string }
  | { type: 'check_account'; accountId?: string };

export interface TransactionPrefill {
  title: string;
  amountCents: number;
  type: 'expense' | 'income';
  category: string;
  accountId: string;
}

export interface Insight {
  id: string;
  category: 'commitments' | 'spending' | 'patterns' | 'achievements' | 'household';
  headline: string;
  detail: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'positive' | 'neutral' | 'attention';
  metric?: {
    current: number;
    previous: number;
    unit: string;
  };
  actionLink?: string;
  createdAt: string;
}

export interface FabricMessage {
  id: string;
  role: 'user' | 'fabric';
  content: string;
  timestamp: string;
  metadata?: FabricMessageMetadata;
}

export interface FabricMessageMetadata {
  queriedDomains?: Array<'commitments' | 'finance' | 'patterns'>;
  suggestedActions?: FabricQuickAction[];
  confidence?: number;
  learningNotice?: string;
}

export interface FabricQuickAction {
  label: string;
  type: 'navigate' | 'record_transaction' | 'check_commitment' | 'view_report';
  payload: Record<string, unknown>;
}

export interface FabricConversation {
  messages: FabricMessage[];
  startedAt: string;
}

export interface FabricSettings {
  enabled: boolean;
  dataCollectionEnabled: boolean;
  lastCleared?: string;
}

export type AnchorAIIconState = 'resting' | 'breathing' | 'learning' | 'disabled';

export type ProactiveQuestionType =
  | 'missed_habit'
  | 'completion_drop'
  | 'category_spike'
  | 'surplus_idle';

export interface ProactiveQuestionState {
  question: string;
  questionType: ProactiveQuestionType;
  shownAt: string;
}

export interface IFabricService {
  initialize(userId: string): Promise<void>;
  getContext(): FabricContext;
  learnFrom(trigger: PatternTrigger, action: PatternAction): void;
  getPatterns(): UserPattern[];
  getConfirmedPatterns(): UserPattern[];
  dismissPattern(patternId: string): void;
  deletePattern(patternId: string): void;
  clearAllData(): Promise<void>;
  getPredictions(): Prediction[];
  dismissPrediction(predictionId: string): void;
  getInsightsFor(feature: 'dashboard' | 'commitments' | 'finance' | 'family'): Insight[];
  generateWeeklyReport(): Promise<WeeklyReport>;
  parseIntent(input: string): ParsedIntent;
  query(input: string): Promise<FabricQueryResult>;
  getProactiveQuestion(): string | null;
  markQuestionShown(question: ProactiveQuestionType | string): void;
}
