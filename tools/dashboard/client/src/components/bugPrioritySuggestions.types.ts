export interface PrioritySuggestion {
  bugId: string;
  bugText: string;
  currentPriority: string | null;
  suggestedPriority: string;
  confidence: 'high' | 'medium' | 'low';
  score: number;
  reasoning: {
    keywords: string[];
    category: string;
    environment: string;
    envMultiplier: number;
  };
}

export interface SuggestionStats {
  total: number;
  byPriority: Record<string, number>;
  byConfidence: Record<string, number>;
  needsReview: number;
}
