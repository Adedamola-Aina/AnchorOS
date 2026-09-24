// @vitest-environment jsdom

/**
 * The behaviour every overlay owes the user.
 *
 * Before this hook, six of the app's seven dialog-like surfaces had no focus trap,
 * no scroll lock and no `data-modal-open` marker — so Tab walked into the inert page
 * behind a sheet, the page scrolled underneath it, and the contextual FAB stayed on
 * screen over it (the FAB stands down on that marker).
 */
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { useRef } from 'react';
import { useOverlayBehavior, openOverlayDepth } from './useOverlayBehavior';

const Panel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    useOverlayBehavior({ isOpen, onClose, panelRef });
    if (!isOpen) return null;
    return (
        <div ref={panelRef} role="dialog" aria-modal="true" data-testid="panel">
            <button type="button">first</button>
            <button type="button">last</button>
        </div>
    );
};

const tab = (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true });
    document.dispatchEvent(event);
    return event;
};

describe('useOverlayBehavior', () => {
    afterEach(() => {
        document.body.style.overflow = '';
        delete document.body.dataset.modalOpen;
    });

    it('locks the page and tells the shell a sheet is up', () => {
        const { unmount } = render(<Panel isOpen onClose={() => {}} />);
        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.dataset.modalOpen).toBe('true');
        unmount();
    });

    it('hands the page back when the last overlay closes', () => {
        const { unmount } = render(<Panel isOpen onClose={() => {}} />);
        expect(openOverlayDepth()).toBe(1);
        unmount();
        expect(openOverlayDepth()).toBe(0);
        expect(document.body.style.overflow).toBe('unset');
        expect(document.body.dataset.modalOpen).toBeUndefined();
    });

    /**
     * Stacked overlays are normal (a date sheet opened from a modal). The old
     * implementation unlocked unconditionally on close, so closing the top sheet
     * handed scrolling back while the modal underneath was still open.
     */
    it('stays locked while a second overlay is still open', () => {
        const first = render(<Panel isOpen onClose={() => {}} />);
        const second = render(<Panel isOpen onClose={() => {}} />);
        expect(openOverlayDepth()).toBe(2);
        second.unmount();
        expect(openOverlayDepth()).toBe(1);
        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.dataset.modalOpen).toBe('true');
        first.unmount();
        expect(document.body.style.overflow).toBe('unset');
    });

    it('closes on Escape', () => {
        const onClose = vi.fn();
        render(<Panel isOpen onClose={onClose} />);
        act(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('keeps Tab inside the panel', () => {
        render(<Panel isOpen onClose={() => {}} />);
        const [first, last] = screen.getAllByRole('button');

        last.focus();
        act(() => tab());
        expect(document.activeElement).toBe(first);

        first.focus();
        act(() => tab(true));
        expect(document.activeElement).toBe(last);
    });

    it('pulls focus back in when it starts outside the panel', () => {
        render(<Panel isOpen onClose={() => {}} />);
        const [first] = screen.getAllByRole('button');
        (document.body as HTMLElement).focus();
        act(() => tab());
        expect(document.activeElement).toBe(first);
    });

    it('does nothing while closed', () => {
        const onClose = vi.fn();
        render(<Panel isOpen={false} onClose={onClose} />);
        expect(document.body.style.overflow).not.toBe('hidden');
        expect(document.body.dataset.modalOpen).toBeUndefined();
        act(() => tab());
        expect(onClose).not.toHaveBeenCalled();
    });
});