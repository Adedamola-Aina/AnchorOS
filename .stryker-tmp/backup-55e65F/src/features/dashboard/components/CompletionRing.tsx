/**
 * CompletionRing - SVG progress ring for "Beyond the Basics" onboarding
 * Displays in the upper-right of the Dashboard header.
 * Rose-red progressive arc shows how much is done.
 * Subtle glow-pulse draws attention without being annoying.
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
      className="relative flex items-center justify-center rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        animation: !allDone ? 'ring-glow 3s ease-in-out infinite' : undefined,
      }}
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
          strokeWidth={3}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        {/* Progress arc — rose red */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={3.5}
          strokeLinecap="round"
          className="stroke-rose-500 transition-all duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          data-testid="progress-arc"
        />
      </svg>
      {/* Center count */}
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-rose-600 dark:text-rose-400">
        {completed}/{total}
      </span>
    </button>
  );
}
