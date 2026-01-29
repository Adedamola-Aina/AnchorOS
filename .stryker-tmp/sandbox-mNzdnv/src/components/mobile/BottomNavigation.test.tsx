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
            renderWithRouter(<BottomNavigation accountNotifications={[]} />);

            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.getByText('Tasks')).toBeInTheDocument();
            expect(screen.getByText('Finance')).toBeInTheDocument();
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });

        it('renders navigation links with correct hrefs', () => {
            renderWithRouter(<BottomNavigation accountNotifications={[]} />);

            expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/dashboard');
            expect(screen.getByRole('link', { name: /tasks/i })).toHaveAttribute('href', '/commitments');
            expect(screen.getByRole('link', { name: /finance/i })).toHaveAttribute('href', '/finance');
            expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
        });

        it('has correct aria-label for accessibility', () => {
            renderWithRouter(<BottomNavigation accountNotifications={[]} />);

            expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument();
        });

        it('has md:hidden class for responsive visibility', () => {
            renderWithRouter(<BottomNavigation accountNotifications={[]} />);

            const nav = screen.getByRole('navigation');
            expect(nav.className).toContain('md:hidden');
        });
    });

    describe('notification badge', () => {
        it('shows notification badge on Settings when accountNotifications has items', () => {
            const { container } = renderWithRouter(
                <BottomNavigation accountNotifications={['account-1', 'account-2']} />
            );

            const notificationDot = container.querySelector('.bg-red-500.rounded-full.animate-pulse');
            expect(notificationDot).toBeInTheDocument();
        });

        it('hides notification badge when accountNotifications is empty', () => {
            const { container } = renderWithRouter(
                <BottomNavigation accountNotifications={[]} />
            );

            const notificationDot = container.querySelector('.bg-red-500.rounded-full.animate-pulse');
            expect(notificationDot).not.toBeInTheDocument();
        });
    });

    describe('touch targets', () => {
        it('has minimum 44px height for touch targets (Apple HIG / WCAG 2.5.5)', () => {
            renderWithRouter(<BottomNavigation accountNotifications={[]} />);

            const links = screen.getAllByRole('link');
            links.forEach(link => {
                expect(link.className).toContain('min-h-[44px]');
            });
        });
    });

    describe('active state', () => {
        it('applies active styling when on dashboard route', () => {
            renderWithRouter(<BottomNavigation accountNotifications={[]} />, { route: '/dashboard' });

            const homeLink = screen.getByRole('link', { name: /home/i });
            expect(homeLink.className).toContain('text-primary-600');
        });

        it('applies active styling when on commitments route', () => {
            renderWithRouter(<BottomNavigation accountNotifications={[]} />, { route: '/commitments' });

            const tasksLink = screen.getByRole('link', { name: /tasks/i });
            expect(tasksLink.className).toContain('text-primary-600');
        });

        it('applies inactive styling to non-active links', () => {
            renderWithRouter(<BottomNavigation accountNotifications={[]} />, { route: '/dashboard' });

            const financeLink = screen.getByRole('link', { name: /finance/i });
            expect(financeLink.className).toContain('text-slate-400');
        });
    });
});
