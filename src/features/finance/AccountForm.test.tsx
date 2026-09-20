// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AccountForm } from './AccountForm';

// Mock useUnsavedChanges to capture calls
const mockSetDirty = vi.fn();
vi.mock('../../hooks/useUnsavedChanges', () => ({
    useUnsavedChanges: (dirty?: boolean) => {
        mockSetDirty(dirty);
        return { isDirty: false, setDirty: vi.fn(), confirmDiscard: () => true };
    },
}));

// Mock dependencies
const mockAddAccount = vi.fn().mockResolvedValue(undefined);
vi.mock('../../context/FinanceContext', () => ({
    useFinance: () => ({ addAccount: mockAddAccount }),
}));
vi.mock('../../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: vi.fn() }),
}));

const defaultProps = { onClose: vi.fn() };

describe('AccountForm — connected journey (UX-FN-03)', () => {
    it('shows a success state with one primary next step instead of closing', async () => {
        const onClose = vi.fn();
        const onRecordFirstTransaction = vi.fn();
        mockAddAccount.mockResolvedValueOnce('acc-9');

        render(<AccountForm onClose={onClose} onRecordFirstTransaction={onRecordFirstTransaction} />);

        fireEvent.change(screen.getByPlaceholderText(/Zenith Spending/i), { target: { value: 'Main Checking' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
        fireEvent.click(screen.getByRole('button', { name: /create account|save|add account/i }));

        // The defect: it closed immediately, so creation and recording were disconnected.
        expect(await screen.findByTestId('account-created')).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('record-first-transaction-after-create'));
        expect(onRecordFirstTransaction).toHaveBeenCalledWith('acc-9');
    });

    it('still offers a plain Done exit', async () => {
        const onClose = vi.fn();
        mockAddAccount.mockResolvedValueOnce('acc-10');

        render(<AccountForm onClose={onClose} />);

        fireEvent.change(screen.getByPlaceholderText(/Zenith Spending/i), { target: { value: 'Savings' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
        fireEvent.click(screen.getByRole('button', { name: /create account|save|add account/i }));

        await screen.findByTestId('account-created');
        fireEvent.click(screen.getByRole('button', { name: /^Done$/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('AccountForm — unsaved changes guard', () => {
    it('starts with dirty = false', () => {
        render(<AccountForm {...defaultProps} />);
        expect(mockSetDirty).toHaveBeenCalledWith(false);
    });

    it('sets dirty = true when name has text', () => {
        render(<AccountForm {...defaultProps} />);
        const input = screen.getByPlaceholderText(/zenith spending/i);
        fireEvent.change(input, { target: { value: 'My Account' } });
        expect(mockSetDirty).toHaveBeenCalledWith(true);
    });

    it('sets dirty = true when balance has value', () => {
        render(<AccountForm {...defaultProps} />);
        const balanceInput = screen.getByPlaceholderText('0.00');
        fireEvent.change(balanceInput, { target: { value: '500' } });
        expect(mockSetDirty).toHaveBeenCalledWith(true);
    });
});
