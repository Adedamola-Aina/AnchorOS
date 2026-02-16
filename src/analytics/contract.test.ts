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
});
