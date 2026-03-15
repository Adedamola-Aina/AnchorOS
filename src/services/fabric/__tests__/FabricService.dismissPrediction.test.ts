import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FabricService } from '../FabricService';

const getDocument = vi.fn();
const setDocument = vi.fn();
const queryCollection = vi.fn();

vi.mock('../../../utils/secureDb', () => ({
  secureDb: {
    getDocument: (...args: unknown[]) => getDocument(...args),
    setDocument: (...args: unknown[]) => setDocument(...args),
    queryCollection: (...args: unknown[]) => queryCollection(...args),
  },
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  query: vi.fn(),
  where: vi.fn(),
}));

vi.mock('../../../config/firebase', () => ({
  db: {},
  APP_ID: 'test-app',
}));

describe('FabricService.dismissPrediction — pattern feedback', () => {
  beforeEach(() => {
    FabricService.resetForTests();
    vi.clearAllMocks();
    getDocument.mockImplementation((_userId: string, path: string[]) => {
      if (path[0] === 'fabric_settings') {
        return Promise.resolve({ enabled: true, dataCollectionEnabled: true });
      }
      if (path[0] === 'fabric_behavior') {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });
    setDocument.mockResolvedValue(undefined);
    queryCollection.mockResolvedValue([]);
  });

  it('decreases confidence of review_budget pattern when budget_overage prediction is dismissed', async () => {
    const service = FabricService.getInstance();
    await service.initialize('user-1');

    // Record enough actions to build a confirmed pattern
    for (let i = 0; i < 5; i++) {
      service.learnFrom(
        { type: 'transaction_recorded', category: 'Food' },
        { type: 'review_budget', category: 'Food' },
      );
    }

    const patternsBefore = service.getPatterns();
    const budgetPattern = patternsBefore.find(
      (p) => p.followUpAction.type === 'review_budget',
    );
    expect(budgetPattern).toBeDefined();
    const confidenceBefore = budgetPattern!.confidence;

    // Dismiss a budget_overage prediction
    service.dismissPrediction('pred-budget-overage-2026-03');

    const patternsAfter = service.getPatterns();
    const patternAfter = patternsAfter.find((p) => p.id === budgetPattern!.id);
    expect(patternAfter).toBeDefined();
    expect(patternAfter!.dismissed).toBe(1);
    expect(patternAfter!.confidence).toBeLessThan(confidenceBefore);
  });

  it('decreases confidence of commitment pattern when streak_at_risk prediction is dismissed', async () => {
    const service = FabricService.getInstance();
    await service.initialize('user-1');

    for (let i = 0; i < 5; i++) {
      service.learnFrom(
        { type: 'commitment_completed', category: 'personal' },
        { type: 'check_commitment' },
      );
    }

    const patternsBefore = service.getPatterns();
    const streakPattern = patternsBefore.find(
      (p) => p.trigger.type === 'commitment_completed',
    );
    expect(streakPattern).toBeDefined();
    const confidenceBefore = streakPattern!.confidence;

    service.dismissPrediction('pred-streak-risk-2026-03-15');

    const patternsAfter = service.getPatterns();
    const patternAfter = patternsAfter.find((p) => p.id === streakPattern!.id);
    expect(patternAfter).toBeDefined();
    expect(patternAfter!.dismissed).toBe(1);
    expect(patternAfter!.confidence).toBeLessThan(confidenceBefore);
  });

  it('does not dismiss any pattern for unrelated prediction types', async () => {
    const service = FabricService.getInstance();
    await service.initialize('user-1');

    for (let i = 0; i < 5; i++) {
      service.learnFrom(
        { type: 'transaction_recorded', category: 'Food' },
        { type: 'review_budget', category: 'Food' },
      );
    }

    const patternsBefore = service.getPatterns();
    const confidences = patternsBefore.map((p) => ({ id: p.id, confidence: p.confidence, dismissed: p.dismissed }));

    service.dismissPrediction('pred-cash-flow-alert-2026-03');

    const patternsAfter = service.getPatterns();
    for (const before of confidences) {
      const after = patternsAfter.find((p) => p.id === before.id);
      expect(after?.dismissed).toBe(before.dismissed);
    }
  });
});
