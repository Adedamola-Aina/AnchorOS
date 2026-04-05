/**
 * Card visual constants — colors, patterns, dimensions.
 * Shared between AccountCard, CardStack, and pickers.
 * UX-041 Phase 2 §4.3.
 */

/** ISO 7810 ID-1 credit card aspect ratio */
export const CARD_ASPECT_RATIO = 1.586;

export const DEFAULT_CARD_COLORS = [
  '#3D52D5', '#1A7F6E', '#8B1A4A', '#2D3A4A',
  '#B45309', '#6B21A8', '#0F766E',
];

export const PRESET_COLORS = [
  '#1E1E2E', '#2D3A4A', '#1A1A2E',
  '#3D52D5', '#1E40AF', '#0EA5E9',
  '#1A7F6E', '#059669', '#16A34A',
  '#8B1A4A', '#DC2626', '#BE185D',
  '#B45309', '#EA580C', '#D97706',
  '#6B21A8', '#7C3AED', '#9333EA',
];

/** Deterministic hash from string → number */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export const PATTERNS = [
  `repeating-linear-gradient(45deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 8px)`,
  `radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px)`,
  `repeating-linear-gradient(45deg,rgba(255,255,255,0.05) 0,rgba(255,255,255,0.05) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,255,255,0.05) 0,rgba(255,255,255,0.05) 1px,transparent 0,transparent 50%)`,
  `repeating-linear-gradient(0deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 10px)`,
];

export const PATTERN_SIZES = ['auto', '12px 12px', '10px 10px', 'auto'];

export const SHADOW_ACTIVE =
  '0 2px 6px rgba(0,0,0,0.15),0 12px 32px rgba(0,0,0,0.25),0 32px 64px rgba(0,0,0,0.15)';
export const SHADOW_DEFAULT =
  '0 1px 3px rgba(0,0,0,0.12),0 8px 20px rgba(0,0,0,0.20),0 24px 48px rgba(0,0,0,0.12)';

export interface ArtworkPreset {
  id: string;
  label: string;
  css: string;
}

export const ARTWORK_PRESETS: ArtworkPreset[] = [
  {
    id: 'waves',
    label: 'Waves',
    css: `url("data:image/svg+xml,%3Csvg width='60' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q15 0 30 10 Q45 20 60 10' stroke='rgba(255,255,255,0.15)' fill='none' stroke-width='1.5'/%3E%3C/svg%3E") repeat`,
  },
  {
    id: 'hexagons',
    label: 'Hexagons',
    css: PATTERNS[1],
  },
  {
    id: 'circuit',
    label: 'Circuit',
    css: PATTERNS[2],
  },
  {
    id: 'topographic',
    label: 'Topo',
    css: PATTERNS[3],
  },
];
