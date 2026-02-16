/**
 * useUnsavedChanges - Guards against losing form data
 *
 * Provides:
 * 1. `beforeunload` event to warn on page refresh/close
 * 2. A shared dirty flag (via UnsavedChangesContext) that navigation
 *    components can check before route transitions.
 *
 * Usage in form components:
 *   const { setDirty } = useUnsavedChanges();
 *   useEffect(() => { setDirty(formHasChanges); }, [formHasChanges]);
 *
 * Usage in navigation components:
 *   const { isDirty, confirmDiscard } = useUnsavedChangesGuard();
 *   onClick={() => { if (isDirty && !confirmDiscard()) return; navigate(to); }}
 */

import { useEffect, useCallback, useContext, createContext, useState, type ReactNode } from 'react';
import React from 'react';

/* ─── Context ─── */
interface UnsavedChangesState {
    isDirty: boolean;
    setDirty: (dirty: boolean) => void;
    confirmDiscard: () => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesState>({
    isDirty: false,
    setDirty: () => {},
    confirmDiscard: () => true,
});

export const UnsavedChangesProvider = ({ children }: { children: ReactNode }) => {
    const [isDirty, setDirty] = useState(false);

    const confirmDiscard = useCallback(() => {
        if (!isDirty) return true;
        return window.confirm('You have unsaved changes. Are you sure you want to leave?');
    }, [isDirty]);

    return React.createElement(
        UnsavedChangesContext.Provider,
        { value: { isDirty, setDirty, confirmDiscard } },
        children
    );
};

/* ─── Hook for forms ─── */
export function useUnsavedChanges(dirty?: boolean) {
    const ctx = useContext(UnsavedChangesContext);

    // Sync dirty flag from caller
    useEffect(() => {
        if (dirty !== undefined) ctx.setDirty(dirty);
    }, [dirty, ctx]);

    // beforeunload guard
    useEffect(() => {
        if (!ctx.isDirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            // Chrome requires returnValue to be set
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [ctx.isDirty]);

    // Clean up on unmount (form closed = no longer dirty)
    useEffect(() => () => ctx.setDirty(false), [ctx]);

    return ctx;
}

/* ─── Hook for navigation components ─── */
export function useUnsavedChangesGuard() {
    const ctx = useContext(UnsavedChangesContext);
    return { isDirty: ctx.isDirty, confirmDiscard: ctx.confirmDiscard };
}
