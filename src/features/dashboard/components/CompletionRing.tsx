/**
 * CompletionRing - SVG progress ring for "Beyond the Basics" onboarding
 * Displays in the upper-right of the Dashboard header.
 * Pulses gently when incomplete, turns green when complete.
 */

interface CompletionRingProps {
  completed: number;
  total: number;
  onClick: () => void;
  size?: number;
}

export function CompletionRing({ completed, total, onClick, size = 44 }: CompletionRingProps) {
  const progress = total > 0 ? completed / total : 0;
  const allDone = completed === total;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  if (allDone && completed > 0) {
    return null; // Ring disappears once all tasks done
  }

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 ${!allDone ? 'animate-pulse-slow' : ''}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      aria-label={`Onboarding progress: ${completed} of ${total} complete`}
      data-testid="completion-ring"
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          data-testid="progress-arc"
        />
      </svg>
      {/* Center count */}
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
        {completed}/{total}
      </span>
    </button>
  );
}
