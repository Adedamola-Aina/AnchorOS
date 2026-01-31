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
});
