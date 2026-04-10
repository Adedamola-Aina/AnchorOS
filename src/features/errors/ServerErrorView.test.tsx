// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServerErrorView from './ServerErrorView';

describe('ServerErrorView', () => {
  it('renders 500 title and message', () => {
    render(
      <MemoryRouter>
        <ServerErrorView />
      </MemoryRouter>
    );

    expect(screen.getByText('Error 500')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByTestId('server-error-illustration')).toBeInTheDocument();
  });

  it('renders reload action button', () => {
    render(
      <MemoryRouter>
        <ServerErrorView />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Reload/i })).toBeInTheDocument();
  });

  it('renders dashboard link', () => {
    render(
      <MemoryRouter>
        <ServerErrorView />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Go to dashboard/i });
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
