// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { EmptyAccountsState } from './EmptyAccountsState';

describe('EmptyAccountsState', () => {
  it('renders empty state message', () => {
    render(<EmptyAccountsState onCreateAccount={vi.fn()} />);
    expect(screen.getByText('No accounts yet')).toBeInTheDocument();
    expect(screen.getByText(/Tap to add your first account/i)).toBeInTheDocument();
  });

  it('calls onCreateAccount when card is clicked', () => {
    const onCreate = vi.fn();
    render(<EmptyAccountsState onCreateAccount={onCreate} />);
    fireEvent.click(screen.getByRole('button', { name: /Create your first account/i }));
    expect(onCreate).toHaveBeenCalled();
  });
});
