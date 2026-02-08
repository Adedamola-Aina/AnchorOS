import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen', () => {
    it('renders with default props', () => {
        render(<LoadingScreen />);
        // It should render one of the SVGs. 
        // We can check if it renders *something* that looks like our variants.
        // Since it's random, we can't be sure which one, but we can check if it renders without crashing.
    });

    it('renders specific variant when provided', () => {
        const { container } = render(<LoadingScreen variant="anchor" />);
        // Anchor variant has a circle bobbing
        const anchorAnimation = container.querySelector('[style*="anchor-bob"]');
        expect(anchorAnimation).toBeInTheDocument();
    });

    it('renders helm variant', () => {
        const { container } = render(<LoadingScreen variant="helm" />);
        const helmAnimation = container.querySelector('[style*="spin-slow"]');
        expect(helmAnimation).toBeInTheDocument();
    });

    it('renders text when provided', () => {
        render(<LoadingScreen text="Loading data..." />);
        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('renders full screen overlay when fullScreen is true', () => {
        const { container } = render(<LoadingScreen fullScreen text="Full Screen" />);
        // Check for fixed overlay class
        const overlay = container.querySelector('.fixed.inset-0');
        expect(overlay).toBeInTheDocument();
        expect(screen.getByText('Full Screen')).toBeInTheDocument();
    });
});
