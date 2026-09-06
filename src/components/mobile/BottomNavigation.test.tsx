// @ts-nocheck
// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

const renderWithRouter = (ui: React.ReactElement, { route = '/dashboard' } = {}) =>
    render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);

describe('BottomNavigation', () => {
    describe('rendering', () => {
        it('renders Home, Tasks, Finance, and Settings tabs without Anchor AI', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);
            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.getByText('Tasks')).toBeInTheDocument();
            expect(screen.getByText('Finance')).toBeInTheDocument();
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });

        it('renders Anchor tab when anchorAIEnabled is true', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={true} />);
            expect(screen.getByText('Anchor')).toBeInTheDocument();
        });

        it('renders correct hrefs for each tab', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);
            expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/dashboard');
            expect(screen.getByRole('link', { name: /tasks/i })).toHaveAttribute('href', '/commitments');
            expect(screen.getByRole('link', { name: /finance/i })).toHaveAttribute('href', '/finance');
            expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
        });

        it('has correct aria-label for accessibility', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);
            expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument();
        });

        it('has md:hidden class for responsive visibility', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);
            expect(screen.getByRole('navigation').className).toContain('md:hidden');
        });
    });

    describe('notification badge (removed)', () => {
        it('no longer renders red notification dot', () => {
            const { container } = renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);
            expect(container.querySelector('.bg-red-500.rounded-full.animate-pulse')).not.toBeInTheDocument();
        });
    });

    describe('active state', () => {
        it('renders fabric link when anchor AI is enabled', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={true} />);
            expect(screen.getByRole('link', { name: /anchor/i })).toHaveAttribute('href', '/fabric');
        });

        it('does not render fabric link when anchor AI is disabled', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);
            expect(screen.queryByRole('link', { name: /anchor/i })).not.toBeInTheDocument();
        });
    });
});
