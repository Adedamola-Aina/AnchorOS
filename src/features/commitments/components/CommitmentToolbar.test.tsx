
/**
 * CM-29 — the find-or-add field's contract.
 *
 * The reported problem: creation was merged into the search results behind two
 * unlabelled verbs ("Add" silently persisted whatever was typed; "Adjust" meant the
 * same thing as opening the composer), so "g" could become a commitment and a
 * structured line like "Gym Mon Wed Fri" was treated as text.
 *
 * These assertions hold the replacement: matches stay matches, creation is its own
 * labelled block, the interpretation is shown before anything is persisted, and the
 * keyboard cannot persist at all.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { CommitmentFindOrAdd } from './CommitmentToolbar';
import { parseQuickAdd } from '../utils/parseQuickAdd';

const NOW = new Date(2026, 8, 20, 9, 0, 0);

const setup = (value: string, overrides: Record<string, unknown> = {}) => {
    const onChange = vi.fn();
    const onCreateDraft = vi.fn();
    const onEditDetails = vi.fn();
    const intent = value.trim() ? parseQuickAdd(value.trim(), NOW) : null;
    render(
        <CommitmentFindOrAdd
            value={value}
            onChange={onChange}
            resultCount={(overrides.resultCount as number) ?? 0}
            intent={intent}
            onCreateDraft={onCreateDraft}
            onEditDetails={onEditDetails}
        />,
    );
    return { onChange, onCreateDraft, onEditDetails, intent };
};

describe('CommitmentFindOrAdd — nothing is offered until it means something', () => {
    it('shows no creation UI for whitespace', () => {
        setup('   ');
        expect(screen.queryByTestId('create-new')).not.toBeInTheDocument();
        expect(screen.queryByTestId('create-commitment')).not.toBeInTheDocument();
    });

    it('keeps the field findable and labelled', () => {
        setup('');
        expect(screen.getByLabelText('Find or add')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Find a commitment, or type a new one')).toBeInTheDocument();
    });

    it('reports matches without turning them into creation options', () => {
        setup('gym', { resultCount: 2 });
        expect(screen.getByTestId('search-result-count')).toHaveTextContent('2 matches for “gym”');
        // The matches themselves are the list below — nothing synthetic joins them.
        expect(screen.queryByTestId('quick-add-preview')).not.toBeInTheDocument();
    });

    it('treats zero matches as an answer, not an error', () => {
        setup('swimming lessons', { resultCount: 0 });
        expect(screen.getByTestId('search-result-count')).toHaveTextContent('No commitments found for “swimming lessons”');
        expect(screen.getByTestId('create-new')).toBeInTheDocument();
    });
});

describe('CommitmentFindOrAdd — the old Add/Adjust row is gone', () => {
    it('has no Add button and no Adjust label anywhere', () => {
        setup('Gym Mon Wed Fri', { resultCount: 0 });
        expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Adjust' })).not.toBeInTheDocument();
        expect(screen.queryByText('Adjust')).not.toBeInTheDocument();
    });

    it('names its actions for what they do', () => {
        setup('Gym Mon Wed Fri', { resultCount: 0 });
        expect(screen.getByTestId('create-commitment')).toHaveAccessibleName('Create');
        expect(screen.getByTestId('edit-details')).toHaveAccessibleName(/Edit details/);
    });
});

describe('CommitmentFindOrAdd — the preview is the contract', () => {
    it('shows the interpreted title, cadence and days before anything is created', () => {
        setup('Gym Mon Wed Fri', { resultCount: 0 });

        const block = within(screen.getByTestId('create-new'));
        expect(block.getByText(/\+ Create “Gym”/)).toBeInTheDocument();
        expect(screen.getByTestId('create-summary')).toHaveTextContent('weekly · Mon, Wed, Fri');
    });

    it('offers plain one-off creation for ordinary text', () => {
        setup('Buy milk', { resultCount: 0 });
        expect(screen.getByTestId('create-summary')).toHaveTextContent('One-off');
        expect(screen.getByTestId('create-commitment')).toBeInTheDocument();
    });

    it('asks for the missing day instead of inventing one', () => {
        setup('Gym weekly', { resultCount: 0 });
        expect(screen.getByTestId('create-summary')).toHaveTextContent('weekly · Choose day');
        expect(screen.getByTestId('edit-details')).toHaveAccessibleName(/Continue setup/);
        // No direct creation while the domain still needs a weekday.
        expect(screen.queryByTestId('create-commitment')).not.toBeInTheDocument();
    });

    it('offers only the composer when the text is not a schedule it can claim', () => {
        setup('Work out three times a week', { resultCount: 0 });
        expect(screen.getByTestId('create-summary')).toHaveTextContent('Set schedule and details');
        expect(screen.queryByTestId('create-commitment')).not.toBeInTheDocument();
        expect(screen.getByTestId('edit-details')).toHaveAccessibleName(/Edit details/);
    });

    it('does not offer direct creation for a single character', () => {
        setup('g', { resultCount: 0 });
        expect(screen.queryByTestId('create-commitment')).not.toBeInTheDocument();
        expect(screen.getByTestId('edit-details')).toBeInTheDocument();
    });

    it('creates only when Create is pressed', () => {
        const { onCreateDraft } = setup('Gym Mon Wed Fri', { resultCount: 0 });
        expect(onCreateDraft).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('create-commitment'));

        expect(onCreateDraft).toHaveBeenCalledTimes(1);
        expect(onCreateDraft.mock.calls[0][0]).toMatchObject({ title: 'Gym', type: 'weekly', daysOfWeek: [1, 3, 5] });
    });

    it('hands every recognised field to the composer from Edit details', () => {
        const { onEditDetails } = setup('Gym Mon Wed Fri', { resultCount: 0 });

        fireEvent.click(screen.getByTestId('edit-details'));

        expect(onEditDetails).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Gym', type: 'weekly', daysOfWeek: [1, 3, 5] }),
        );
    });
});

describe('CommitmentFindOrAdd — the keyboard never persists', () => {
    it('does not create when Enter is pressed, and focuses the action instead', () => {
        const { onCreateDraft, onEditDetails } = setup('Gym Mon Wed Fri', { resultCount: 0 });

        fireEvent.submit(screen.getByTestId('commitment-find-or-add').closest('form')!);

        expect(onCreateDraft).not.toHaveBeenCalled();
        expect(onEditDetails).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(screen.getByTestId('create-commitment'));
    });

    it('does not create when Enter is pressed on a partial line', () => {
        const { onCreateDraft, onEditDetails } = setup('g', { resultCount: 0 });

        fireEvent.submit(screen.getByTestId('commitment-find-or-add').closest('form')!);

        expect(onCreateDraft).not.toHaveBeenCalled();
        expect(onEditDetails).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(screen.getByTestId('edit-details'));
    });

    it('marks the field as a search surface until the text reads as a commitment', () => {
        setup('gym');
        expect(screen.getByTestId('commitment-find-or-add')).toHaveAttribute('enterkeyhint', 'search');
    });

    it('keeps typing as the only way to change the field', () => {
        const { onChange } = setup('gym');
        fireEvent.change(screen.getByTestId('commitment-find-or-add'), { target: { value: 'gym mon' } });
        expect(onChange).toHaveBeenCalledWith('gym mon');
    });
});