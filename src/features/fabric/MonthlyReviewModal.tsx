import { useState } from 'react';
import type { MonthlyReview } from '../../services/fabric/MonthlyReviewEngine';
import { formatCents } from '../../services/fabric/fabricUtils';

const REVIEW_QUESTIONS = [
  'What went well financially this month?',
  'What would you change about your spending?',
  'What is one goal for next month?',
] as const;

interface MonthlyReviewModalProps {
  review: MonthlyReview;
  onSave: (answers: Record<string, string>) => void;
  onDismiss: () => void;
}

export function MonthlyReviewModal({ review, onSave, onDismiss }: MonthlyReviewModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const updateAnswer = (question: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const canSave = REVIEW_QUESTIONS.some((q) => (answers[q] ?? '').trim().length > 0);

  return (
    <div
      role="dialog"
      aria-label="Monthly financial review"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Monthly Review — {review.month}
        </h2>

        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
          <p>Income: {formatCents(review.financeSummary.totalIncomeCents, 'USD')}</p>
          <p>Expenses: {formatCents(review.financeSummary.totalExpenseCents, 'USD')}</p>
          <p>Savings rate: {review.financeSummary.savingsRatePercent}%</p>
          {review.commitmentSummary.total > 0 && (
            <p>Commitments: {review.commitmentSummary.completionRatePercent}% completed</p>
          )}
        </div>

        {REVIEW_QUESTIONS.map((q) => (
          <div key={q} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {q}
            </label>
            <textarea
              value={answers[q] ?? ''}
              onChange={(e) => updateAnswer(q, e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm min-h-[44px]"
            />
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 py-2.5 text-sm font-medium min-h-[44px]"
          >
            Skip
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(answers)}
            className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium disabled:opacity-40 min-h-[44px]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
