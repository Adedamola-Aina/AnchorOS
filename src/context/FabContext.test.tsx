import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FabProvider, useRegisterFab } from './FabContext';
import { ContextualFab } from '../components/mobile/ContextualFab';

/** A page that registers one action, like Commitments or Finance does. */
const PageWithFab = ({ label = 'New commitment', onAction = vi.fn() }: { label?: string; onAction?: () => void }) => {
    useRegisterFab({ label, onClick: onAction });
    return <div>page</div>;
};

const renderShell = (ui: React.ReactNode) => render(<FabProvider>{ui}</FabProvider>);

describe('UX-GL-04 — the contextual FAB slot', () => {
    it('renders nothing until a page registers an action', () => {
        renderShell(<ContextualFab />);
        expect(screen.queryByTestId('contextual-fab')).not.toBeInTheDocument();
    });

    it('renders the registered action with an accessible name', () => {
        renderShell(<><PageWithFab /><ContextualFab /></>);
        const fab = screen.getByTestId('contextual-fab');
        expect(fab).toHaveAttribute('aria-label', 'New commitment');
        expect(fab).toHaveTextContent('New commitment');
    });

    it('runs the page action when pressed', () => {
        const onAction = vi.fn();
        renderShell(<><PageWithFab onAction={onAction} /><ContextualFab /></>);
        fireEvent.click(screen.getByTestId('contextual-fab'));
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('clears the slot when the page unmounts, so the FAB cannot outlive it', () => {
        const { rerender } = renderShell(<><PageWithFab /><ContextualFab /></>);
        expect(screen.getByTestId('contextual-fab')).toBeInTheDocument();
        rerender(<FabProvider><ContextualFab /></FabProvider>);
        expect(screen.queryByTestId('contextual-fab')).not.toBeInTheDocument();
    });

    it('travels with the nav when the bar is hidden', () => {
        renderShell(<><PageWithFab /><ContextualFab navHidden /></>);
        expect(screen.getByTestId('contextual-fab')).toHaveAttribute('data-nav-hidden', 'true');
        expect(screen.getByTestId('contextual-fab').className).toContain('pointer-events-none');
    });

    it('never throws when a page is rendered without a provider', () => {
        expect(() => render(<PageWithFab />)).not.toThrow();
    });
});
