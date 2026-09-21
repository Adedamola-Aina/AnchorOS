// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { TaskForm } from './TaskForm';

// Mock useUnsavedChanges to capture calls
const mockSetDirty = vi.fn();
/** Flipped per-test so the reminder cross-check can be asserted both ways. */
let reminderOutsideWindow = false;
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
    // The reminder cross-check lives beside the fields it describes.
    reminderOutsidePreferredWindow: () => reminderOutsideWindow,
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
    Modal: ({ children, title, maxWidth, footer }: any) => (
        <div data-testid="composer-sheet" className={maxWidth}>
            {title && <h3>{title}</h3>}
            {children}
            {footer && <div data-testid="modal-footer">{footer}</div>}
        </div>
    ),
}));

const defaultProps = {
    onClose: vi.fn(),
    onAdd: vi.fn().mockResolvedValue(undefined),
    hasFamilyActive: false,
};

/** The refinements live behind one deliberate tap now. */
const openMoreOptions = () => fireEvent.click(screen.getByTestId('composer-more-toggle'));

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
        openMoreOptions();

        expect(screen.getByText('Area')).toBeInTheDocument();
        expect(screen.queryByText('Domain')).not.toBeInTheDocument();
    });

    it('shows priority as icons, never as emoji (UX-CM-09 / UX-DS-01)', () => {
        render(<TaskForm {...defaultProps} />);
        openMoreOptions();

        const selector = screen.getByTestId('priority-selector');
        expect(within(selector).getByTestId('priority-high')).toBeInTheDocument();
        expect(within(selector).getByTestId('priority-medium')).toBeInTheDocument();
        expect(within(selector).getByTestId('priority-low')).toBeInTheDocument();
        // The emoji were 🔴 / 🟡 / 🟢.
        expect(selector.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    });
});
describe('TaskForm — reminder field layout (BUG-092)', () => {
    it('renders the reminder as a full-width row, never a grid cell (BUG-092)', () => {
        render(<TaskForm {...defaultProps} />);
        fireEvent.click(screen.getByText('Daily'));
        openMoreOptions();

        expect(screen.getByText(/reminder/i)).toBeInTheDocument();

        // The reminder owns the whole row: it is not a grid cell.
        const reminderContainer = screen.getByTestId('reminder-field');
        const more = screen.getByTestId('composer-more-options');
        expect(more.contains(reminderContainer)).toBe(true);
        expect(more.className).not.toContain('grid');
    });

    it('reminder input has iOS-safe attributes', () => {
        render(<TaskForm {...defaultProps} />);
        fireEvent.click(screen.getByText('Daily'));
        openMoreOptions();

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

/**
 * The composer used to open with every field it owned — Area, Priority,
 * Context, the whole recurrence model, Notes and a reminder — so capturing a
 * simple commitment meant reading past all of them. Capture is name + cadence +
 * when; the rest is a refinement, one deliberate tap away, and nothing was
 * removed.
 */
describe('TaskForm — capture first, refinements one tap away', () => {
    it('opens on the name, the cadence and when — nothing else', () => {
        render(<TaskForm {...defaultProps} />);

        expect(screen.getByTestId('task-name')).toBeInTheDocument();
        expect(screen.getByTestId('cadence-selector')).toBeInTheDocument();
        // `daily` is the default cadence, so its field is the "when".
        expect(screen.getByTestId('daily-time')).toBeInTheDocument();

        // The refinements are not in the way of capturing.
        expect(screen.queryByTestId('composer-more-options')).toBeNull();
        expect(screen.queryByTestId('priority-selector')).toBeNull();
        expect(screen.queryByText('Area')).toBeNull();
        expect(screen.queryByTestId('task-notes')).toBeNull();
        expect(screen.queryByTestId('reminder-field')).toBeNull();
        expect(screen.queryByTestId('repeat-fields')).toBeNull();
        // …and the primary action is reachable without expanding anything.
        expect(screen.getByRole('button', { name: /save commitment/i })).toBeInTheDocument();
    });

    it('puts every refinement one tap away, and loses none of them', () => {
        render(<TaskForm {...defaultProps} />);
        openMoreOptions();

        expect(screen.getByTestId('composer-more-options')).toBeInTheDocument();
        expect(screen.getByText('Area')).toBeInTheDocument();
        expect(screen.getByTestId('priority-selector')).toBeInTheDocument();
        expect(screen.getByTestId('repeat-fields')).toBeInTheDocument();
        expect(screen.getByTestId('task-notes')).toBeInTheDocument();
        expect(screen.getByTestId('reminder-field')).toBeInTheDocument();
    });

    it('collapses again, so the sheet returns to capture-only', () => {
        render(<TaskForm {...defaultProps} />);

        openMoreOptions();
        expect(screen.getByTestId('composer-more-options')).toBeInTheDocument();
        expect(screen.getByTestId('composer-more-toggle')).toHaveAttribute('aria-expanded', 'true');

        openMoreOptions();
        expect(screen.queryByTestId('composer-more-options')).toBeNull();
        expect(screen.getByTestId('composer-more-toggle')).toHaveAttribute('aria-expanded', 'false');
    });

    it('states when a collapsed refinement holds a non-default value', () => {
        render(<TaskForm {...defaultProps} />);
        // Nothing set yet — the toggle stays quiet.
        expect(screen.queryByTestId('composer-more-set')).toBeNull();

        openMoreOptions();
        fireEvent.change(screen.getByTestId('reminder-time-input'), { target: { value: '07:30' } });
        openMoreOptions(); // collapse

        expect(screen.getByTestId('composer-more-set')).toBeInTheDocument();
    });

    it('does not flag the toggle for values that are still the preset', () => {
        render(<TaskForm {...defaultProps} />);
        openMoreOptions();
        openMoreOptions();

        expect(screen.queryByTestId('composer-more-set')).toBeNull();
    });

    /**
     * "Preferred time: Afternoon" beside "Reminder: 9:00 AM" was reported as
     * contradictory with nothing explaining the relationship. The reminder is a
     * notification; the preferred time only orders the day — and when they
     * disagree, the composer says so.
     */
    it('states the reminder separately from the preferred time of day', () => {
        render(<TaskForm {...defaultProps} />);
        openMoreOptions();

        // The preferred-time half of the pair is asserted where it renders
        // (TaskFormParts.test.tsx); here we own the reminder's own wording.
        expect(screen.getByText(/sends a notification at this exact time/i)).toBeInTheDocument();
    });

    it('says when a reminder falls outside the preferred time of day', () => {
        reminderOutsideWindow = true;
        render(<TaskForm {...defaultProps} />);
        openMoreOptions();

        expect(screen.getByTestId('reminder-window-note')).toBeInTheDocument();
        expect(screen.getByTestId('reminder-window-note').textContent).toMatch(/outside your preferred/i);
    });

    it('stays quiet when the reminder sits inside the preferred time of day', () => {
        reminderOutsideWindow = false;
        render(<TaskForm {...defaultProps} />);
        openMoreOptions();

        expect(screen.queryByTestId('reminder-window-note')).toBeNull();
    });
});
