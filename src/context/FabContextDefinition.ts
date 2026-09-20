import { createContext, useContext, useEffect, useRef } from 'react';

/**
 * UX-GL-04 — the FAB slot.
 *
 * The nav had no place for a contextual primary action, so the most important
 * thing on a page lived in the page header (or nowhere). A page registers one
 * action here and the mobile shell renders it as a floating button above the nav,
 * where a thumb already is. One slot, one action: a page cannot stack buttons.
 */

export interface FabAction {
    /** Accessible name, and the visible label for the action. */
    label: string;
    onClick: () => void;
}

export interface FabContextValue {
    action: FabAction | null;
    setAction: (action: FabAction | null) => void;
}

export const FabContext = createContext<FabContextValue | undefined>(undefined);

export function useFab(): FabContextValue {
    const context = useContext(FabContext);
    if (context === undefined) {
        throw new Error('useFab must be used within a FabProvider');
    }
    return context;
}

/**
 * Registers the page's primary action while it is mounted, and clears it on
 * unmount so a FAB can never point at a page that is no longer there. The
 * handler is read through a ref, so a page does not have to memoise it.
 *
 * Uses the context directly and no-ops when there is no provider: pages are
 * rendered in isolation by unit tests (and outside the mobile shell), and
 * registering an action must never be a hard dependency.
 */
export function useRegisterFab(action: FabAction | null): void {
    const context = useContext(FabContext);
    const setAction = context?.setAction;
    const latest = useRef(action);
    const label = action?.label ?? null;

    // The latest handler is kept in a ref *in an effect* (never during render),
    // so the page does not have to memoise its callback and the registered
    // wrapper always calls the current one.
    useEffect(() => {
        latest.current = action;
    });

    useEffect(() => {
        if (!setAction) return;
        if (!label) {
            setAction(null);
            return;
        }
        setAction({ label, onClick: () => latest.current?.onClick() });
        return () => setAction(null);
    }, [label, setAction]);
}
