/**
 * RA-12 (#168): dashboard goal card — empty state, populated rendering and
 * the read-only progress calculation.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoalProgressCard, getGoalProgressPercent } from './GoalProgressCard';
import type { AnchorGoal } from '../../../types';

const goal = (overrides: Partial<AnchorGoal> = {}): AnchorGoal => ({
    id: 'goal-1',
    title: 'Rainy Day Fund',
    targetAmountCents: 500_000,
    currentAmountCents: 125_000,
    currency: 'USD',
    goalType: 'emergency_fund',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
});

describe('GoalProgressCard', () => {
    it('renders an empty state when no goals exist', () => {
        render(<GoalProgressCard goals={[]} />);

        expect(screen.getByTestId('goal-empty-state')).toBeInTheDocument();
        expect(screen.getByText('No goal set yet')).toBeInTheDocument();
    });

    it('does not promise an action it cannot offer (DB-05)', () => {
        render(<GoalProgressCard goals={[]} />);

        // The old copy instructed "Set one during onboarding to track it here."
        // while offering no control — a dead end. Goals can only be created in
        // onboarding today, so the shared empty state states the fact instead of
        // naming an action that does not exist.
        expect(screen.queryByText(/set one during onboarding/i)).not.toBeInTheDocument();
        expect(screen.getByText(/goals are created during onboarding/i)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders loading state before goals resolve', () => {
        render(<GoalProgressCard goals={[]} isLoading />);

        expect(screen.getByText('Loading goals…')).toBeInTheDocument();
        expect(screen.queryByTestId('goal-empty-state')).not.toBeInTheDocument();
    });

    it('renders title, type, target and read-only progress for a saved goal', () => {
        render(<GoalProgressCard goals={[goal()]} />);

        expect(screen.getByText('Rainy Day Fund')).toBeInTheDocument();
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
        expect(screen.getByText('$5,000.00')).toBeInTheDocument();

        const bar = screen.getByRole('progressbar', { name: 'Rainy Day Fund progress' });
        expect(bar).toHaveAttribute('aria-valuenow', '25');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
    });

    it('renders every goal when more than one is saved', () => {
        render(<GoalProgressCard goals={[
            goal({ id: 'a', title: 'Rainy Day Fund' }),
            goal({ id: 'b', title: 'Vacation', goalType: 'savings' }),
        ]} />);

        expect(screen.getByTestId('goal-a')).toBeInTheDocument();
        expect(screen.getByTestId('goal-b')).toBeInTheDocument();
        expect(screen.getByText('Vacation')).toBeInTheDocument();
        expect(screen.getByText('Savings')).toBeInTheDocument();
    });

    describe('getGoalProgressPercent', () => {
        it('computes a clamped percentage', () => {
            expect(getGoalProgressPercent(goal({ currentAmountCents: 125_000, targetAmountCents: 500_000 }))).toBe(25);
            expect(getGoalProgressPercent(goal({ currentAmountCents: 600_000, targetAmountCents: 500_000 }))).toBe(100);
            expect(getGoalProgressPercent(goal({ currentAmountCents: 0, targetAmountCents: 500_000 }))).toBe(0);
        });

        it('returns 0 for a non-positive target instead of dividing by zero', () => {
            expect(getGoalProgressPercent(goal({ targetAmountCents: 0 }))).toBe(0);
            expect(getGoalProgressPercent(goal({ targetAmountCents: -1 }))).toBe(0);
        });
    });
});
