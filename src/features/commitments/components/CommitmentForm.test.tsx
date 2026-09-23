
/**
 * The shared form, driven the way a user drives it.
 *
 * These assertions are about the two things the audit found broken: the recurrence
 * controls must match the cadence (no weekday strip on a daily commitment, no
 * month-date picker on a one-off), and the refinements must stay one deliberate tap
 * away without ever hiding a value the user set.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { CommitmentForm } from './CommitmentForm';

/**
 * Partial mock: the cadence controls are stubbed (they are visual), but
 * `RepeatFields` stays REAL — the schedule bounds are part of what this suite
 * asserts, and its own suite covers the control internals.
 */
vi.mock('./TaskFormParts', async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        DailyTimeField: ({ value, onChange }: any) => (
            <select data-testid="time-of-day-select" value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
            </select>
        ),
        WeeklyDaysField: ({ value, onChange }: any) => (
            <div data-testid="weekday-selector">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <button key={day} type="button" aria-pressed={value.includes(day)} onClick={() => onChange(value.includes(day) ? value.filter((d: number) => d !== day) : [...value, day])}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][day]}
                    </button>
                ))}
            </div>
        ),
        MonthlyDatesField: ({ value, onChange }: any) => (
            <div data-testid="month-days-row">
                {[1, 15, 28].map((day) => (
                    <button key={day} type="button" aria-pressed={value.includes(day)} onClick={() => onChange(value.includes(day) ? value.filter((d: number) => d !== day) : [...value, day])}>
                        {day}
                    </button>
                ))}
            </div>
        ),
        reminderOutsidePreferredWindow: () => false,
    };
});

vi.mock('../../../components/shared', () => ({
    PopoverMenu: ({ items, value, onChange, label, testId }: any) => (
        <div data-testid={testId}>
            {label && <span>{label}</span>}
            <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
                {items.map((item: any) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
        </div>
    ),
    InlineDatePicker: ({ value, onChange, testId }: any) => (
        <input data-testid={testId} type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    ),
    SegmentedControl: ({ options, value, onChange, label, testId }: any) => (
        <div data-testid={testId} role="radiogroup" aria-label={label}>
            {options.map((opt: any) => (
                <button key={opt.value} type="button" role="radio" aria-checked={value === opt.value} onClick={() => onChange(opt.value)}>{opt.label}</button>
            ))}
        </div>
    ),
    TimeWheelPicker: ({ value, onChange, testId }: any) => (
        <input data-testid={testId} type="time" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    ),
}));


const renderForm = (props: any = {}) => {
    const onCreate = props.onCreate ?? vi.fn().mockResolvedValue(undefined);
    const onSave = props.onSave ?? vi.fn().mockResolvedValue(undefined);
    render(
        <>
            <CommitmentForm
                mode={props.mode ?? 'create'}
                formId={FORM_ID}
                hasFamilyActive={props.hasFamilyActive ?? false}
                task={props.task}
                initialDraft={props.initialDraft}
                onCreate={onCreate}
                onSave={onSave}
            />
            {/* Exactly how the sheet's pinned footer submits it: from outside the form. */}
            <button type="submit" form={FORM_ID}>Save</button>
        </>,
    );
    return { onCreate, onSave };
};

const save = () => fireEvent.click(screen.getByRole('button', { name: 'Save' }));
const cadence = (label: string) => fireEvent.click(within(screen.getByTestId('cadence-selector')).getByText(label));
const openMore = () => fireEvent.click(screen.getByTestId('composer-more-toggle'));

describe('CommitmentForm — the recurrence controls follow the cadence', () => {
    beforeEach(() => vi.clearAllMocks());

    it('shows the part of day for a daily commitment, and no weekday or date picker', () => {
        renderForm();
        expect(screen.getByTestId('time-of-day-select')).toBeInTheDocument();
        expect(screen.queryByTestId('weekday-selector')).not.toBeInTheDocument();
        expect(screen.queryByTestId('month-days-row')).not.toBeInTheDocument();
    });

    it('reveals the weekday strip for weekly, keeps the selection, and writes those days', () => {
        const { onCreate } = renderForm();
        cadence('Weekly');

        expect(screen.queryByTestId('time-of-day-select')).not.toBeInTheDocument();
        expect(screen.queryByTestId('month-days-row')).not.toBeInTheDocument();

        const weekdays = screen.getByTestId('weekday-selector');
        fireEvent.click(within(weekdays).getByText('Mo'));
        fireEvent.click(within(weekdays).getByText('Th'));
        expect(within(weekdays).getByText('Mo')).toHaveAttribute('aria-pressed', 'true');

        fireEvent.change(screen.getByTestId('task-name'), { target: { value: 'Bins' } });
        save();
        expect(onCreate.mock.calls[0][0]).toMatchObject({ title: 'Bins', type: 'weekly', daysOfWeek: [1, 4] });
    });

    it('reveals the date-of-month picker for monthly, and writes those dates', () => {
        const { onCreate } = renderForm();
        cadence('Monthly');

        expect(screen.getByTestId('month-days-row')).toBeInTheDocument();
        expect(screen.queryByTestId('weekday-selector')).not.toBeInTheDocument();
        expect(screen.queryByTestId('time-of-day-select')).not.toBeInTheDocument();

        fireEvent.click(within(screen.getByTestId('month-days-row')).getByText('15'));
        fireEvent.change(screen.getByTestId('task-name'), { target: { value: 'Rent' } });
        save();
        expect(onCreate.mock.calls[0][0]).toMatchObject({ type: 'monthly', daysOfMonth: [15] });
    });

    it('gives a one-off a due date instead of the start/end bounds', () => {
        renderForm();
        cadence('One-off');
        openMore();

        expect(screen.getByTestId('due-date-input')).toBeInTheDocument();
        expect(screen.queryByTestId('start-date-input')).not.toBeInTheDocument();
        expect(screen.queryByTestId('time-of-day-select')).not.toBeInTheDocument();
        expect(screen.queryByTestId('weekday-selector')).not.toBeInTheDocument();
        expect(screen.queryByTestId('month-days-row')).not.toBeInTheDocument();
    });
});


describe('CommitmentForm — refinements and validation', () => {
    beforeEach(() => vi.clearAllMocks());

    it('keeps the refinements out of the way until asked, and says when one is set', () => {
        renderForm();
        expect(screen.queryByTestId('composer-more-options')).not.toBeInTheDocument();

        openMore();
        expect(screen.getByTestId('composer-more-options')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Area'), { target: { value: 'Health' } });
        fireEvent.click(screen.getByTestId('composer-more-toggle')); // collapse again
        expect(screen.getByTestId('composer-more-set')).toBeInTheDocument();
    });

    it('carries Area, priority, notes, reminder and the bounds into the payload', () => {
        const { onCreate } = renderForm();
        fireEvent.change(screen.getByTestId('task-name'), { target: { value: 'Therapy' } });
        openMore();

        fireEvent.change(screen.getByLabelText('Area'), { target: { value: 'Health' } });
        fireEvent.click(within(screen.getByTestId('priority-selector')).getByText('High'));
        fireEvent.change(screen.getByTestId('task-notes'), { target: { value: '  weekly session  ' } });
        fireEvent.change(screen.getByTestId('reminder-input'), { target: { value: '09:30' } });
        fireEvent.change(screen.getByTestId('start-date-input'), { target: { value: '2026-10-01' } });
        fireEvent.change(screen.getByTestId('end-date-input'), { target: { value: '2026-12-01' } });

        save();
        expect(onCreate.mock.calls[0][0]).toMatchObject({
            title: 'Therapy', domain: 'Health', priority: 'high', notes: 'weekly session',
            reminderTime: '09:30', startDate: '2026-10-01', endDate: '2026-12-01',
        });
    });

    it('offers the family scope only when family sharing is active, and writes it', () => {
        const { onCreate } = renderForm({ hasFamilyActive: true });
        openMore();
        fireEvent.click(screen.getByRole('radio', { name: 'Family' }));
        fireEvent.change(screen.getByTestId('task-name'), { target: { value: 'Shared chore' } });
        save();

        expect(onCreate.mock.calls[0][0]).toMatchObject({ category: 'family' });
    });

    it('hides the family scope when there is no family', () => {
        renderForm({ hasFamilyActive: false });
        openMore();
        expect(screen.queryByTestId('scope-selector')).not.toBeInTheDocument();
    });

    it('refuses to submit without a name, and points at the field', () => {
        const { onCreate } = renderForm();
        save();

        expect(onCreate).not.toHaveBeenCalled();
        expect(screen.getByTestId('commitment-name-error')).toHaveTextContent('Give this commitment a name.');
        expect(screen.getByTestId('task-name')).toHaveAttribute('aria-invalid', 'true');
    });

    it('refuses a weekly commitment with no day, because it could never come round', () => {
        const { onCreate } = renderForm();
        fireEvent.change(screen.getByTestId('task-name'), { target: { value: 'Bins' } });
        cadence('Weekly');
        save();

        expect(onCreate).not.toHaveBeenCalled();
        expect(screen.getByTestId('recurrence-error')).toHaveTextContent('Pick at least one day.');
    });
});

describe('CommitmentForm — edit mode', () => {
    beforeEach(() => vi.clearAllMocks());

    const task = {
        id: 't1', title: 'Read Bible', type: 'weekly', domain: 'Bible', category: 'personal',
        daysOfWeek: [1], createdAt: new Date(),
    } as any;

    it('states the cadence read-only and opens the refinements', () => {
        renderForm({ mode: 'edit', task });

        expect(screen.getByTestId('cadence-locked')).toHaveTextContent('Weekly');
        expect(screen.queryByTestId('cadence-selector')).not.toBeInTheDocument();
        // The editor exists to change things: nothing hides behind the toggle.
        expect(screen.getByTestId('composer-more-options')).toBeInTheDocument();
        expect(screen.getByTestId('start-date-input')).toBeInTheDocument();
        // The interval picker is offered where the cadence is already fixed — the
        // composer deliberately omits it ("Every day" under "Daily" was duplication).
        expect(screen.getByTestId('repeat-interval-select')).toBeInTheDocument();
    });

    it('patches the values it owns and never the cadence', () => {
        const { onSave } = renderForm({ mode: 'edit', task });

        fireEvent.change(screen.getByTestId('task-name'), { target: { value: 'Read the Bible' } });
        fireEvent.click(within(screen.getByTestId('weekday-selector')).getByText('Th'));
        save();

        const [id, patch] = onSave.mock.calls[0];
        expect(id).toBe('t1');
        expect(patch).toMatchObject({ title: 'Read the Bible', daysOfWeek: [1, 4] });
        expect(patch.type).toBeUndefined();
    });
});

vi.mock('../../../hooks/useUnsavedChanges', () => ({ useUnsavedChanges: vi.fn() }));

const FORM_ID = 'test-commitment-form';
