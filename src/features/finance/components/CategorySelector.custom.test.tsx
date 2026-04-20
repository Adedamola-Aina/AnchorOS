// @ts-nocheck
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategorySelector } from './CategorySelector';

vi.mock('../../../components/shared', () => ({
  CategoryIcon: ({ category }: any) => <div data-testid="category-icon">{category}</div>,
  PopoverMenu: ({ items, value, onChange, testId }: any) => (
    <select data-testid={testId} value={value} onChange={(e: any) => onChange(e.target.value)}>
      {items.map((item: any) => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select>
  ),
}));

describe('CategorySelector — custom categories', () => {
  const base = {
    category: 'Food',
    onChange: vi.fn(),
    suggestedCategory: null,
    onAcceptSuggestion: vi.fn(),
  };

  it('does not show custom-category button when onCreateCustom is absent', () => {
    render(<CategorySelector {...base} />);
    expect(screen.queryByTestId('create-custom-category-btn')).toBeNull();
  });

  it('reveals an input when the custom-category button is clicked and cancels back', () => {
    render(<CategorySelector {...base} onCreateCustom={vi.fn()} />);
    fireEvent.click(screen.getByTestId('create-custom-category-btn'));
    expect(screen.getByTestId('custom-category-input')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByTestId('custom-category-input')).toBeNull();
  });

  it('creates a custom category via Add button and selects it', () => {
    const onCreateCustom = vi.fn();
    const onChange = vi.fn();
    render(<CategorySelector {...base} onChange={onChange} onCreateCustom={onCreateCustom} />);

    fireEvent.click(screen.getByTestId('create-custom-category-btn'));
    const input = screen.getByPlaceholderText('Category name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Pets' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onCreateCustom).toHaveBeenCalledWith('Pets');
    expect(onChange).toHaveBeenCalledWith('Pets');
    expect(screen.queryByTestId('custom-category-input')).toBeNull();
  });

  it('submits on Enter key press', () => {
    const onCreateCustom = vi.fn();
    render(<CategorySelector {...base} onCreateCustom={onCreateCustom} />);
    fireEvent.click(screen.getByTestId('create-custom-category-btn'));
    const input = screen.getByPlaceholderText('Category name');
    fireEvent.change(input, { target: { value: 'Hobby' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCreateCustom).toHaveBeenCalledWith('Hobby');
  });

  it('ignores empty submissions', () => {
    const onCreateCustom = vi.fn();
    render(<CategorySelector {...base} onCreateCustom={onCreateCustom} />);
    fireEvent.click(screen.getByTestId('create-custom-category-btn'));
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onCreateCustom).not.toHaveBeenCalled();
  });

  it('includes customCategories in the options list', () => {
    render(
      <CategorySelector
        {...base}
        customCategories={['Donations', 'Gifts']}
        onCreateCustom={vi.fn()}
      />,
    );
    const select = screen.getByTestId('tx-category') as HTMLSelectElement;
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain('Donations');
    expect(values).toContain('Gifts');
  });
});
