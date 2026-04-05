/**
 * CardColorPicker — Swatch grid + custom color input for account cards.
 * UX-041 Phase 4 §8.1. Touch-friendly 44px targets.
 */
import React, { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { PRESET_COLORS } from './cardConstants';

interface CardColorPickerProps {
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export const CardColorPicker: React.FC<CardColorPickerProps> = ({
  currentColor, onSelect, onClose,
}) => {
  const [custom, setCustom] = useState(currentColor);

  const handleCustom = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustom(e.target.value);
    onSelect(e.target.value);
  }, [onSelect]);

  return (
    <div className="p-4 space-y-4" data-testid="card-color-picker">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Card Color
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          Done
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className="relative rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-transform active:scale-90"
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {currentColor === color && (
              <Check className="w-4 h-4 text-white drop-shadow-sm" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <label className="text-xs text-slate-500 dark:text-slate-400">
          Custom
        </label>
        <input
          type="color"
          value={custom}
          onChange={handleCustom}
          className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0"
        />
        <span className="text-xs font-mono text-slate-400">{custom}</span>
      </div>
    </div>
  );
};
