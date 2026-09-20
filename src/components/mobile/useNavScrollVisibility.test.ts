import { describe, it, expect } from 'vitest';
import { nextNavVisibility, type NavVisibilityState } from './useNavScrollVisibility';

const shown: NavVisibilityState = { lastY: 0, hidden: false };

describe('UX-GL-04 — bottom nav scroll behaviour', () => {
    it('hides when the user scrolls down past the threshold', () => {
        expect(nextNavVisibility(shown, 200).hidden).toBe(true);
    });

    it('comes back on the first upward scroll', () => {
        const hidden = nextNavVisibility(shown, 200);
        expect(nextNavVisibility(hidden, 150).hidden).toBe(false);
    });

    it('is always available at the top of the page', () => {
        const hidden: NavVisibilityState = { lastY: 400, hidden: true };
        expect(nextNavVisibility(hidden, 10).hidden).toBe(false);
        expect(nextNavVisibility(hidden, 24).hidden).toBe(false);
    });

    it('ignores movement below the threshold, so a slow scroll does not flicker', () => {
        const state: NavVisibilityState = { lastY: 100, hidden: false };
        expect(nextNavVisibility(state, 105)).toBe(state);
    });

    it('accumulates slow scrolling instead of losing it', () => {
        // lastY only advances when the state changes, so many small movements in
        // the same direction still add up to a decision.
        let state: NavVisibilityState = { lastY: 100, hidden: false };
        for (const y of [104, 108, 112, 116]) {
            state = nextNavVisibility(state, y);
        }
        expect(state.hidden).toBe(true);
    });

    it('does not hide again while it is already hidden and scrolling up slowly', () => {
        const hidden: NavVisibilityState = { lastY: 500, hidden: true };
        const after = nextNavVisibility(hidden, 492);
        expect(after.hidden).toBe(true);
        expect(nextNavVisibility(after, 480).hidden).toBe(false);
    });
});
