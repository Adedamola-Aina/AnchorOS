/**
 * UX-GL-04 — bottom nav scroll behaviour.
 *
 * The bar used to be permanently pinned, so on a long list it ate a strip of the
 * screen the whole time. It now hides while the user is scrolling *down* (moving
 * away from where they were) and comes back as soon as they scroll up, which is
 * the point at which they are looking for navigation again.
 *
 * The decision is a pure function so it can be tested without a browser.
 */

import { useEffect, useState } from 'react';

export interface NavVisibilityState {
    /** Scroll position when the state last changed — not the latest position. */
    lastY: number;
    hidden: boolean;
}

/** Scrolling up within this many pixels of the top always shows the bar. */
const TOP_ZONE = 24;
/** Movement smaller than this is ignored, so slow scrolls do not flicker. */
const SCROLL_THRESHOLD = 12;

export function nextNavVisibility(
    state: NavVisibilityState,
    scrollY: number,
    threshold: number = SCROLL_THRESHOLD,
    topZone: number = TOP_ZONE,
): NavVisibilityState {
    // At the top the bar is always available — that is where "go somewhere else"
    // starts, and it also guarantees a way back after a fling.
    if (scrollY <= topZone) {
        return state.hidden ? { lastY: scrollY, hidden: false } : state;
    }

    const delta = scrollY - state.lastY;
    if (delta > threshold) return { lastY: scrollY, hidden: true };
    if (delta < -threshold) return { lastY: scrollY, hidden: false };
    // Below the threshold nothing changes, and `lastY` is deliberately NOT
    // advanced — otherwise a slow scroll would never accumulate enough movement
    // to trigger.
    return state;
}

/**
 * Tracks the layout's scroll container (`[data-scroll]`) when present, so it
 * works with the app shell rather than assuming the window scrolls.
 */
export function useNavScrollVisibility(): boolean {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const scroller: HTMLElement | Window =
            document.querySelector<HTMLElement>('[data-scroll]') ?? window;

        const readScrollY = () => (scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop);

        let state: NavVisibilityState = { lastY: readScrollY(), hidden: false };
        const onScroll = () => {
            const next = nextNavVisibility(state, readScrollY());
            if (next === state) return;
            state = next;
            setHidden(next.hidden);
        };

        scroller.addEventListener('scroll', onScroll, { passive: true });
        return () => scroller.removeEventListener('scroll', onScroll);
    }, []);

    return hidden;
}
