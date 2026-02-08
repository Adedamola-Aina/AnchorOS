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

  it('renders Transfer and Pay Bill', () => {
    render(<AccountActionButtons account={account} />);
    expect(screen.getByText('Transfer')).toBeInTheDocument();
    expect(screen.getByText('Pay Bill')).toBeInTheDocument();
  });

  it('shows currency symbol on Pay Bill', () => {
    render(<AccountActionButtons account={{ ...account, currency: 'USD' }} />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('calls onTransfer', () => {
    const onTransfer = vi.fn();
    render(<AccountActionButtons account={account} onTransfer={onTransfer} />);
    fireEvent.click(screen.getByText('Transfer'));
    expect(onTransfer).toHaveBeenCalled();
  });
});
