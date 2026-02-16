/**
 * OnboardingProgress - Step indicator with pill dots
 * Extracted for reuse and testability.
 */
// @ts-nocheck


interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="text-center mb-6" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep} of ${totalSteps}`}>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Step {currentStep} of {totalSteps}
      </span>
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
          <div
            key={s}
            className={`h-1.5 w-12 rounded-full transition-all ${s <= currentStep ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
