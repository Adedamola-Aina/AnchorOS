import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import MarketingLanding from './MarketingLanding';

describe('MarketingLanding', () => {
  it('presents the public AnchorOS story and primary paths', () => {
    render(
      <MemoryRouter>
        <MarketingLanding />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /a private operating system for the life you're building/i,
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText(/life at a glance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/finance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/commitments/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/family/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/anchorai/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/your life data is not content/i)).toBeInTheDocument();

    expect(screen.getAllByRole('link', { name: /start with anchoros/i })[0]).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /enter app/i })).toHaveAttribute('href', '/dashboard');
  });
});
