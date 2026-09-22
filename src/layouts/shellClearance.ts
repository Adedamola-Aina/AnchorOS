/**
 * How much room the end of a scrollable page reserves, and where its scrollport
 * considers itself obscured (CM-28).
 *
 * One module, because these two numbers are the whole bottom-edge contract and they
 * are deliberately NOT the same number:
 *
 *   shellBottomClearance  → `padding-bottom`. The navigation (which already contains
 *                           the safe-area inset) plus the contextual FAB's band when
 *                           the page registered one. A form's action bar is NOT part
 *                           of this: it is sticky inside the scrolling content, so
 *                           it is the last element in the flow and the fields above
 *                           it already end above it. Adding its height here
 *                           double-counted and left dead space under the bar.
 *
 *   shellScrollPadding    → `scroll-padding-bottom`. The same base PLUS the action
 *                           bar's measured height, because anything scrolled to —
 *                           a focused field above all — must stop above the bar, not
 *                           underneath it.
 */
export function shellBottomClearance(hasFab: boolean): string {
    return hasFab ? 'var(--shell-bottom-clearance-fab)' : 'var(--shell-bottom-clearance)';
}

export function shellScrollPadding(hasFab: boolean, actionBarHeight: number): string {
    const base = shellBottomClearance(hasFab);
    const bar = Math.ceil(actionBarHeight);
    return bar > 0 ? `calc(${base} + ${bar}px)` : base;
}