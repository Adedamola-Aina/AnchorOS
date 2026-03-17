import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ProactiveQuestionState,
  UserPattern,
} from '../../../types';
import {
  getProactiveQuestionText,
  resolveQuestionShownState,
} from '../fabricServiceQuestionUtils';

const generateProactiveQuestion = vi.fn();

vi.mock('../ProactiveQuestionEngine', () => ({
  generateProactiveQuestion: (...args: unknown[]) => generateProactiveQuestion(...args),
}));

interface TestInput {
  engine: { getPatterns: () => UserPattern[] };
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  accounts: AnchorAccount[];
}

function makeInput(overrides: Partial<TestInput> = {}): TestInput {
  return {
    engine: { getPatterns: () => [] },
    transactions: [],
    commitments: [],
    accounts: [],
    ...overrides,
  };
}

describe('fabricServiceQuestionUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns proactive question text when engine yields a question', () => {
    generateProactiveQuestion.mockReturnValue({
      question: 'Want to review your commitments?',
      questionType: 'completion_drop',
    });

    const result = getProactiveQuestionText(makeInput(), null);

    expect(result).toBe('Want to review your commitments?');
  });

  it('returns null when proactive question engine returns no suggestion', () => {
    generateProactiveQuestion.mockReturnValue(null);

    const result = getProactiveQuestionText(makeInput(), null);

    expect(result).toBeNull();
  });

  it('resolves shown state directly for known proactive question types', () => {
    generateProactiveQuestion.mockReturnValue(null);

    const result = resolveQuestionShownState(makeInput(), 'missed_habit');

    expect(result).toMatchObject({
      question: 'missed_habit',
      questionType: 'missed_habit',
    });
    expect(result?.shownAt).toEqual(expect.any(String));
  });

  it('resolves shown state from generated result for plain question text', () => {
    generateProactiveQuestion.mockReturnValue({
      question: 'Spending in Food is higher than usual this week. Want to take a look?',
      questionType: 'category_spike',
    });

    const question = 'Spending in Food is higher than usual this week. Want to take a look?';
    const result = resolveQuestionShownState(makeInput(), question);

    expect(result).toMatchObject({
      question,
      questionType: 'category_spike',
    });
  });

  it('returns null when plain question does not match generated question', () => {
    generateProactiveQuestion.mockReturnValue({
      question: 'You have surplus funds available. Would you like to set a savings goal?',
      questionType: 'surplus_idle',
    });

    const result = resolveQuestionShownState(makeInput(), 'Some other question');

    expect(result).toBeNull();
  });

  it('passes last question state through to proactive question generator', () => {
    const last: ProactiveQuestionState = {
      question: 'Prior',
      questionType: 'completion_drop',
      shownAt: new Date().toISOString(),
    };
    generateProactiveQuestion.mockReturnValue(null);

    getProactiveQuestionText(makeInput(), last);

    expect(generateProactiveQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        patterns: [],
        transactions: [],
        commitments: [],
        accounts: [],
      }),
      last,
    );
  });
});