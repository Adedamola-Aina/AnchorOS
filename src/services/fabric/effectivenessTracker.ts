/**
 * Fabric Insight Effectiveness Tracker — DATA-003
 *
 * Tracks the lifecycle of insights: viewed → dismissed / actioned.
 * Enables measurement of which insight types drive user behaviour.
 *
 * Interactions are kept in memory per session and can be persisted
 * via secureDb for cross-session analysis.
 */

export interface InsightInteraction {
  insightId: string;
  category: string;
  viewedAt: number;
  dismissedAt: number | null;
  actionedAt: number | null;
  actionedTransactionId: string | null;
}

export interface EffectivenessRate {
  viewCount: number;
  dismissCount: number;
  actionCount: number;
  actionRate: number;
  dismissRate: number;
}

/** In-memory interaction log for the current session. */
const interactions = new Map<string, InsightInteraction>();

/**
 * Record that an insight was viewed by the user.
 */
export function trackInsightViewed(
  insightId: string,
  category: string,
): InsightInteraction {
  const interaction: InsightInteraction = {
    insightId,
    category,
    viewedAt: Date.now(),
    dismissedAt: null,
    actionedAt: null,
    actionedTransactionId: null,
  };
  interactions.set(insightId, interaction);
  return interaction;
}

/**
 * Record that an insight was dismissed.
 * Returns null if the insight was never viewed in this session.
 */
export function trackInsightDismissed(
  insightId: string,
): InsightInteraction | null {
  const interaction = interactions.get(insightId);
  if (!interaction) return null;
  interaction.dismissedAt = Date.now();
  return interaction;
}

/**
 * Record that the user took action related to an insight
 * (e.g. created a transaction shortly after viewing an insight).
 */
export function trackInsightActioned(
  insightId: string,
  transactionId: string,
): InsightInteraction | null {
  const interaction = interactions.get(insightId);
  if (!interaction) return null;
  interaction.actionedAt = Date.now();
  interaction.actionedTransactionId = transactionId;
  return interaction;
}

/**
 * Calculate effectiveness rates from a set of interactions.
 * Pure function — usable in both client analysis and server reports.
 */
export function calculateEffectivenessRate(
  items: readonly InsightInteraction[],
): EffectivenessRate {
  const viewCount = items.length;
  if (viewCount === 0) {
    return { viewCount: 0, dismissCount: 0, actionCount: 0, actionRate: 0, dismissRate: 0 };
  }
  const actionCount = items.filter(i => i.actionedAt !== null).length;
  const dismissCount = items.filter(i => i.dismissedAt !== null).length;
  return {
    viewCount,
    dismissCount,
    actionCount,
    actionRate: actionCount / viewCount,
    dismissRate: dismissCount / viewCount,
  };
}

/**
 * Get all tracked interactions for the current session.
 */
export function getTrackedInteractions(): readonly InsightInteraction[] {
  return Array.from(interactions.values());
}

/**
 * Clear tracked interactions (for testing or session reset).
 */
export function clearTrackedInteractions(): void {
  interactions.clear();
}
