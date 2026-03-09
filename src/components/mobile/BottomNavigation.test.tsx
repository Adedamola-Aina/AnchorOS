/**
 * Tests for BottomNavigation component
 * 
 * Per MOBILE_OPTIMIZATION_DIRECTIVE.md M3.1 and CLAUDE.md TDD mandate
 */
// @ts-nocheck


import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

// Helper to render with router context
const renderWithRouter = (ui: React.ReactElement, { route = '/dashboard' } = {}) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>
    );
};

describe('BottomNavigation', () => {
    describe('rendering', () => {
        it('renders all four navigation items', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);

            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.getByText('Tasks')).toBeInTheDocument();
            expect(screen.getByText('Finance')).toBeInTheDocument();
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });

        it('renders navigation links with correct hrefs', () => {
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

            const nav = screen.getByRole('navigation');
            expect(nav.className).toContain('md:hidden');
        });
    });

    describe('notification badge (removed)', () => {
        it('no longer renders red notification dot (onboarding handles it)', () => {
            const { container } = renderWithRouter(
                <BottomNavigation anchorAIEnabled={false} />
            );

            const notificationDot = container.querySelector('.bg-red-500.rounded-full.animate-pulse');
            expect(notificationDot).not.toBeInTheDocument();
        });
    });

    describe('touch targets', () => {
        it('has minimum 56px height for touch targets to accommodate home indicator padding safely', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);

            const links = screen.getAllByRole('link');
            links.forEach(link => {
                expect(link.className).toContain('min-h-[56px]');
                expect(link.className).toContain('h-full');
            });
        });
    });

    describe('active state', () => {
        it('applies active styling when on dashboard route', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />, { route: '/dashboard' });

            const homeLink = screen.getByRole('link', { name: /home/i });
            expect(homeLink.className).toContain('text-primary-600');
        });

        it('applies active styling when on commitments route', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />, { route: '/commitments' });

            const tasksLink = screen.getByRole('link', { name: /tasks/i });
            expect(tasksLink.className).toContain('text-primary-600');
        });

        it('applies inactive styling to non-active links', () => {
            renderWithRouter(<BottomNavigation anchorAIEnabled={false} />, { route: '/dashboard' });

            const financeLink = screen.getByRole('link', { name: /finance/i });
            expect(financeLink.className).toContain('text-slate-400');
        });

        it('renders five-tab layout with anchor ai center icon when enabled', () => {
            const { container } = renderWithRouter(<BottomNavigation anchorAIEnabled={true} />);

            expect(screen.getByRole('link', { name: /anchor ai/i })).toHaveAttribute('href', '/fabric');
            expect(container.querySelector('.grid-cols-5')).toBeInTheDocument();
        });

        it('renders four-tab layout without anchor ai when disabled', () => {
            const { container } = renderWithRouter(<BottomNavigation anchorAIEnabled={false} />);

            expect(screen.queryByRole('link', { name: /anchor ai/i })).not.toBeInTheDocument();
            expect(container.querySelector('.grid-cols-4')).toBeInTheDocument();
        });
    });
});
