/**
 * Card visual constants — colors, patterns, dimensions.
 * Shared between AccountCard, CardStack, and pickers.
 * UX-041 Phase 2 §4.3 · UX-FN-04 (identity) · UX-FN-09 (tighter cards).
 */

/**
 * ISO 7810 ID-1 credit card ratio, tightened for mobile display.
 *
 * UX-FN-09: the expanded cards were 2.2 (≈156px tall at 343px wide) and read as
 * half-empty panels — the content they carry is a name, a balance and one
 * identity line. 2.75 (≈125px) is ~20% shorter while staying unmistakably a
 * card rather than a list row, which is what the account stack is for.
 */
export const CARD_ASPECT_RATIO = 2.75;
export const CARD_CORNER_RADIUS = 20;
export const CARD_HEADER_FONT_SIZE = 15;
export const CARD_BALANCE_FONT_SIZE = 16;
export const CARD_HEADER_LETTER_SPACING = '-0.3px';
/**
 * Height of the peek strip visible per card (~44px — Apple Wallet-like overlap,
 * and still a full 44px touch target for the strip button in UX-FN-07).
 */
export const CARD_HEADER_REVEAL = 44;
export const STACK_STAGGER_MS = 40;
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

/*
 * The old `PATTERNS` array that lived here is gone with the presets it fed: its four
 * entries were the mislabelled ones ("hexagons" was a dot grid, "circuit" a diagonal
 * cross-hatch, "topo" horizontal stripes) and nothing else referenced them.
 */

export const SHADOW_ACTIVE =
  '0 4px 30px rgba(15,23,42,0.14), 0 18px 48px rgba(15,23,42,0.16)';
export const SHADOW_DEFAULT =
  '0 4px 30px rgba(15,23,42,0.10), 0 12px 36px rgba(15,23,42,0.10)';

interface ArtworkPreset {
  id: string;
  label: string;
  css: string;
}

/**
 * Card artwork presets (UX-FN-04).
 *
 * Three defects lived in the previous four entries:
 *
 *   1. Their labels did not describe them. "Hexagons" was a dot grid, "Circuit" was a
 *      diagonal cross-hatch and "Topo" was horizontal stripes — so the picker's
 *      previews were the only honest thing about it.
 *   2. Four patterns is not a choice. Nine more are added, each visibly distinct at
 *      card size (a 2.75:1 strip, not a swatch): dots, grid, circuit, contour, mesh,
 *      diagonal, chevron, rings, aurora and confetti.
 *   3. They were unreachable anyway — see cardArtwork.ts.
 *
 * The four original ids are kept, because accounts already store them; their visuals
 * now match their names. All patterns are pure CSS/SVG data URIs: no network fetch, no
 * asset pipeline, and they scale with the card rather than pixelating.
 */
const line = (angle: number, alpha: number, thickness = 1, gap = 12) =>
  `repeating-linear-gradient(${angle}deg, rgba(255,255,255,${alpha}) 0 ${thickness}px, transparent ${thickness}px ${gap}px)`;

const dot = (alpha: number, size: number, gap: number) =>
  `radial-gradient(rgba(255,255,255,${alpha}) ${size}px, transparent ${size}px) 0 0/${gap}px ${gap}px`;

export const ARTWORK_PRESETS: ArtworkPreset[] = [
  {
    id: 'waves',
    label: 'Waves',
    css: `url("data:image/svg+xml,%3Csvg width='60' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q15 0 30 10 Q45 20 60 10' stroke='rgba(255,255,255,0.15)' fill='none' stroke-width='1.5'/%3E%3C/svg%3E") repeat`,
  },
  {
    id: 'hexagons',
    label: 'Hexagons',
    css: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='26' viewBox='0 0 30 26'%3E%3Cpath d='M15 1l13 7.5v9L15 25 2 17.5v-9z' fill='none' stroke='rgba(255,255,255,0.16)' stroke-width='1'/%3E%3C/svg%3E") repeat`,
  },
  {
    // Nodes on a lattice: what "circuit" should have looked like.
    id: 'circuit',
    label: 'Circuit',
    css: `${dot(0.26, 1.5, 16)}, ${line(0, 0.09, 1, 16)}, ${line(90, 0.09, 1, 16)}`,
  },
  {
    // Concentric contour lines, not stripes.
    id: 'topographic',
    label: 'Contour',
    css: 'repeating-radial-gradient(circle at 28% 18%, rgba(255,255,255,0.11) 0 1px, transparent 1px 13px)',
  },
  { id: 'dots', label: 'Dots', css: dot(0.16, 1.2, 12) },
  { id: 'grid', label: 'Grid', css: `${line(0, 0.08, 1, 12)}, ${line(90, 0.08, 1, 12)}` },
  { id: 'mesh', label: 'Mesh', css: `${line(0, 0.06, 1, 8)}, ${line(90, 0.06, 1, 8)}` },
  { id: 'diagonal', label: 'Diagonal', css: line(45, 0.10, 2, 12) },
  { id: 'chevron', label: 'Chevron', css: `${line(135, 0.10, 8, 16)}, ${line(45, 0.10, 8, 16)}` },
  { id: 'rings', label: 'Rings', css: 'repeating-radial-gradient(circle at 82% 120%, rgba(255,255,255,0.12) 0 2px, transparent 2px 18px)' },
  {
    id: 'aurora',
    label: 'Aurora',
    css: 'radial-gradient(120% 90% at 15% 10%, rgba(255,255,255,0.22), transparent 55%), radial-gradient(100% 80% at 85% 95%, rgba(255,255,255,0.14), transparent 60%)',
  },
  {
    id: 'confetti',
    label: 'Confetti',
    css: `${dot(0.22, 1, 18)}, radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px) 9px 9px/18px 18px`,
  },
];
