/**
 * SocialSignInButtons — BUG-109
 *
 * Tests: Apple icon renders correct SVG, Google icon renders, buttons are accessible.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialSignInButtons } from './SocialSignInButtons';

const noop = vi.fn();

describe('SocialSignInButtons', () => {
    it('renders Google button with accessible label', () => {
        render(<SocialSignInButtons onGoogle={noop} onApple={noop} loading={false} error={null} />);
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('renders Apple button with accessible label', () => {
        render(<SocialSignInButtons onGoogle={noop} onApple={noop} loading={false} error={null} />);
        expect(screen.getByRole('button', { name: /sign in with apple/i })).toBeInTheDocument();
    });

    it('Apple button contains an SVG element (not a generic icon)', () => {
        const { container } = render(
            <SocialSignInButtons onGoogle={noop} onApple={noop} loading={false} error={null} />
        );
        const appleBtn = screen.getByRole('button', { name: /sign in with apple/i });
        const svg = appleBtn.querySelector('svg');
        expect(svg).not.toBeNull();
        // BUG-109: viewBox must be square (0 0 N N) for a crisp Apple logo, not tall/distorted
        const viewBox = svg!.getAttribute('viewBox');
        expect(viewBox).toBeTruthy();
        const parts = viewBox!.split(' ').map(Number);
        // width and height of the viewBox should be equal (square logo)
        expect(parts[2]).toBe(parts[3]);
    });

    it('disables both buttons when loading', () => {
        render(<SocialSignInButtons onGoogle={noop} onApple={noop} loading={true} error={null} />);
        screen.getAllByRole('button').forEach(btn => expect(btn).toBeDisabled());
    });

    it('shows error message when error is set', () => {
        render(<SocialSignInButtons onGoogle={noop} onApple={noop} loading={false} error="Sign-in failed" />);
        expect(screen.getByText('Sign-in failed')).toBeInTheDocument();
    });
});
