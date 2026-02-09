import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('../../../components/shared/Modal', () => ({
  Modal: ({ isOpen, children, title }: any) => isOpen ? <div data-testid="modal"><h3>{title}</h3>{children}</div> : null,
}));
vi.mock('../../../components/shared/ConfirmationModal', () => ({
  ConfirmationModal: ({ isOpen, message }: any) => isOpen ? <div data-testid="confirm">{message}</div> : null,
}));
vi.mock('../../../components/shared/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: any) => <>{children}</>,
}));
vi.mock('../AccountDetailsView', () => ({
  AccountDetailsView: ({ account, onBack }: any) => <div data-testid="details"><span>{account.name}</span><button onClick={onBack}>Back</button></div>,
}));
vi.mock('../TransactionForm', () => ({
  TransactionForm: () => <div data-testid="tx-form" />,
}));

import { AccountDetailsContainer } from './AccountDetailsContainer';

const baseAccount = { id: 'a1', name: 'Checking', type: 'checking' as const, balanceCents: 10000, currency: 'NGN' as const, isArchived: false, scope: 'personal' as const };
const noop = vi.fn();

describe('AccountDetailsContainer', () => {
  it('renders AccountDetailsView', () => {
    render(
      <AccountDetailsContainer
        account={baseAccount as any}
        mode="view"
        initialTransactionType="expense"
        accountToDelete={null}
        accountToUnshare={null}
        onBack={noop} onShare={noop} onTransfer={noop} onPayBill={noop}
        onEdit={noop} onDelete={noop} onCloseForm={noop} onDeleteAccount={noop}
        setAccountToDelete={noop} onUnshareAccount={noop} setAccountToUnshare={noop}
      />,
    );
    expect(screen.getByTestId('details')).toBeInTheDocument();
    expect(screen.getByText('Checking')).toBeInTheDocument();
  });

  it('shows TransactionForm modal in addTx mode', () => {
    render(
      <AccountDetailsContainer
        account={baseAccount as any}
        mode="addTx"
        initialTransactionType="expense"
        accountToDelete={null}
        accountToUnshare={null}
        onBack={noop} onShare={noop} onTransfer={noop} onPayBill={noop}
        onEdit={noop} onDelete={noop} onCloseForm={noop} onDeleteAccount={noop}
        setAccountToDelete={noop} onUnshareAccount={noop} setAccountToUnshare={noop}
      />,
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('tx-form')).toBeInTheDocument();
  });

  it('shows delete confirmation when accountToDelete is set', () => {
    render(
      <AccountDetailsContainer
        account={baseAccount as any}
        mode="view"
        initialTransactionType="expense"
        accountToDelete={baseAccount as any}
        accountToUnshare={null}
        onBack={noop} onShare={noop} onTransfer={noop} onPayBill={noop}
        onEdit={noop} onDelete={noop} onCloseForm={noop} onDeleteAccount={noop}
        setAccountToDelete={noop} onUnshareAccount={noop} setAccountToUnshare={noop}
      />,
    );
    expect(screen.getByTestId('confirm')).toBeInTheDocument();
    expect(screen.getByText(/delete "checking"/i)).toBeInTheDocument();
  });

  it('shows unshare confirmation when accountToUnshare is set', () => {
    render(
      <AccountDetailsContainer
        account={baseAccount as any}
        mode="view"
        initialTransactionType="expense"
        accountToDelete={null}
        accountToUnshare={baseAccount as any}
        familyMemberName="Sarah"
        onBack={noop} onShare={noop} onTransfer={noop} onPayBill={noop}
        onEdit={noop} onDelete={noop} onCloseForm={noop} onDeleteAccount={noop}
        setAccountToDelete={noop} onUnshareAccount={noop} setAccountToUnshare={noop}
      />,
    );
    const confirms = screen.getAllByTestId('confirm');
    const unshareConfirm = confirms.find(el => el.textContent?.includes('Sarah'));
    expect(unshareConfirm).toBeTruthy();
  });
});
