/**
 * CardArtworkPicker — Preset artwork patterns for account cards.
 * UX-041 Phase 4 §8.2. Selectable presets with visual preview.
 */
import React from 'react';
import { Check } from 'lucide-react';
import { ARTWORK_PRESETS, CARD_ASPECT_RATIO } from './cardConstants';

interface CardArtworkPickerProps {
  currentPreset: string | undefined;
  cardColor: string;
  onSelect: (presetId: string | undefined) => void;
  onClose: () => void;
}

export const CardArtworkPicker: React.FC<CardArtworkPickerProps> = ({
  currentPreset, cardColor, onSelect, onClose,
}) => (
  <div className="p-4 space-y-4" data-testid="card-artwork-picker">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Card Pattern
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        Done
      </button>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {/* No pattern option */}
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className="relative rounded-xl overflow-hidden border-2 transition-colors"
        style={{
          aspectRatio: `${CARD_ASPECT_RATIO}`,
          backgroundColor: cardColor,
          borderColor: !currentPreset ? 'white' : 'transparent',
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-xs text-white/80 font-medium">
          None
        </span>
        {!currentPreset && (
          <span className="absolute top-2 right-2">
            <Check className="w-4 h-4 text-white drop-shadow-sm" />
          </span>
        )}
      </button>

      {ARTWORK_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset.id)}
          className="relative rounded-xl overflow-hidden border-2 transition-colors"
          style={{
            aspectRatio: `${CARD_ASPECT_RATIO}`,
            backgroundColor: cardColor,
            borderColor: currentPreset === preset.id ? 'white' : 'transparent',
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: preset.css }}
          />
          <span className="absolute bottom-2 left-3 text-xs text-white/90 font-medium drop-shadow-sm">
            {preset.label}
          </span>
          {currentPreset === preset.id && (
            <span className="absolute top-2 right-2">
              <Check className="w-4 h-4 text-white drop-shadow-sm" />
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);
