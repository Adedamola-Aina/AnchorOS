
// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

const renderWithRouter = (ui: React.ReactElement, { route = '/dashboard' } = {}) =>
    render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);

describe('BottomNavigation', () => {
    describe('rendering', () => {
        it('renders Home, Commitments, Finance, and Settings tabs (UX-GL-03)', () => {
            renderWithRouter(<BottomNavigation />);
            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.getByText('Commitments')).toBeInTheDocument();
            expect(screen.getByText('Finance')).toBeInTheDocument();
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });

        it('reserves the safe area in one place and can move out of the way (UX-GL-04)', () => {
            const { rerender } = renderWithRouter(<BottomNavigation />);
            const nav = screen.getByRole('navigation', { name: /mobile navigation/i });
            // Height comes from the shared custom property, so the bar, the content
            // reserve and the FAB cannot drift apart.
            expect(nav).toHaveStyle({ height: 'var(--bottom-nav-height, calc(49px + env(safe-area-inset-bottom, 0px)))' });
            expect(nav).toHaveAttribute('data-nav-hidden', 'false');
            expect(nav.className).toContain('translate-y-0');

            // Scrolling down moves it away, and the links stay in the a11y tree.
            rerender(<MemoryRouter><BottomNavigation hidden /></MemoryRouter>);
            const hiddenNav = screen.getByRole('navigation', { name: /mobile navigation/i });
            expect(hiddenNav).toHaveAttribute('data-nav-hidden', 'true');
            expect(hiddenNav.className).toContain('translate-y-full');
            expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        });

        it('never renders an Anchor tab — the bar stays at four items (UX-AI-09)', () => {
            renderWithRouter(<BottomNavigation hasUnreadInsight />);
            expect(screen.queryByRole('link', { name: /^anchor/i })).not.toBeInTheDocument();
            expect(screen.queryByText('Tasks')).not.toBeInTheDocument();
        });

        it('renders correct hrefs for each tab', () => {
            renderWithRouter(<BottomNavigation />);
            expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/dashboard');
            expect(screen.getByRole('link', { name: /commitments/i })).toHaveAttribute('href', '/commitments');
            expect(screen.getByRole('link', { name: /finance/i })).toHaveAttribute('href', '/finance');
            expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
        });

        it('has correct aria-label for accessibility', () => {
            renderWithRouter(<BottomNavigation />);
            expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument();
        });

        it('has md:hidden class for responsive visibility', () => {
            renderWithRouter(<BottomNavigation />);
            expect(screen.getByRole('navigation').className).toContain('md:hidden');
        });
    });

    describe('notification badge (removed)', () => {
        it('no longer renders red notification dot', () => {
            const { container } = renderWithRouter(<BottomNavigation />);
            expect(container.querySelector('.bg-red-500.rounded-full.animate-pulse')).not.toBeInTheDocument();
        });
    });

    // ─── UX-GL-05: one low-noise dot, on Home only ──────────────────────────
    describe('nav state signalling (UX-GL-05)', () => {
        it('renders no dot when nothing is unread', () => {
            renderWithRouter(<BottomNavigation hasUnreadInsight={false} />);
            expect(screen.queryByTestId('nav-home-dot')).not.toBeInTheDocument();
        });

        it('renders the dot on Home when an insight is unread', () => {
            renderWithRouter(<BottomNavigation hasUnreadInsight />);
            expect(screen.getByTestId('nav-home-dot')).toBeInTheDocument();
        });

        it('states the state in the accessible name, not by colour alone', () => {
            renderWithRouter(<BottomNavigation hasUnreadInsight />);
            expect(screen.getByRole('link', { name: 'Home, new insight' })).toHaveAttribute('href', '/dashboard');
            // Still no numeric badge anywhere on the bar.
            expect(screen.queryByText(/\d+\s*$/, { selector: 'span' })).not.toBeInTheDocument();
        });
    });
});
