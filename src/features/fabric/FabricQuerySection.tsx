import React from 'react';
import { Send } from 'lucide-react';
import type { FabricQueryResult } from '../../types';
import { FabricPromptChips } from './FabricPromptChips';
import type { ThreadEntry } from './useFabricView';

/**
 * FabricQuerySection — the assistant's input, its answer, and the thread.
 *
 * UX-AI-01: the input used to sit near the bottom of a long equal-weight card
 * stack. It is now the FIRST thing in this section, and FabricView places the
 * section directly under the Today block.
 *
 * UX-AI-03: there was no continuity — one submission, one result, nothing to
 * ask again from, and no statement of which data the answer used. The section
 * now states its data source and keeps the last few exchanges readable, each
 * with an "Ask again" action.
 */

/** What the answer is derived from. Stated, not implied (UX-AI-03). */
const ANSWER_SOURCE = 'Answered from your own commitments, accounts and recorded transactions.';

interface FabricQuerySectionProps {
  freeText: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isQuerying: boolean;
  queryResult: FabricQueryResult | null;
  /** Newest first; the newest entry is the answer currently on screen. */
  thread: ThreadEntry[];
  onChangeText: (value: string) => void;
  onSubmitText: () => void;
  onPrompt: (prompt: string) => Promise<void>;
  onAskAgain: (question: string) => Promise<void>;
  onGenerateWeeklyReport: () => void;
  onAction: (type: string, payload: Record<string, unknown>) => void;
}

const AnswerBody: React.FC<{
  answer: FabricQueryResult;
  onAction: (type: string, payload: Record<string, unknown>) => void;
}> = ({ answer, onAction }) => (
  <>
    <p className="text-sm font-semibold text-slate-900 dark:text-white">{answer.summary}</p>
    {answer.detail && <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{answer.detail}</p>}
    {answer.actions && answer.actions.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-1">
        {answer.actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => onAction(action.type, action.payload)}
            className="min-h-11 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
    )}
  </>
);

export function FabricQuerySection({
  freeText,
  inputRef,
  isQuerying,
  queryResult,
  thread,
  onChangeText,
  onSubmitText,
  onPrompt,
  onAskAgain,
  onGenerateWeeklyReport,
  onAction,
}: FabricQuerySectionProps) {
  const currentQuestion = thread[0]?.question;
  const earlier = thread.slice(1);

  return (
    <>
      <section className="space-y-3" data-testid="ask-anchor-section">
        <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Ask Anchor AI</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitText();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={freeText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="What do I have today? Plan my week..."
            className="flex-1 min-h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={!freeText.trim() || isQuerying}
            aria-label="Send"
            className="min-h-11 min-w-[44px] flex items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <FabricPromptChips onPrompt={onPrompt} onGenerateWeeklyReport={onGenerateWeeklyReport} />
      </section>

      {(isQuerying || queryResult) && (
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Response</p>
          {isQuerying ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Thinking...</p>
            </div>
          ) : queryResult ? (
            <article
              data-testid="query-answer"
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3"
            >
              {currentQuestion && (
                <p className="text-xs text-slate-400 dark:text-slate-500" data-testid="query-answer-question">{currentQuestion}</p>
              )}
              <AnswerBody answer={queryResult} onAction={onAction} />
              <p className="text-xs text-slate-400 dark:text-slate-500" data-testid="answer-source">{ANSWER_SOURCE}</p>
              {currentQuestion && (
                <button
                  type="button"
                  onClick={() => void onAskAgain(currentQuestion)}
                  data-testid="ask-again"
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Ask again
                </button>
              )}
            </article>
          ) : null}
        </section>
      )}

      {earlier.length > 0 && (
        <section className="space-y-2" data-testid="ask-anchor-thread">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Earlier</p>
          {earlier.map((entry) => (
            <article
              key={entry.id}
              data-testid="thread-entry"
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
            >
              <p className="text-xs text-slate-400 dark:text-slate-500">{entry.question}</p>
              {entry.answer ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">{entry.answer.summary}</p>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">No answer recorded.</p>
              )}
              <button
                type="button"
                onClick={() => void onAskAgain(entry.question)}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                Ask again
              </button>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

