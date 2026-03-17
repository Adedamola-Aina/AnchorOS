// @ts-nocheck
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategorySelector, DEFAULT_CATEGORIES } from './CategorySelector';

vi.mock('../../../components/shared', () => ({
    CategoryIcon: ({ category }: { category: string }) => <div data-testid="category-icon">{category}</div>,
}));

describe('CategorySelector', () => {
    const baseProps = {
        category: 'Food',
        onChange: vi.fn(),
        suggestedCategory: null,
        onAcceptSuggestion: vi.fn(),
        error: undefined,
    };

    it('renders default categories and selected value', () => {
        render(<CategorySelector {...baseProps} />);

        const select = screen.getByLabelText('Category') as HTMLSelectElement;
        expect(select.value).toBe('Food');
        expect(select.options).toHaveLength(DEFAULT_CATEGORIES.length);
        expect(screen.getByTestId('category-icon')).toHaveTextContent('Food');
    });

    it('calls onChange when category changes', () => {
        render(<CategorySelector {...baseProps} />);

        fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Transport' } });
        expect(baseProps.onChange).toHaveBeenCalledWith('Transport');
    });

    it('shows error styling and message when error prop is provided', () => {
        render(<CategorySelector {...baseProps} error="Category required" />);

        expect(screen.getByText('Category required')).toBeInTheDocument();
        expect(screen.getByRole('combobox').className).toContain('border-rose-500');
    });

    it('shows suggestion CTA only when suggested category differs', () => {
        const { rerender } = render(
            <CategorySelector {...baseProps} suggestedCategory="Transport" />,
        );

        expect(screen.getByRole('button', { name: /use "transport" like before/i })).toBeInTheDocument();

        rerender(
            <CategorySelector {...baseProps} suggestedCategory="Food" />,
        );

        expect(screen.queryByRole('button', { name: /use "food" like before/i })).not.toBeInTheDocument();
    });

    it('calls onAcceptSuggestion when suggestion CTA is clicked', () => {
        render(
            <CategorySelector {...baseProps} suggestedCategory="Groceries" />,
        );

        fireEvent.click(screen.getByRole('button', { name: /use "groceries" like before/i }));
        expect(baseProps.onAcceptSuggestion).toHaveBeenCalledTimes(1);
    });
});