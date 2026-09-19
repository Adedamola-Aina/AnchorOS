import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FabricTodayCard } from './FabricTodayCard';
import type { TodayStats } from '../../types/fabricBriefing';

function stats(overrides: Partial<TodayStats> = {}): TodayStats {
    return { totalTasks: 0, completedTasks: 0, pendingTasks: 0, ...overrides };
}

describe('FabricTodayCard — UX-AI-06 empty day', () => {
    it('never claims nothing is scheduled while the user tracks commitments', () => {
        render(
            <FabricTodayCard
                todayStats={stats({ trackedCommitments: 4, nextDueLabel: 'Mon' })}
                onOpenCommitments={vi.fn()}
            />,
        );

        expect(screen.queryByText(/no tasks scheduled today/i)).not.toBeInTheDocument();
        expect(screen.getByText(/nothing due today — next up mon\./i)).toBeInTheDocument();
    });

    it('tells a brand-new user the truth and offers the action it names', () => {
        render(<FabricTodayCard todayStats={stats()} onOpenCommitments={vi.fn()} />);

        expect(screen.getByText(/you have no commitments yet/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create a commitment/i })).toBeInTheDocument();
    });

    it('surfaces work carried over from an earlier day', () => {
        render(
            <FabricTodayCard
                todayStats={stats({ totalTasks: 3, completedTasks: 0, pendingTasks: 3, overdueTasks: 2 })}
                onOpenCommitments={vi.fn()}
            />,
        );

        expect(screen.getByText(/2 carried over from earlier/i)).toBeInTheDocument();
        expect(screen.getByText(/0 of 3 done/i)).toBeInTheDocument();
    });
});
