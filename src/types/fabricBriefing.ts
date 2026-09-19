/** An upcoming bill or scheduled payment derived from recurring transactions. */
export interface UpcomingItem {
  id: string;
  type: 'bill' | 'commitment';
  title: string;
  dueDate: string; // ISO date string
  amountCents?: number;
  currency?: string;
  category?: string;
  isToday: boolean;
  isTomorrow: boolean;
  daysUntil: number;
}

export interface TodayStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  /** Best active streak across all commitments (requires >= 3 days). */
  streakHighlight?: { title: string; days: number };
  /** Outstanding and past its most recent scheduled day (P1b, UX-AI-06). */
  overdueTasks?: number;
  /**
   * Commitments the user tracks, due or not. Lets a genuinely empty day say
   * *why* it is empty instead of implying the user has nothing at all (P1b).
   */
  trackedCommitments?: number;
  /** Deterministic label for the next scheduled day, e.g. "Mon" (P1b). */
  nextDueLabel?: string;
}

export interface DailyBriefing {
  greeting: string;
  /** Short subtitle line for the header (e.g. "3 tasks today · Netflix due tomorrow"). */
  subtitle: string;
  todayStats: TodayStats;
  upcoming: UpcomingItem[];
  /** Total expenses for the current calendar week (cents). */
  spendingThisWeek: number;
  currency: string;
  /** Day-of-week pattern insight (e.g. high-spend or best-completion day). */
  dayInsight?: string;
  generatedAt: string;
}

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
  createdAt: string;
}
