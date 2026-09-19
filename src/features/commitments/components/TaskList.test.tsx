// @ts-nocheck
/**
 * UX-CM-08: completing a financial-looking commitment used to open a blocking
 * cross-domain "Financial Transaction?" modal. The offer is now an inline,
 * dismissible chip on the completed row.
 *
 * This suite covers the wiring the CommitmentsView harness cannot reach: its
 * mock `toggleTask` is a no-op, so a task never becomes `completed` there and the
 * completed row that carries the chip never renders.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TaskList } from './TaskList';
import { buildTask } from '../../../test/factories';

const completedTask = () => buildTask({ id: 'c1', title: 'Pay Rent', completed: true });

const baseProps = {
    activeTasks: [],
    hasFamilyActive: false,
    editingTaskId: null,
    onToggle: vi.fn(),
    onStartEdit: vi.fn(),
    onDelete: vi.fn(),
};

describe('TaskList — inline transaction offer (UX-CM-08)', () => {
    it('renders the chip on the completed row without needing to expand the section', () => {
        render(
            <TaskList
                {...baseProps}
                completedTasks={[completedTask()]}
                financialNudgeTaskId="c1"
                onRecordTransaction={vi.fn()}
                onDismissFinancialNudge={vi.fn()}
            />,
        );

        // The Completed section is collapsed by default; the chip must still be
        // visible, because the user has just completed that row.
        expect(screen.getByTestId('financial-nudge')).toBeInTheDocument();
    });

    it('calls the record and dismiss handlers from the chip', () => {
        const onRecordTransaction = vi.fn();
        const onDismissFinancialNudge = vi.fn();
        render(
            <TaskList
                {...baseProps}
                completedTasks={[completedTask()]}
                financialNudgeTaskId="c1"
                onRecordTransaction={onRecordTransaction}
                onDismissFinancialNudge={onDismissFinancialNudge}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Record' }));
        expect(onRecordTransaction).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: /dismiss transaction prompt/i }));
        expect(onDismissFinancialNudge).toHaveBeenCalledTimes(1);
    });

    it('shows no chip when no row is awaiting a decision', () => {
        render(<TaskList {...baseProps} completedTasks={[completedTask()]} />);

        expect(screen.queryByTestId('financial-nudge')).not.toBeInTheDocument();
        // ...and the section stays collapsed, exactly as before this change.
        expect(screen.queryByText('Pay Rent')).not.toBeInTheDocument();
    });

    it('does not attach the chip to a different completed row', () => {
        render(
            <TaskList
                {...baseProps}
                completedTasks={[completedTask(), buildTask({ id: 'c2', title: 'Call Mum', completed: true })]}
                financialNudgeTaskId="c2"
            />,
        );

        expect(screen.getAllByTestId('financial-nudge')).toHaveLength(1);
    });
});