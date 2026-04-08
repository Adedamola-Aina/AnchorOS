import { describe, expect, it } from 'vitest';
import type { ParsedIntent } from '../../../types';
import { runFabricQuery } from '../QueryEngine';

const now = new Date('2026-03-09T10:00:00.000Z');

function run(intent: ParsedIntent) {
  return runFabricQuery({
    intent,
    input: intent.rawInput,
    transactions: [],
    commitments: [],
    accounts: [],
    recurring: [],
    now,
  });
}

describe('QueryEngine smart fallback', () => {
  it('infers record_expense when unknown but has amount + category', () => {
    const result = run({
      action: 'unknown',
      confidence: 0.15,
      entities: { amount: 7000, category: 'fuel' },
      rawInput: 'i bought fuel for 7000 naira',
    });
    expect(result.summary).toContain('log');
    expect(result.actions).toHaveLength(1);
    expect(result.actions![0].type).toBe('record_transaction');
  });

  it('infers record_expense when unknown but has amount only', () => {
    const result = run({
      action: 'unknown',
      confidence: 0.15,
      entities: { amount: 5000 },
      rawInput: 'i just used 5000',
    });
    expect(result.summary).toContain('log');
    expect(result.actions![0].type).toBe('record_transaction');
  });

  it('returns generic fallback when truly unknown (no entities)', () => {
    const result = run({
      action: 'unknown',
      confidence: 0.15,
      entities: {},
      rawInput: 'what is the meaning of life',
    });
    expect(result.summary).toContain("not something I can help with");
    expect(result.detail).toContain('Try asking');
  });
});
