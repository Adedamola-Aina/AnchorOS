import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { NoAccountsMessage, SingleAccountTransferMessage } from './TransactionFormEmptyStates';

describe('TransactionFormEmptyStates', () => {
  describe('NoAccountsMessage', () => {
    it('renders warning message', () => {
      render(<NoAccountsMessage />);
      expect(screen.getByText(/please create an account first/i)).toBeInTheDocument();
    });
  });

  describe('SingleAccountTransferMessage', () => {
    it('renders transfer explanation', () => {
      render(<SingleAccountTransferMessage onClose={vi.fn()} />);
      expect(screen.getByText(/need 2 accounts for transfers/i)).toBeInTheDocument();
      expect(screen.getByText(/transfers move money between your accounts/i)).toBeInTheDocument();
    });

    it('calls onClose when Got it clicked', async () => {
      const onClose = vi.fn();
      render(<SingleAccountTransferMessage onClose={onClose} />);
      const { fireEvent } = await import('@testing-library/react');
      fireEvent.click(screen.getByText('Got it'));
      expect(onClose).toHaveBeenCalled();
    });
  });
});
