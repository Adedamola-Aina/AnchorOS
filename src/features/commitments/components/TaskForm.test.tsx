// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TaskForm } from './TaskForm';

// Mock useUnsavedChanges to capture calls
const mockSetDirty = vi.fn();
vi.mock('../../../hooks/useUnsavedChanges', () => ({
    useUnsavedChanges: (dirty?: boolean) => {
        mockSetDirty(dirty);
        return { isDirty: false, setDirty: vi.fn(), confirmDiscard: () => true };
    },
}));

// Mock TaskFormParts (heavy sub-components)
vi.mock('./TaskFormParts', () => ({
    FrequencyStep: ({ onSelectType }: any) => (
        <div data-testid="frequency-step">
            <button onClick={() => onSelectType('daily')}>Daily</button>
        </div>
    ),
    DetailsHeader: ({ onClose }: any) => <div data-testid="details-header"><button onClick={onClose}>Close</button></div>,
    DailyTimeField: () => <div data-testid="daily-time" />,
    WeeklyDaysField: () => null,
    MonthlyDatesField: () => null,
}));

vi.mock('../../../components/shared', () => ({
    PopoverMenu: ({ items, value, onChange, label, testId }: any) => (
        <div data-testid={testId}>
            {label && <span>{label}</span>}
            <select value={value} onChange={(e: any) => onChange(e.target.value)}>
                {items.map((item: any) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
        </div>
    ),
    TimeWheelPicker: ({ label, value, onChange, testId }: any) => (
        <div data-testid={testId}>
            {label && <label>{label}</label>}
            <input type="time" value={value} onChange={(e: any) => onChange(e.target.value)} className="min-h-[44px]" data-testid="reminder-time-input" />
        </div>
    ),
}));

const defaultProps = {
    onClose: vi.fn(),
    onAdd: vi.fn().mockResolvedValue(undefined),
    hasFamilyActive: false,
};

describe('TaskForm — unsaved changes guard', () => {
    it('starts with dirty = false', () => {
        render(<TaskForm {...defaultProps} />);
        // On initial render, useUnsavedChanges should be called with false
        expect(mockSetDirty).toHaveBeenCalledWith(false);
    });

    it('sets dirty = true when title has text', () => {
        render(<TaskForm {...defaultProps} />);
        // Move to details step
        fireEvent.click(screen.getByText('Daily'));
        // Type in the name field
        const input = screen.getByPlaceholderText(/morning prayer/i);
        fireEvent.change(input, { target: { value: 'Gym' } });
        // After change, useUnsavedChanges should receive true
        expect(mockSetDirty).toHaveBeenCalledWith(true);
    });

    it('dirty stays false when title is empty', () => {
        mockSetDirty.mockClear();
        render(<TaskForm {...defaultProps} />);
        fireEvent.click(screen.getByText('Daily'));
        // No text typed — all calls should have been false
        const allFalse = mockSetDirty.mock.calls.every((c: any) => c[0] === false);
        expect(allFalse).toBe(true);
    });
});

describe('TaskForm — reminder field layout (BUG-092)', () => {
    it('renders reminder field outside the two-column grid as a full-width row', () => {
        render(<TaskForm {...defaultProps} />);
        fireEvent.click(screen.getByText('Daily'));

        const reminderLabel = screen.getByText(/reminder/i);
        expect(reminderLabel).toBeInTheDocument();

        // The reminder container should NOT be inside the grid
        const grid = document.querySelector('.grid');
        const reminderContainer = screen.getByTestId('reminder-field');
        expect(grid?.contains(reminderContainer)).toBe(false);
    });

    it('reminder input has iOS-safe attributes', () => {
        render(<TaskForm {...defaultProps} />);
        fireEvent.click(screen.getByText('Daily'));

        const reminderInput = screen.getByTestId('reminder-input');
        expect(reminderInput).not.toBeNull();
        // TimeWheelPicker wraps the reminder field
        const timeInput = reminderInput.querySelector('input[type="time"]');
        expect(timeInput).not.toBeNull();
        expect(timeInput!.className).toContain('min-h-[44px]');
    });

    it('uses compact modal container sizing', () => {
        const { container } = render(<TaskForm {...defaultProps} />);
        const card = container.querySelector('.max-w-2xl');
        expect(card).toBeInTheDocument();
    });
});
