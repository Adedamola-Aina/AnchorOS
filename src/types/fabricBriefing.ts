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
