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
vi.mock('../../context/FinanceContext', () => ({
    useFinance: () => ({ addAccount: vi.fn().mockResolvedValue(undefined) }),
}));
vi.mock('../../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: vi.fn() }),
}));

const defaultProps = { onClose: vi.fn() };

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
