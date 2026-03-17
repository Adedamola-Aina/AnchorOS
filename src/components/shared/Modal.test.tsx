// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal - REG-003 Regression Test', () => {
    it('allows typing in input fields inside modal', () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <input
                    data-testid="test-input"
                    type="text"
                    placeholder="Type here"
                />
            </Modal>
        );

        const input = screen.getByTestId('test-input');

        // This should work - user should be able to type
        fireEvent.change(input, { target: { value: 'test value' } });

        expect(input).toHaveValue('test value');
    });

    it('allows clicking buttons inside modal', () => {
        const onClose = vi.fn();
        const onClick = vi.fn();

        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <button data-testid="test-button" onClick={onClick}>
                    Click me
                </button>
            </Modal>
        );

        const button = screen.getByTestId('test-button');
        fireEvent.click(button);

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('closes modal when clicking backdrop', () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );

        // Click the backdrop - it's rendered in document.body via portal
        const backdrop = document.querySelector('[aria-hidden="true"]');
        expect(backdrop).toBeTruthy();

        if (backdrop) {
            fireEvent.click(backdrop);
        }

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('stops keyboard event propagation to prevent global handlers from interfering', () => {
        const onClose = vi.fn();
        const globalHandler = vi.fn();

        // Add a global keyboard handler (simulating CommandPalette or FinanceView search)
        window.addEventListener('keydown', globalHandler);

        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <input data-testid="test-input" type="text" />
            </Modal>
        );

        const input = screen.getByTestId('test-input');

        // Type in the input
        fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });

        // Global handler should NOT be called because stopPropagation should prevent it
        expect(globalHandler).not.toHaveBeenCalled();

        window.removeEventListener('keydown', globalHandler);
    });

    it('returns null when not open', () => {
        render(
            <Modal isOpen={false} onClose={vi.fn()} title="Hidden">
                <div>Hidden Content</div>
            </Modal>
        );
        expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });

    it('has proper ARIA dialog attributes', () => {
        render(
            <Modal isOpen={true} onClose={vi.fn()} title="ARIA Test">
                <div>Content</div>
            </Modal>
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('closes on Escape key', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={onClose} title="Esc Test">
                <div>Content</div>
            </Modal>
        );
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });

    it('sets body overflow hidden when open', () => {
        document.body.style.overflow = 'unset';
        render(
            <Modal isOpen={true} onClose={vi.fn()} title="Overflow">
                <div>Content</div>
            </Modal>
        );
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('applies desktop modal classes when fullScreenMobile is false', () => {
        render(
            <Modal isOpen={true} onClose={vi.fn()} title="Desktop" fullScreenMobile={false} maxWidth="max-w-md">
                <div>Desktop content</div>
            </Modal>
        );

        const dialog = screen.getByRole('dialog');
        const contentContainer = dialog.querySelector('.max-w-md');
        expect(contentContainer).toBeTruthy();
        expect(contentContainer?.className).toContain('rounded-2xl');
        expect(contentContainer?.className).toContain('max-h-[90vh]');
    });

    it('traps focus when tabbing past first and last elements', () => {
        render(
            <Modal isOpen={true} onClose={vi.fn()} title="Trap">
                <button data-testid="first">First</button>
                <button data-testid="last">Last</button>
            </Modal>
        );

        const closeButton = screen.getByRole('button', { name: /close modal/i });
        const last = screen.getByTestId('last');

        last.focus();
        fireEvent.keyDown(document, { key: 'Tab' });
        expect(closeButton).toHaveFocus();

        closeButton.focus();
        fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
        expect(last).toHaveFocus();
    });

    it('restores focus to previously active element when modal closes', () => {
        const { rerender } = render(
            <div>
                <button data-testid="outside">Outside</button>
                <Modal isOpen={false} onClose={vi.fn()} title="Closed">
                    <div>Hidden</div>
                </Modal>
            </div>
        );

        const outside = screen.getByTestId('outside');
        outside.focus();

        rerender(
            <div>
                <button data-testid="outside">Outside</button>
                <Modal isOpen={true} onClose={vi.fn()} title="Open">
                    <button>Inside</button>
                </Modal>
            </div>
        );

        rerender(
            <div>
                <button data-testid="outside">Outside</button>
                <Modal isOpen={false} onClose={vi.fn()} title="Closed">
                    <div>Hidden</div>
                </Modal>
            </div>
        );

        expect(screen.getByTestId('outside')).toHaveFocus();
    });
});
