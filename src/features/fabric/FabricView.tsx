import React from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { useFabric } from '../../hooks/useFabric';
import { FabricOnboarding } from './FabricOnboarding';
import { FabricPromptChips } from './FabricPromptChips';

const FabricView: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled, isReady, context, patterns } = useFabric();

  if (!isEnabled) {
    return (
      <FeatureErrorBoundary featureName="Anchor AI">
        <div className="max-w-3xl mx-auto space-y-4 pb-20">
          <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">Anchor AI</h1>
          <p className="text-slate-600 dark:text-slate-300">Anchor AI is disabled. Enable it in Settings to view your assistant tab.</p>
        </div>
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary featureName="Anchor AI">
      <div className="max-w-3xl mx-auto space-y-5 pb-20 animate-in fade-in duration-300">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">Anchor AI</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Built from your own commitments and finance history.</p>
          </div>
          <button
            type="button"
            aria-label="Open Anchor AI transparency"
            onClick={() => navigate('/fabric/transparency')}
            className="min-h-11 min-w-[44px] rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            <Settings className="w-4 h-4" />
          </button>
        </header>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Daily briefing</p>
          <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
            {`Good ${context.timeOfDay}. I currently know ${patterns.length} pattern${patterns.length === 1 ? '' : 's'} from your activity.`}
          </p>
        </section>

        {!isReady || patterns.length === 0 ? <FabricOnboarding /> : null}

        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Try asking with one tap</p>
          <FabricPromptChips />
        </section>
      </div>
    </FeatureErrorBoundary>
  );
};

export default FabricView;
