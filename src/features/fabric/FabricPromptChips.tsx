import React from 'react';
import { useApp } from '../../context/AnchorContext';

interface PromptChip {
  id: string;
  label: string;
  onTap: () => void;
}

export const FabricPromptChips: React.FC = () => {
  const { navigateTo } = useApp();

  const chips: PromptChip[] = [
    {
      id: 'spending-month',
      label: 'Spending this month',
      onTap: () => navigateTo('finance', { filter: 'this_month' }),
    },
    {
      id: 'streaks',
      label: 'My streaks',
      onTap: () => navigateTo('commitments'),
    },
    {
      id: 'upcoming-bills',
      label: 'Upcoming bills',
      onTap: () => navigateTo('finance', { filter: 'upcoming' }),
    },
    {
      id: 'how-doing',
      label: 'How am I doing?',
      onTap: () => navigateTo('dashboard'),
    },
  ];

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex gap-2 min-w-max">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={chip.onTap}
            className="min-h-11 px-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
