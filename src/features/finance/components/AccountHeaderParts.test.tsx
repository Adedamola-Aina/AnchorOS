// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AccountRenameInput, AccountActionButtons } from './AccountHeaderParts';

describe('AccountRenameInput', () => {
  const defaults = {
    newName: 'Savings',
    isRenaming: false,
    onNameChange: vi.fn(),
    onConfirmRename: vi.fn(),
    onCancelRename: vi.fn(),
  };

  it('renders input with name', () => {
    render(<AccountRenameInput {...defaults} />);
    expect(screen.getByDisplayValue('Savings')).toBeInTheDocument();
  });

  it('calls save on confirm', () => {
    render(<AccountRenameInput {...defaults} />);
    fireEvent.click(screen.getByText('Save'));
    expect(defaults.onConfirmRename).toHaveBeenCalled();
  });

  it('calls cancel', () => {
    render(<AccountRenameInput {...defaults} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaults.onCancelRename).toHaveBeenCalled();
  });
});

describe('AccountActionButtons', () => {
  const account = { id: 'a1', currency: 'NGN' } as any;

  it('renders a single Record Transaction button', () => {
    render(<AccountActionButtons account={account} />);
    expect(screen.getByText('Record Transaction')).toBeInTheDocument();
  });

  it('calls onAddTransaction when clicked', () => {
    const onAdd = vi.fn();
    render(<AccountActionButtons account={account} onAddTransaction={onAdd} />);
    fireEvent.click(screen.getByText('Record Transaction'));
    expect(onAdd).toHaveBeenCalled();
  });
});
