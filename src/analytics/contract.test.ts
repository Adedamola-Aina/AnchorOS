// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { validateAnalyticsEvent } from './contract';

describe('analytics contract', () => {
  it('accepts a valid finance transaction event', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_transaction_created',
      payload: {
        accountId: 'acc-1',
        amountCents: 1200,
        type: 'expense',
      },
    });

    expect(event.name).toBe('finance_transaction_created');
  });

  it('rejects an invalid payload for known event', () => {
    expect(() =>
      validateAnalyticsEvent({
        name: 'onboarding_completed',
        payload: {
          durationMs: -10,
        },
      })
    ).toThrow();
  });

  it('rejects unknown event names', () => {
    expect(() =>
      validateAnalyticsEvent({
        name: 'unknown_event_name',
        payload: {},
      })
    ).toThrow();
  });

  it('accepts fabric_insight_viewed', () => {
    const event = validateAnalyticsEvent({
      name: 'fabric_insight_viewed',
      payload: { insightId: 'ins-1', category: 'spending', severity: 'attention' },
    });
    expect(event.name).toBe('fabric_insight_viewed');
  });

  it('accepts fabric_insight_dismissed', () => {
    const event = validateAnalyticsEvent({
      name: 'fabric_insight_dismissed',
      payload: { insightId: 'ins-1', category: 'spending' },
    });
    expect(event.name).toBe('fabric_insight_dismissed');
  });

  it('accepts fabric_prediction_dismissed', () => {
    const event = validateAnalyticsEvent({
      name: 'fabric_prediction_dismissed',
      payload: { predictionId: 'pred-1', predictionType: 'budget_overage' },
    });
    expect(event.name).toBe('fabric_prediction_dismissed');
  });

  it('accepts fabric_prediction_actioned', () => {
    const event = validateAnalyticsEvent({
      name: 'fabric_prediction_actioned',
      payload: { predictionId: 'pred-1', predictionType: 'streak_at_risk' },
    });
    expect(event.name).toBe('fabric_prediction_actioned');
  });

  it('accepts fabric_query_submitted', () => {
    const event = validateAnalyticsEvent({
      name: 'fabric_query_submitted',
      payload: { intentAction: 'query_spending', confidence: 0.9, hasResult: true },
    });
    expect(event.name).toBe('fabric_query_submitted');
  });

  it('accepts fabric_nudge_received', () => {
    const event = validateAnalyticsEvent({
      name: 'fabric_nudge_received',
      payload: { nudgeType: 'streak_risk' },
    });
    expect(event.name).toBe('fabric_nudge_received');
  });

  it('accepts fabric_proactive_question_dismissed', () => {
    const event = validateAnalyticsEvent({
      name: 'fabric_proactive_question_dismissed',
      payload: { questionType: 'missed_habit' },
    });
    expect(event.name).toBe('fabric_proactive_question_dismissed');
  });
});
