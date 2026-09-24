// @vitest-environment jsdom

/**
 * ContextualFab — the shell's floating action, and the geometry it must share with
 * the bottom navigation.
 *
 * The shell-level rules being protected (see `src/layouts/shellGeometry.test.ts`
 * for the static half of the same contract):
 *   - a page that registers no action renders no FAB;
 *   - the FAB is positioned from `--bottom-nav-height`, not from a local
 *     approximation of the bar's height;
 *   - it stands down while a sheet is open, so a floating button can never sit on
 *     top of a modal's own controls;
 *   - it moves away with the navigation (transform only — no layout shift).
 */
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FabProvider } from '../../context/FabContext';
import { useRegisterFab } from '../../context/FabContextDefinition';
import { ContextualFab } from './ContextualFab';

const RegisterAction = ({ label, onClick }: { label: string; onClick: () => void }) => {
    useRegisterFab({ label, onClick });
    return null;
};

const renderFab = ({ action, navHidden }: { action?: { label: string; onClick: () => void }; navHidden?: boolean } = {}) =>
    render(
        <FabProvider>
            {action ? <RegisterAction label={action.label} onClick={action.onClick} /> : null}
            <ContextualFab navHidden={navHidden} />
        </FabProvider>,
    );

describe('ContextualFab', () => {
    beforeEach(() => {
        delete document.body.dataset.modalOpen;
    });

    afterEach(async () => {
        // Cleared inside act(): a mounted ContextualFab watches this attribute, so
        // mutating it after the test would report a state update outside act().
        await act(async () => {
            delete document.body.dataset.modalOpen;
            delete document.body.dataset.fabVisible;
        });
    });

    it('renders nothing when the page has registered no action', () => {
        renderFab();
        expect(screen.queryByTestId('contextual-fab')).not.toBeInTheDocument();
    });

    it('renders the registered action with an accessible name', () => {
        renderFab({ action: { label: 'New commitment', onClick: () => {} } });
        expect(screen.getByTestId('contextual-fab')).toHaveAccessibleName('New commitment');
    });

    it('takes its offset from the shared floating-layer geometry', () => {
        renderFab({ action: { label: 'New commitment', onClick: () => {} } });
        expect(screen.getByTestId('contextual-fab')).toHaveStyle({ bottom: 'var(--shell-above-nav)' });
    });

    /**
     * Transient surfaces above the FAB read `.floating-toast`, which steps up to the
     * second rung only while this attribute says the first rung is occupied. Without
     * it they cannot know, which is how the toast ended up inside the nav's band.
     */
    it('publishes that it occupies the floating layer, and clears it again', () => {
        const { unmount } = renderFab({ action: { label: 'New commitment', onClick: () => {} } });
        expect(document.body.dataset.fabVisible).toBe('true');
        unmount();
        expect(document.body.dataset.fabVisible).toBeUndefined();
    });

    it('does not claim the floating layer when it renders nothing', () => {
        renderFab();
        expect(document.body.dataset.fabVisible).toBeUndefined();
    });

    it('stands down while a sheet is open', async () => {
        document.body.dataset.modalOpen = 'true';
        // The observer that reads `data-modal-open` reports through state, so the
        // render is flushed inside act().
        await act(async () => {
            renderFab({ action: { label: 'New commitment', onClick: () => {} } });
        });
        expect(screen.queryByTestId('contextual-fab')).not.toBeInTheDocument();
    });

    it('moves away with the navigation without leaving the layout flow', () => {
        renderFab({ action: { label: 'New commitment', onClick: () => {} }, navHidden: true });
        const fab = screen.getByTestId('contextual-fab');
        expect(fab).toHaveAttribute('data-nav-hidden', 'true');
        // Transform + opacity only: the FAB must never change the page's height, or
        // the content would shift as it slides away.
        expect(fab.className).toContain('translate-y-24');
        expect(fab.className).toContain('opacity-0');
        expect(fab.className).toContain('fixed');
    });
});