// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundView from './NotFoundView';

describe('NotFoundView', () => {
  it('renders 404 title and message', () => {
    render(
      <MemoryRouter>
        <NotFoundView />
      </MemoryRouter>
    );

    expect(screen.getByText('Error 404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders dashboard link', () => {
    render(
      <MemoryRouter>
        <NotFoundView />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Back to dashboard/i });
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
