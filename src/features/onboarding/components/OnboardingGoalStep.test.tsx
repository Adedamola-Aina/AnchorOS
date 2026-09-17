import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { OnboardingGoalStep } from './OnboardingGoalStep';

/**
 * RA-13 (#171): unparseable/zero amounts must be blocked client-side with a
 * specific message instead of failing the Firestore write with a generic toast.
 */
function Harness({ onSubmit = vi.fn() }: { onSubmit?: () => void }) {
    const [title, setTitle] = useState('Emergency Fund');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('emergency_fund');

    return (
        <OnboardingGoalStep
            goalTitle={title}
            setGoalTitle={setTitle}
            goalAmount={amount}
            setGoalAmount={setAmount}
            goalType={type}
            setGoalType={setType}
            loading={false}
            onSubmit={onSubmit}
            onSkip={vi.fn()}
            onBack={vi.fn()}
        />
    );
}

describe('OnboardingGoalStep amount validation', () => {
    it('blocks unparseable amounts and enables submit for a valid amount', async () => {
        render(<Harness />);

        const submit = screen.getByRole('button', { name: /set goal & continue/i });
        const amountInput = screen.getByPlaceholderText(/500,000/);

        expect(submit).toBeDisabled();

        await userEvent.type(amountInput, 'abc');
        expect(await screen.findByRole('alert')).toHaveTextContent(/valid amount greater than zero/i);
        expect(submit).toBeDisabled();

        await userEvent.clear(amountInput);
        await userEvent.type(amountInput, '500,000');

        expect(screen.queryByRole('alert')).toBeNull();
        expect(submit).toBeEnabled();
    });

    it('keeps submit disabled until both title and amount are present', async () => {
        render(<Harness />);

        const submit = screen.getByRole('button', { name: /set goal & continue/i });
        await userEvent.type(screen.getByPlaceholderText(/500,000/), '0');

        expect(submit).toBeDisabled();
    });
});
