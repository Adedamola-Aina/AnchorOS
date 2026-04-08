import { describe, it, expect } from 'vitest';
import type { FabricMessage } from '../../../types';
import { resolveContextualIntent } from '../contextualIntent';

function msg(role: 'user' | 'fabric', content: string): FabricMessage {
  return { id: `m-${Math.random()}`, role, content, timestamp: new Date().toISOString() };
}

describe('resolveContextualIntent', () => {
  it('returns null when no context provided', () => {
    expect(resolveContextualIntent('what about last month', undefined)).toBeNull();
  });

  it('returns null when context is empty', () => {
    expect(resolveContextualIntent('what about last month', [])).toBeNull();
  });

  it('returns null when input is already a clear intent', () => {
    const context = [
      msg('user', 'how much did I spend on food'),
      msg('fabric', 'You spent $120 on Food this month.'),
    ];
    // "how much on transport" is self-contained — no context needed
    expect(resolveContextualIntent('how much did I spend on transport', context)).toBeNull();
  });

  it('infers spending category from prior context for follow-up', () => {
    const context = [
      msg('user', 'how much did I spend on food'),
      msg('fabric', 'You spent $120 on Food this month.'),
    ];
    const result = resolveContextualIntent('and last month?', context);
    expect(result).not.toBeNull();
    expect(result!.action).toBe('query_spending');
    expect(result!.entities.category).toBe('Groceries');
    expect(result!.entities.timePeriod).toBe('last_month');
  });

  it('infers income query from prior income context', () => {
    const context = [
      msg('user', 'what was my income this month'),
      msg('fabric', 'You earned $3000 this month.'),
    ];
    const result = resolveContextualIntent('and last month', context);
    expect(result).not.toBeNull();
    expect(result!.action).toBe('query_income');
  });

  it('infers commitments query from prior commitment context', () => {
    const context = [
      msg('user', 'show my commitments'),
      msg('fabric', 'You have 5 active commitments.'),
    ];
    const result = resolveContextualIntent('how about this week', context);
    expect(result).not.toBeNull();
    expect(result!.action).toBe('query_commitments');
  });

  it('does not resolve if follow-up is unrelated', () => {
    const context = [
      msg('user', 'how much did I spend on food'),
      msg('fabric', 'You spent $120 on Food this month.'),
    ];
    // completely different question
    expect(resolveContextualIntent('navigate to settings', context)).toBeNull();
  });
});
