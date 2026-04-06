import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/secureDb', () => ({
  secureSetDoc: vi.fn().mockResolvedValue(undefined),
  secureGetDoc: vi.fn().mockResolvedValue(null),
}));

import {
  trackInsightViewed,
  trackInsightDismissed,
  trackInsightActioned,
  calculateEffectivenessRate,
  type InsightInteraction,
} from './effectivenessTracker';

describe('effectivenessTracker', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('trackInsightViewed', () => {
    it('returns an interaction with viewedAt set', () => {
      const interaction = trackInsightViewed('insight-1', 'spending');
      expect(interaction.insightId).toBe('insight-1');
      expect(interaction.category).toBe('spending');
      expect(typeof interaction.viewedAt).toBe('number');
      expect(interaction.dismissedAt).toBeNull();
      expect(interaction.actionedAt).toBeNull();
    });

    it('records a unique interaction per insight', () => {
      const i1 = trackInsightViewed('a', 'spending');
      const i2 = trackInsightViewed('b', 'subscription');
      expect(i1.insightId).not.toBe(i2.insightId);
    });
  });

  describe('trackInsightDismissed', () => {
    it('sets dismissedAt on the interaction', () => {
      trackInsightViewed('insight-2', 'savings');
      const result = trackInsightDismissed('insight-2');
      expect(result).not.toBeNull();
      expect(result!.dismissedAt).not.toBeNull();
    });

    it('returns null if insight was never viewed', () => {
      const result = trackInsightDismissed('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('trackInsightActioned', () => {
    it('sets actionedAt and transactionId', () => {
      trackInsightViewed('insight-3', 'spending');
      const result = trackInsightActioned('insight-3', 'tx-100');
      expect(result).not.toBeNull();
      expect(result!.actionedAt).not.toBeNull();
      expect(result!.actionedTransactionId).toBe('tx-100');
    });

    it('returns null if insight was never viewed', () => {
      const result = trackInsightActioned('unknown-id', 'tx-1');
      expect(result).toBeNull();
    });
  });

  describe('calculateEffectivenessRate', () => {
    it('returns 0 when no interactions exist', () => {
      const rate = calculateEffectivenessRate([]);
      expect(rate.viewCount).toBe(0);
      expect(rate.actionRate).toBe(0);
      expect(rate.dismissRate).toBe(0);
    });

    it('calculates correct rates', () => {
      const interactions: InsightInteraction[] = [
        { insightId: 'a', category: 'x', viewedAt: 1, dismissedAt: null, actionedAt: 2, actionedTransactionId: 'tx' },
        { insightId: 'b', category: 'x', viewedAt: 1, dismissedAt: 3, actionedAt: null, actionedTransactionId: null },
        { insightId: 'c', category: 'x', viewedAt: 1, dismissedAt: null, actionedAt: null, actionedTransactionId: null },
        { insightId: 'd', category: 'x', viewedAt: 1, dismissedAt: null, actionedAt: 5, actionedTransactionId: 'tx2' },
      ];
      const rate = calculateEffectivenessRate(interactions);
      expect(rate.viewCount).toBe(4);
      expect(rate.actionRate).toBeCloseTo(0.5, 2);  // 2/4
      expect(rate.dismissRate).toBeCloseTo(0.25, 2); // 1/4
    });

    it('handles all-dismissed case', () => {
      const interactions: InsightInteraction[] = [
        { insightId: 'a', category: 'x', viewedAt: 1, dismissedAt: 2, actionedAt: null, actionedTransactionId: null },
        { insightId: 'b', category: 'x', viewedAt: 1, dismissedAt: 3, actionedAt: null, actionedTransactionId: null },
      ];
      const rate = calculateEffectivenessRate(interactions);
      expect(rate.actionRate).toBe(0);
      expect(rate.dismissRate).toBe(1);
    });
  });
});
