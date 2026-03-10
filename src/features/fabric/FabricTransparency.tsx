import React from 'react';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { useFabric } from '../../hooks/useFabric';

function describePattern(pattern: { trigger: { type: string; category?: string }; followUpAction: { type: string; category?: string } }): string {
  const triggerLabel = pattern.trigger.type.replace(/_/g, ' ');
  const actionLabel = pattern.followUpAction.type.replace(/_/g, ' ');
  const triggerCategory = pattern.trigger.category ? ` in ${pattern.trigger.category}` : '';
  const actionCategory = pattern.followUpAction.category ? ` for ${pattern.followUpAction.category}` : '';
  return `When ${triggerLabel}${triggerCategory}, Anchor AI tends to ${actionLabel}${actionCategory}.`;
}

const FabricTransparency: React.FC = () => {
  const { confirmedPatterns, deletePattern } = useFabric();

  return (
    <FeatureErrorBoundary featureName="Anchor AI Transparency">
      <div className="max-w-3xl mx-auto space-y-5 pb-20 animate-in fade-in duration-300">
        <header className="space-y-1">
          <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">What Anchor AI Knows</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review and remove learned behavior patterns at any time.</p>
        </header>

        {confirmedPatterns.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">Anchor AI hasn&apos;t learned any confirmed patterns yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {confirmedPatterns.map((pattern) => (
              <article key={pattern.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <p className="text-sm text-slate-700 dark:text-slate-200">{describePattern(pattern)}</p>
                <button
                  type="button"
                  onClick={() => deletePattern(pattern.id)}
                  className="min-h-11 px-3 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-sm font-medium"
                >
                  Delete pattern
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </FeatureErrorBoundary>
  );
};

export default FabricTransparency;
