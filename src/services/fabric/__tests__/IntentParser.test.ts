import { describe, expect, it } from 'vitest';
import { parseIntent } from '../IntentParser';

describe('parseIntent', () => {
  it('parses spending queries with time period', () => {
    const result = parseIntent('how much did i spend this month');

    expect(result.action).toBe('query_spending');
    expect(result.entities.timePeriod).toBe('this_month');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('parses record expense with amount and category', () => {
    const result = parseIntent('record expense 45 groceries');

    expect(result.action).toBe('record_expense');
    expect(result.entities.amount).toBe(45);
    expect(result.entities.category).toBe('Groceries');
  });

  it('parses record income intent', () => {
    const result = parseIntent('add income 1200 salary');

    expect(result.action).toBe('record_income');
    expect(result.entities.amount).toBe(1200);
    expect(result.entities.category).toBe('salary');
  });

  it('parses commitments query intent', () => {
    const result = parseIntent('show my commitments this week');

    expect(result.action).toBe('query_commitments');
    expect(result.entities.timePeriod).toBe('this_week');
  });

  it('parses navigation intent', () => {
    const result = parseIntent('go to settings');

    expect(result.action).toBe('navigate');
    expect(result.entities.page).toBe('settings');
  });

  it('returns unknown for unmatched input', () => {
    const result = parseIntent('tell me a joke');

    expect(result.action).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.4);
  });
});
