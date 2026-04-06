import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionQuickEntry } from './TransactionQuickEntry';

describe('TransactionQuickEntry', () => {
  it('renders the text input', () => {
    render(<TransactionQuickEntry onParsed={vi.fn()} />);
    expect(screen.getByTestId('quick-entry-input')).toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    render(<TransactionQuickEntry onParsed={vi.fn()} />);
    const input = screen.getByTestId('quick-entry-input');
    expect(input).toHaveAttribute('placeholder');
  });

  it('calls onParsed with parsed data on submit', () => {
    const onParsed = vi.fn();
    render(<TransactionQuickEntry onParsed={onParsed} />);
    const input = screen.getByTestId('quick-entry-input');
    fireEvent.change(input, { target: { value: 'Spent $50 on groceries' } });
    fireEvent.submit(input.closest('form')!);
    expect(onParsed).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 50, category: 'Groceries' })
    );
  });

  it('does not call onParsed when input is empty', () => {
    const onParsed = vi.fn();
    render(<TransactionQuickEntry onParsed={onParsed} />);
    const form = screen.getByTestId('quick-entry-input').closest('form')!;
    fireEvent.submit(form);
    expect(onParsed).not.toHaveBeenCalled();
  });

  it('clears input after successful submit', () => {
    render(<TransactionQuickEntry onParsed={vi.fn()} />);
    const input = screen.getByTestId('quick-entry-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '500 groceries' } });
    fireEvent.submit(input.closest('form')!);
    expect(input.value).toBe('');
  });

  it('shows parsed preview while typing', () => {
    render(<TransactionQuickEntry onParsed={vi.fn()} />);
    const input = screen.getByTestId('quick-entry-input');
    fireEvent.change(input, { target: { value: '$50 groceries' } });
    expect(screen.getByTestId('quick-entry-preview')).toBeInTheDocument();
  });
});
