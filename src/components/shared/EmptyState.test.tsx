import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Inbox } from 'lucide-react';
import { EmptyState } from './EmptyState';

describe('EmptyState (UX-DS-07 — the one empty-state pattern)', () => {
    it('says what this is, why it is empty, and offers the action it names', () => {
        const onClick = vi.fn();
        render(
            <EmptyState
                icon={Inbox}
                title="No commitments yet"
                description="Add your first one to start building a streak."
                action={{ label: 'Create a commitment', onClick }}
            />,
        );

        expect(screen.getByText('No commitments yet')).toBeInTheDocument();
        expect(screen.getByText(/start building a streak/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /create a commitment/i }).click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('stays honest when there is genuinely nothing the user can do', () => {
        render(<EmptyState icon={Inbox} title="Nothing due today" />);

        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('never offers more than one primary action', () => {
        render(
            <EmptyState
                icon={Inbox}
                title="No transactions this month"
                action={{ label: 'Record a transaction', onClick: vi.fn() }}
                secondaryAction={{ label: 'See other months', onClick: vi.fn() }}
            />,
        );

        expect(screen.getAllByRole('button')).toHaveLength(2);
        expect(screen.getByRole('button', { name: /record a transaction/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /see other months/i })).toBeInTheDocument();
    });

    it('marks the icon decorative so it never pollutes the accessible name', () => {
        render(<EmptyState icon={Inbox} title="No accounts yet" testId="finance-empty" />);

        const icon = screen.getByTestId('finance-empty').querySelector('svg');
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });
});
