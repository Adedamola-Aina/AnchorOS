import React from 'react';
import { Send } from 'lucide-react';
import type { FabricQueryResult } from '../../types';
import { FabricPromptChips } from './FabricPromptChips';

interface FabricQuerySectionProps {
  freeText: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isQuerying: boolean;
  queryResult: FabricQueryResult | null;
  onChangeText: (value: string) => void;
  onSubmitText: () => void;
  onPrompt: (prompt: string) => Promise<void>;
  onGenerateWeeklyReport: () => void;
  onAction: (type: string, payload: Record<string, unknown>) => void;
}

export function FabricQuerySection({
  freeText,
  inputRef,
  isQuerying,
  queryResult,
  onChangeText,
  onSubmitText,
  onPrompt,
  onGenerateWeeklyReport,
  onAction,
}: FabricQuerySectionProps) {
  return (
    <>
      <section className="space-y-3">
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
            <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{queryResult.summary}</p>
              {queryResult.detail && <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{queryResult.detail}</p>}
              {queryResult.actions && queryResult.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {queryResult.actions.map((action) => (
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
            </article>
          ) : null}
        </section>
      )}
    </>
  );
}
