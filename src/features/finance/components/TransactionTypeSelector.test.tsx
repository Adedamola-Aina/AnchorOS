import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TransactionTypeSelector } from './TransactionTypeSelector';

describe('TransactionTypeSelector', () => {
  it('renders all three types', () => {
    render(<TransactionTypeSelector type="expense" onChange={vi.fn()} />);
    expect(screen.getByText('Expense')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Transfer')).toBeInTheDocument();
  });

  it('selects expense type', () => {
    const onChange = vi.fn();
    render(<TransactionTypeSelector type="income" onChange={onChange} />);
    fireEvent.click(screen.getByText('Expense'));
    expect(onChange).toHaveBeenCalledWith('expense');
  });

  it('selects income type', () => {
    const onChange = vi.fn();
    render(<TransactionTypeSelector type="expense" onChange={onChange} />);
    fireEvent.click(screen.getByText('Income'));
    expect(onChange).toHaveBeenCalledWith('income');
  });

  it('selects transfer type', () => {
    const onChange = vi.fn();
    render(<TransactionTypeSelector type="expense" onChange={onChange} />);
    fireEvent.click(screen.getByText('Transfer'));
    expect(onChange).toHaveBeenCalledWith('transfer');
  });
});
