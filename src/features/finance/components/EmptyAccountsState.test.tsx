// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { EmptyAccountsState } from './EmptyAccountsState';

describe('EmptyAccountsState', () => {
  it('renders empty state message', () => {
    render(<EmptyAccountsState onCreateAccount={vi.fn()} />);
    expect(screen.getByText('No accounts yet')).toBeInTheDocument();
    expect(screen.getByText(/start tracking your finances/i)).toBeInTheDocument();
  });

  it('calls onCreateAccount when button clicked', () => {
    const onCreate = vi.fn();
    render(<EmptyAccountsState onCreateAccount={onCreate} />);
    fireEvent.click(screen.getByText('Create your first account'));
    expect(onCreate).toHaveBeenCalled();
  });
});
