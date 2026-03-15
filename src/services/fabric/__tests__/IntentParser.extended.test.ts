import { describe, expect, it } from 'vitest';
import { parseIntent } from '../IntentParser';

describe('parseIntent extended intent rules', () => {
  it('parses savings-rate intent from natural language', () => {
    const result = parseIntent('am I saving enough');

    expect(result.action).toBe('query_savings_rate');
    expect(result.confidence).toBe(0.8);
  });

  it('parses day-of-week spending intent', () => {
    const result = parseIntent('which day do I spend most');

    expect(result.action).toBe('query_day_of_week');
    expect(result.confidence).toBe(0.8);
  });

  it('parses habits-finance correlation intent', () => {
    const result = parseIntent('connection between habits and spending');

    expect(result.action).toBe('query_correlation');
    expect(result.confidence).toBe(0.8);
  });

  it('parses momentum intent', () => {
    const result = parseIntent('how am I trending this week');

    expect(result.action).toBe('query_momentum');
    expect(result.confidence).toBe(0.8);
  });
});

describe('parseIntent category aliases for Nigerian merchants', () => {
  it('maps shoprite to Groceries', () => {
    const result = parseIntent('record expense 15000 at shoprite');

    expect(result.action).toBe('record_expense');
    expect(result.entities.category).toBe('Groceries');
  });

  it('maps dstv to Bills & Utilities', () => {
    const result = parseIntent('record expense 12000 dstv payment');

    expect(result.action).toBe('record_expense');
    expect(result.entities.category).toBe('Bills & Utilities');
  });

  it('maps bolt to Transportation', () => {
    const result = parseIntent('record expense 4500 bolt ride');

    expect(result.action).toBe('record_expense');
    expect(result.entities.category).toBe('Transportation');
  });
});

describe('parseIntent unknown fallback', () => {
  it('returns unknown with explicit 0.15 confidence', () => {
    const result = parseIntent('tell me a joke about robots');

    expect(result.action).toBe('unknown');
    expect(result.confidence).toBe(0.15);
  });
});
