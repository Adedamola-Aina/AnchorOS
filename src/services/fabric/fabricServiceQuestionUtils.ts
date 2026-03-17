import type { ProactiveQuestionState, ProactiveQuestionType } from '../../types';
import { generateProactiveQuestion } from './ProactiveQuestionEngine';
import type { BehavioralEngine } from './BehavioralEngine';
import type { AnchorAccount, AnchorTask, AnchorTransaction } from '../../types';
import { isProactiveQuestionType } from './fabricServicePredictionUtils';

interface QuestionContextInput {
  engine: BehavioralEngine;
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  accounts: AnchorAccount[];
}

export function getProactiveQuestionText(
  input: QuestionContextInput,
  lastQuestionState: ProactiveQuestionState | null,
): string | null {
  const result = generateProactiveQuestion(
    {
      patterns: input.engine.getPatterns(),
      transactions: input.transactions,
      commitments: input.commitments,
      accounts: input.accounts,
      now: new Date(),
    },
    lastQuestionState,
  );
  return result?.question ?? null;
}

export function resolveQuestionShownState(
  input: QuestionContextInput,
  question: ProactiveQuestionType | string,
): ProactiveQuestionState | null {
  const result = generateProactiveQuestion(
    {
      patterns: input.engine.getPatterns(),
      transactions: input.transactions,
      commitments: input.commitments,
      accounts: input.accounts,
      now: new Date(),
    },
    null,
  );

  const resolvedType = isProactiveQuestionType(question)
    ? question
    : (result?.question === question ? result.questionType : null);

  if (!resolvedType) return null;

  return {
    question,
    questionType: resolvedType,
    shownAt: new Date().toISOString(),
  };
}
