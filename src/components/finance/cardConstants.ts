/**
 * Card visual constants — colors, patterns, dimensions.
 * Shared between AccountCard, CardStack, and pickers.
 * UX-041 Phase 2 §4.3.
 */

/** ISO 7810 ID-1 credit card aspect ratio */
export const CARD_ASPECT_RATIO = 1.586;
export const CARD_CORNER_RADIUS = 28;
export const CARD_HEADER_FONT_SIZE = 18;
export const CARD_BALANCE_FONT_SIZE = 18;
export const CARD_HEADER_LETTER_SPACING = '-0.4px';
export const CARD_HEADER_REVEAL = 72;
export const STACK_SPRING_CURVE = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const STACK_STAGGER_MS = 40;
export const CARD_NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`;

/** Account-type-based gradient colors (checking→slate, savings→emerald, etc.) */
export const TYPE_COLORS: Record<string, string> = {
  checking: '#1E293B',
  savings: '#047857',
  salary: '#6D28D9',
  investment: '#B45309',
};

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

export const MESH_GRADIENTS = [
  'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.26) 0, rgba(255,255,255,0) 28%), radial-gradient(circle at 78% 20%, rgba(244,114,182,0.34) 0, rgba(244,114,182,0) 30%), radial-gradient(circle at 68% 78%, rgba(56,189,248,0.34) 0, rgba(56,189,248,0) 34%), radial-gradient(circle at 24% 86%, rgba(253,224,71,0.24) 0, rgba(253,224,71,0) 26%), linear-gradient(135deg, #1d4ed8 0%, #1e293b 100%)',
  'radial-gradient(circle at 18% 18%, rgba(251,191,36,0.34) 0, rgba(251,191,36,0) 26%), radial-gradient(circle at 82% 22%, rgba(249,115,22,0.32) 0, rgba(249,115,22,0) 28%), radial-gradient(circle at 70% 76%, rgba(236,72,153,0.28) 0, rgba(236,72,153,0) 34%), radial-gradient(circle at 14% 74%, rgba(59,130,246,0.22) 0, rgba(59,130,246,0) 28%), linear-gradient(140deg, #0f172a 0%, #7c2d12 52%, #431407 100%)',
  'radial-gradient(circle at 16% 20%, rgba(34,197,94,0.28) 0, rgba(34,197,94,0) 26%), radial-gradient(circle at 80% 18%, rgba(45,212,191,0.34) 0, rgba(45,212,191,0) 28%), radial-gradient(circle at 74% 82%, rgba(59,130,246,0.24) 0, rgba(59,130,246,0) 30%), radial-gradient(circle at 20% 82%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0) 24%), linear-gradient(135deg, #052e2b 0%, #115e59 50%, #0f172a 100%)',
  'radial-gradient(circle at 18% 18%, rgba(167,139,250,0.3) 0, rgba(167,139,250,0) 28%), radial-gradient(circle at 82% 24%, rgba(96,165,250,0.26) 0, rgba(96,165,250,0) 28%), radial-gradient(circle at 76% 78%, rgba(244,114,182,0.24) 0, rgba(244,114,182,0) 34%), radial-gradient(circle at 24% 86%, rgba(255,255,255,0.18) 0, rgba(255,255,255,0) 22%), linear-gradient(135deg, #312e81 0%, #111827 52%, #1d4ed8 100%)',
];

export const SHADOW_ACTIVE =
  '0 4px 30px rgba(15,23,42,0.14), 0 18px 48px rgba(15,23,42,0.16)';
export const SHADOW_DEFAULT =
  '0 4px 30px rgba(15,23,42,0.10), 0 12px 36px rgba(15,23,42,0.10)';

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
