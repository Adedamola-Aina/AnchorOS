// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { validateAnalyticsEvent } from './contract';

describe('analytics contract — UX-041 finance card events', () => {
  it('validates finance_card_tapped', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_card_tapped',
      payload: { accountId: 'acc-1', viewMode: 'collapsed' },
    });
    expect(event.name).toBe('finance_card_tapped');
  });

  it('validates finance_card_reordered', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_card_reordered',
      payload: { accountId: 'acc-1', fromIndex: 0, toIndex: 2 },
    });
    expect(event.name).toBe('finance_card_reordered');
  });

  it('validates finance_card_color_changed', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_card_color_changed',
      payload: { accountId: 'acc-1', color: '#3D52D5' },
    });
    expect(event.name).toBe('finance_card_color_changed');
  });

  it('validates finance_card_artwork_changed', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_card_artwork_changed',
      payload: { accountId: 'acc-1', presetId: 'waves' },
    });
    expect(event.name).toBe('finance_card_artwork_changed');
  });

  it('validates finance_transaction_exported', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_transaction_exported',
      payload: { accountId: 'acc-1', transactionCount: 12 },
    });
    expect(event.name).toBe('finance_transaction_exported');
  });

  it('validates finance_account_deleted', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_account_deleted',
      payload: { accountId: 'acc-1' },
    });
    expect(event.name).toBe('finance_account_deleted');
  });

  it('validates finance_view_mode_toggled', () => {
    const event = validateAnalyticsEvent({
      name: 'finance_view_mode_toggled',
      payload: { mode: 'expanded' },
    });
    expect(event.name).toBe('finance_view_mode_toggled');
  });

  it('rejects invalid view mode', () => {
    expect(() => validateAnalyticsEvent({
      name: 'finance_view_mode_toggled',
      payload: { mode: 'invalid' },
    })).toThrow();
  });
});
