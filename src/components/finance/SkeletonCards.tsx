/**
 * SkeletonCards — Loading shimmer placeholders for account cards.
 * Matches ISO 7810 ID-1 aspect ratio for visual consistency.
 */
import React from 'react';
import { CARD_ASPECT_RATIO } from './cardConstants';

interface SkeletonCardsProps {
  count?: number;
}

export const SkeletonCards: React.FC<SkeletonCardsProps> = ({ count = 3 }) => (
  <div className="space-y-3 px-1">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-full rounded-2xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse"
        style={{
          aspectRatio: `${CARD_ASPECT_RATIO} / 1`,
          animationDelay: `${i * 120}ms`,
        }}
      >
        <div className="p-5 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="h-4 w-24 rounded bg-slate-300/60 dark:bg-slate-600/40" />
            <div className="h-3 w-16 rounded bg-slate-300/60 dark:bg-slate-600/40" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-32 rounded bg-slate-300/60 dark:bg-slate-600/40" />
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-slate-300/60 dark:bg-slate-600/40" />
              <div className="h-5 w-14 rounded-full bg-slate-300/60 dark:bg-slate-600/40" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
