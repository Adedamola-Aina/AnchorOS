import { createContext, useContext, useEffect } from 'react';

/**
 * The page-level action-bar slot (CM-28).
 *
 * The bar is sticky *inside* the scrolling content, so it needs no padding reserved
 * for it — everything above it already ends above it. What it DOES need is room in
 * the scrollport's *scroll padding*: without it, focusing a field near the bottom (or
 * any `scrollIntoView`) puts that field underneath the bar, which is the defect as
 * users met it — they tapped a field and it was already behind Save/Cancel.
 *
 * So the bar reports its measured height, and the shell adds it to
 * `scroll-padding-bottom` only. Keeping the two numbers separate is the point: one
 * is the space content occupies, the other is where the scrollport considers itself
 * "obscured".
 */
interface ActionBarContextValue {
    /** Measured height of the page's action bar in CSS px; 0 when there is none. */
    height: number;
    setHeight: (height: number) => void;
}

export const ActionBarContext = createContext<ActionBarContextValue | undefined>(undefined);

/** The registered height. Zero outside a provider, so a page rendered alone reserves nothing. */
export function useActionBarHeight(): number {
    return useContext(ActionBarContext)?.height ?? 0;
}

/**
 * Publishes an action bar's height for as long as it is mounted, and clears it on
 * unmount so a page can never leave scroll room reserved for a bar that is gone.
 */
export function useRegisterActionBarHeight(height: number): void {
    const setHeight = useContext(ActionBarContext)?.setHeight;
    useEffect(() => {
        if (!setHeight) return;
        setHeight(height);
        return () => setHeight(0);
    }, [height, setHeight]);
}