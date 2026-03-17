import { logProductEvent } from '../../services/telemetry';
import type { Prediction, TabView } from '../../types';

interface FabricPredictionsSectionProps {
  predictions: Prediction[];
  dismissPrediction: (predictionId: string) => void;
  navigateTo: (tab: TabView) => void;
}

export function FabricPredictionsSection({ predictions, dismissPrediction, navigateTo }: FabricPredictionsSectionProps) {
  if (predictions.length === 0) return null;

  return (
    <section className="space-y-2">
      <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Alerts</p>
      <div className="space-y-2">
        {predictions.map((prediction) => (
          <article key={prediction.id} className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{prediction.message}</p>
            {prediction.detail && <p className="text-sm text-slate-600 dark:text-slate-300">{prediction.detail}</p>}
            <div className="flex flex-wrap gap-2">
              {prediction.action?.navigateTo && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      logProductEvent('fabric_prediction_actioned', {
                        predictionId: prediction.id,
                        predictionType: prediction.type,
                      });
                    } catch { /* telemetry must never break the UI */ }
                    navigateTo(prediction.action!.navigateTo!.replace('/', '') as TabView);
                  }}
                  className="min-h-11 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {prediction.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  try {
                    logProductEvent('fabric_prediction_dismissed', {
                      predictionId: prediction.id,
                      predictionType: prediction.type,
                    });
                  } catch { /* telemetry must never break the UI */ }
                  dismissPrediction(prediction.id);
                }}
                className="min-h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200"
              >
                Dismiss
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
