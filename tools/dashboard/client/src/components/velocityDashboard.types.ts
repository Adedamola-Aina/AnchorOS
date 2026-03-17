export interface VelocityStats {
  currentVelocity: number;
  averageCycleTime: number | null;
  totalCompletions: number;
  weeklyStats: Array<{
    week: string;
    completed: number;
    velocity: number;
  }>;
  recentCompletions: Array<{
    itemId: string;
    completedDate: string;
    cycleTime: number | null;
  }>;
}

export interface CompletionPrediction {
  weeksRemaining: number;
  daysRemaining: number;
  date: string;
}
