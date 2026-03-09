import React from 'react';
import { useApp } from '../../context/AnchorContext';

interface PromptChip {
  id: string;
  label: string;
  prompt: string;
  onTap: () => void;
}

interface FabricPromptChipsProps {
  onPrompt?: (prompt: string) => void;
}

export const FabricPromptChips: React.FC<FabricPromptChipsProps> = ({ onPrompt }) => {
  const { navigateTo } = useApp();

  const chips: PromptChip[] = [
    {
      id: 'spending-month',
      label: 'Spending this month',
      prompt: 'how much did i spend this month',
      onTap: () => navigateTo('finance', { filter: 'this_month' }),
    },
    {
      id: 'streaks',
      label: 'My streaks',
      prompt: 'how are my commitments this week',
      onTap: () => navigateTo('commitments'),
    },
    {
      id: 'upcoming-bills',
      label: 'Upcoming bills',
      prompt: 'what recurring spending is due soon',
      onTap: () => navigateTo('finance', { filter: 'upcoming' }),
    },
    {
      id: 'how-doing',
      label: 'How am I doing?',
      prompt: 'how am i doing this week',
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
            onClick={() => (onPrompt ? onPrompt(chip.prompt) : chip.onTap())}
            className="min-h-11 px-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
