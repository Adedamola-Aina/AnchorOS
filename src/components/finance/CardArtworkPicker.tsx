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
  onUploadCustom?: (file: File) => void | Promise<void>;
  onClose: () => void;
  isUploading?: boolean;
}

export const CardArtworkPicker: React.FC<CardArtworkPickerProps> = ({
  currentPreset, cardColor, onSelect, onUploadCustom, onClose, isUploading = false,
}) => {
  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUploadCustom) return;
    void onUploadCustom(file);
    event.target.value = '';
  };

  return (
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

      {onUploadCustom && (
        <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="card-artwork-upload-input">
            Upload Custom Artwork
          </label>
          <input
            id="card-artwork-upload-input"
            aria-label="Upload custom artwork"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleUploadChange}
            className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700"
            disabled={isUploading}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            PNG, JPG, GIF, or WebP up to 5 MB.
          </p>
        </div>
      )}
    </div>
  );
};
