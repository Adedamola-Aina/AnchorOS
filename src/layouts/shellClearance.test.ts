/**
 * The bottom-clearance contract (CM-28): what the shell reserves at the end of a
 * scrollable page, and why a form's action bar is deliberately not part of it.
 */
import { describe, it, expect } from 'vitest';
import { shellBottomClearance, shellScrollPadding } from './shellClearance';

describe('shellBottomClearance', () => {
    it('reserves the navigation when the page has no FAB', () => {
        expect(shellBottomClearance(false)).toBe('var(--shell-bottom-clearance)');
    });

    it('reserves the FAB band too when the page registered a FAB', () => {
        expect(shellBottomClearance(true)).toBe('var(--shell-bottom-clearance-fab)');
    });

    /**
     * The two reservations must differ: a page with a FAB reserves strictly more,
     * and only the FAB variant may name the FAB band. If these ever collapse to one
     * value, one of the two pages is either clipping its last row under the button or
     * reserving space for a button it does not have.
     */
    it('reserves strictly more when the page has a FAB', () => {
        expect(shellBottomClearance(true)).not.toBe(shellBottomClearance(false));
        expect(shellBottomClearance(true)).toContain('fab');
        expect(shellBottomClearance(false)).not.toContain('fab');
    });

    it('never expresses clearance in viewport units', () => {
        for (const hasFab of [true, false]) {
            expect(shellBottomClearance(hasFab)).not.toMatch(/\d(vh|dvh|svh)/);
            expect(shellScrollPadding(hasFab, 69)).not.toMatch(/\d(vh|dvh|svh)/);
        }
    });

    /**
     * The reported defect was a Save/Cancel region over form fields. The fix is not
     * "add the bar's height here" — the bar is sticky inside the scrolling content,
     * so it is already the last element in the flow. Reserving it again pushed the
     * bar ~70px up the page at the end of the scroll (measured). This test pins the
     * deliberate absence.
     */
    it('never adds an action-bar height — the bar is inside the content flow', () => {
        expect(shellBottomClearance(false)).not.toContain('calc');
        expect(shellBottomClearance(true)).not.toContain('calc');
    });
});
describe('shellScrollPadding', () => {
    it('falls back to the clearance when there is no action bar', () => {
        expect(shellScrollPadding(false, 0)).toBe('var(--shell-bottom-clearance)');
    });

    /**
     * The defect as users met it: they tapped a field near the bottom and it was
     * already behind Save/Cancel. Anything scrolled to must stop above the bar.
     */
    it('adds the action bar height so a focused field stops above the bar', () => {
        expect(shellScrollPadding(false, 69)).toBe('calc(var(--shell-bottom-clearance) + 69px)');
        expect(shellScrollPadding(true, 69)).toBe('calc(var(--shell-bottom-clearance-fab) + 69px)');
    });

    it('rounds up and ignores nonsense measurements', () => {
        expect(shellScrollPadding(false, 68.2)).toBe('calc(var(--shell-bottom-clearance) + 69px)');
        expect(shellScrollPadding(false, Number.NaN)).toBe('var(--shell-bottom-clearance)');
        expect(shellScrollPadding(false, -5)).toBe('var(--shell-bottom-clearance)');
    });
});
