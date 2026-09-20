// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

// Mock TaskFormParts (heavy sub-components). The old FrequencyStep/DetailsHeader
// are gone: UX-CM-01 removed the classification-first step.
vi.mock('./TaskFormParts', () => ({
    DailyTimeField: () => <div data-testid="daily-time" />,
    WeeklyDaysField: () => null,
    MonthlyDatesField: () => null,
    // CM-17: the schedule model fields (interval / start / end / due date).
    RepeatFields: () => <div data-testid="repeat-fields" />,
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

// `Modal` is imported from its own module (the shared barrel does not re-export
// it), so it needs its own mock.
vi.mock('../../../components/shared/Modal', () => ({
    Modal: ({ children, title, maxWidth }: any) => (
        <div data-testid="composer-sheet" className={maxWidth}>
            {title && <h3>{title}</h3>}
            {children}
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

describe('TaskForm — capture-first composer (UX-CM-01 / CM-02 / CM-09)', () => {
    it('opens on the name, not on a classifier (UX-CM-01)', () => {
        render(<TaskForm {...defaultProps} />);

        expect(screen.getByTestId('task-name')).toBeInTheDocument();
        expect(screen.queryByText(/choose frequency/i)).not.toBeInTheDocument();
        // The cadence is still reachable, just not in the way of capturing.
        expect(screen.getByTestId('cadence-selector')).toBeInTheDocument();
    });

    it('is presented as a sheet with a title (UX-CM-02)', () => {
        render(<TaskForm {...defaultProps} />);

        const sheet = screen.getByTestId('composer-sheet');
        expect(sheet).toBeInTheDocument();
        expect(within(sheet).getByText('New Commitment')).toBeInTheDocument();
    });

    it('offers exactly one dismiss path and a reachable Save (UX-CM-02)', () => {
        render(<TaskForm {...defaultProps} />);

        // The old form had a "Back" step button plus a header close: two exits.
        expect(screen.queryByRole('button', { name: /^back$/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save commitment/i })).toBeInTheDocument();
    });

    it('says "Area" instead of the internal "Domain" jargon (UX-CM-09)', () => {
        render(<TaskForm {...defaultProps} />);

        expect(screen.getByText('Area')).toBeInTheDocument();
        expect(screen.queryByText('Domain')).not.toBeInTheDocument();
    });

    it('shows priority as icons, never as emoji (UX-CM-09 / UX-DS-01)', () => {
        render(<TaskForm {...defaultProps} />);

        const selector = screen.getByTestId('priority-selector');
        expect(within(selector).getByTestId('priority-high')).toBeInTheDocument();
        expect(within(selector).getByTestId('priority-medium')).toBeInTheDocument();
        expect(within(selector).getByTestId('priority-low')).toBeInTheDocument();
        // The emoji were 🔴 / 🟡 / 🟢.
        expect(selector.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
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
