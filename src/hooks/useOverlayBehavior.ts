/**
 * The behaviour every overlay owes the user (`UX-DS-08`).
 *
 * Six of the app's seven dialog-like surfaces had no focus trap, no scroll lock and
 * no way for the shell to know a sheet was open:
 *
 *   Modal              ✓ trap  ✓ scroll lock  ✓ body[data-modal-open]
 *   ActionSheet        ✗ trap  ✓ scroll lock  ✗ marker
 *   DatePickerSheet    ✗ trap  ✗ scroll lock  ✗ marker
 *   TimePickerSheet    ✗ trap  ✗ scroll lock  ✗ marker
 *   MonthDaysSheet     ✗ trap  ✗ scroll lock  ✗ marker
 *   ContactModal       ✗ trap  ✗ scroll lock  ✗ marker
 *   BeyondBasics       ✗ trap  ✗ scroll lock  ✗ marker
 *   confirm() dialog   ✗ trap  ✗ scroll lock  ✗ marker
 *
 * Two user-visible consequences, both real:
 *   - Tab walks out of the sheet and into the page behind it, which is inert but
 *     still focusable — the classic "my keyboard went somewhere invisible".
 *   - `data-modal-open` is what stands the contextual FAB down. Only Modal set it,
 *     so the floating button stayed on screen over every action sheet.
 *
 * The scroll lock and the marker are reference-counted here, in one place, because
 * stacked overlays are normal (a date sheet opened from a modal): the first opener
 * locks and the last closer unlocks. Modal's own unconditional
 * `overflow = 'unset'` used to hand scrolling back while a sheet was still open.
 */
import { useEffect, type RefObject } from 'react';

let openOverlayCount = 0;

/** Lock the document and tell the shell a sheet is up. Paired with unlockDocument. */
export function lockDocument(): void {
    openOverlayCount += 1;
    document.body.style.overflow = 'hidden';
    document.body.dataset.modalOpen = 'true';
}

export function unlockDocument(): void {
    openOverlayCount = Math.max(0, openOverlayCount - 1);
    if (openOverlayCount !== 0) return;
    document.body.style.overflow = 'unset';
    delete document.body.dataset.modalOpen;
}

/** How many overlays are currently open. Exposed for tests and diagnostics. */
export function openOverlayDepth(): number {
    return openOverlayCount;
}

const FOCUSABLE_SELECTOR = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface OverlayBehavior {
    isOpen: boolean;
    onClose: () => void;
    /** The element that visually contains the overlay's content. */
    panelRef: RefObject<HTMLElement | null>;
}

export function useOverlayBehavior({ isOpen, onClose, panelRef }: OverlayBehavior): void {
    // Scroll lock + the marker the shell reads.
    useEffect(() => {
        if (!isOpen) return undefined;
        lockDocument();
        return () => unlockDocument();
    }, [isOpen]);

    // Focus goes back where it came from — but only if that element is still real.
    // Trigger elements routinely unmount with the sheet that opened them, and
    // focusing <body> would steal focus from whatever the close handler focused.
    useEffect(() => {
        if (!isOpen) return undefined;
        const previous = document.activeElement as HTMLElement | null;
        return () => {
            if (previous && previous !== document.body && previous.isConnected) previous.focus();
        };
    }, [isOpen]);

    // Escape to dismiss, Tab cycles within the panel.
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;

            const panel = panelRef.current;
            if (!panel) return;
            // No layout-based visibility filter here: `offsetParent` / `getClientRects`
            // are unavailable in jsdom (they return null / empty, which would silently
            // disable the trap in every test). The selector already excludes disabled
            // controls and explicit `tabindex="-1"`.
            const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement as HTMLElement | null;
            const activeIsInside = Boolean(active && panel.contains(active));

            if (event.shiftKey) {
                if (!activeIsInside || active === first) {
                    event.preventDefault();
                    last.focus();
                }
                return;
            }
            if (!activeIsInside || active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, panelRef]);
}