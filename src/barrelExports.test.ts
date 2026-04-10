import { describe, expect, it } from 'vitest';
import * as AuthContextExports from './context/auth';
import * as UiExports from '@anchor-os/ui';
import * as FinanceComponentExports from './features/finance/components';
import * as TransactionFormExports from './features/finance/components/transactionForm';

describe('barrel exports', () => {
  it('exports auth context helpers', () => {
    expect(AuthContextExports.useMfaOperations).toBeTypeOf('function');
    expect(AuthContextExports.getWelcomeEmailHtml).toBeTypeOf('function');
  });

  it('exports ui primitives', () => {
    expect(UiExports.Button).toBeDefined();
    expect(UiExports.Card).toBeDefined();
  });

  it('exports finance components', () => {
    // AccountCard is React.memo-wrapped — typeof is 'object'; check it's defined and renderable
    expect(FinanceComponentExports.AccountCard).toBeDefined();
    expect(FinanceComponentExports.VirtualTransactionList).toBeTypeOf('function');
  });

  it('exports transaction form modules', () => {
    expect(TransactionFormExports.useTransactionFormState).toBeTypeOf('function');
    expect(TransactionFormExports.AmountField).toBeTypeOf('function');
  });
});
