import React from 'react';
import { MessageCircleQuestion } from 'lucide-react';

interface Props {
  question: string;
  onDismiss: () => void;
  onTap: (question: string) => void;
}

export const FabricProactiveQuestionCard: React.FC<Props> = ({
  question,
  onDismiss,
  onTap,
}) => {
  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 border-primary-300 dark:border-primary-700 bg-slate-50/70 dark:bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onTap(question)}
          className="min-h-11 flex-1 text-left text-sm text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
          aria-label={question}
        >
          {/* AI-07: this used to render a literal "?" character where an icon
              belongs — it read as a broken icon lookup. DESIGN_SYSTEM.md requires
              Lucide icons for functional states. */}
          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            <MessageCircleQuestion className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          {question}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="min-h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
};
