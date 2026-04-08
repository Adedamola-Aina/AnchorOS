import { describe, expect, it } from 'vitest';
import { parseIntent } from '../IntentParser';

describe('parseIntent natural transaction phrases', () => {
  it('recognises "i bought fuel for 7000 naira" as record_expense', () => {
    const result = parseIntent('i bought fuel for 7000 naira');
    expect(result.action).toBe('record_expense');
    expect(result.entities.amount).toBe(7000);
  });

  it('recognises "bought groceries for ₦5000" as record_expense', () => {
    const result = parseIntent('bought groceries for ₦5000');
    expect(result.action).toBe('record_expense');
    expect(result.entities.amount).toBe(5000);
    expect(result.entities.category).toBe('Groceries');
  });

  it('recognises "i purchased airtime for 2000 naira" as record_expense', () => {
    const result = parseIntent('i purchased airtime for 2000 naira');
    expect(result.action).toBe('record_expense');
    expect(result.entities.amount).toBe(2000);
  });

  it('recognises "just got food for 3500" as record_expense', () => {
    const result = parseIntent('just got food for 3500');
    expect(result.action).toBe('record_expense');
  });

  it('recognises "i used 1500 for transport" as record_expense', () => {
    const result = parseIntent('i used 1500 for transport');
    expect(result.action).toBe('record_expense');
    expect(result.entities.amount).toBe(1500);
  });

  it('recognises "charged 10000 for rent" as record_expense', () => {
    const result = parseIntent('charged 10000 for rent');
    expect(result.action).toBe('record_expense');
    expect(result.entities.amount).toBe(10000);
  });
});

describe('parseIntent still handles random questions gracefully', () => {
  it('returns unknown for "what is the meaning of life"', () => {
    const result = parseIntent('what is the meaning of life');
    expect(result.action).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.4);
  });

  it('returns unknown for "hello how are you"', () => {
    const result = parseIntent('hello how are you');
    expect(result.action).toBe('unknown');
  });

  it('returns unknown for "tell me about bitcoin"', () => {
    const result = parseIntent('tell me about bitcoin');
    expect(result.action).toBe('unknown');
  });
});
