// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnchorLoadingSpinner } from './AnchorLoadingSpinner';

describe('AnchorLoadingSpinner', () => {
    it('renders with status role for accessibility', () => {
        render(<AnchorLoadingSpinner />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with default medium size', () => {
        const { container } = render(<AnchorLoadingSpinner />);
        const wrapper = container.querySelector('[data-testid="loading-spinner"]');
        expect(wrapper).toBeInTheDocument();
    });

    it('displays optional message text', () => {
        render(<AnchorLoadingSpinner message="Loading your data..." />);
        expect(screen.getByText('Loading your data...')).toBeInTheDocument();
    });

    it('does not display message when not provided', () => {
        const { container } = render(<AnchorLoadingSpinner />);
        const message = container.querySelector('p');
        expect(message).toBeNull();
    });

    it('renders an SVG animation element', () => {
        const { container } = render(<AnchorLoadingSpinner />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('includes sr-only loading text for screen readers', () => {
        render(<AnchorLoadingSpinner />);
        expect(screen.getByText('Loading')).toHaveClass('sr-only');
    });
});
