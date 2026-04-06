import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PopoverMenu } from './PopoverMenu';

const items = [
  { value: 'health', label: 'Health' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'work', label: 'Work' },
];

describe('PopoverMenu', () => {
  it('renders trigger with selected value', () => {
    render(<PopoverMenu items={items} value="health" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Health');
  });

  it('renders placeholder when no value', () => {
    render(<PopoverMenu items={items} value="" onChange={() => {}} placeholder="Choose one" />);
    expect(screen.getByRole('button')).toHaveTextContent('Choose one');
  });

  it('opens menu on trigger click', () => {
    render(<PopoverMenu items={items} value="health" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('calls onChange and closes on item select', () => {
    const onChange = vi.fn();
    render(<PopoverMenu items={items} value="health" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Fitness'));
    expect(onChange).toHaveBeenCalledWith('fitness');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows checkmark on selected item', () => {
    render(<PopoverMenu items={items} value="work" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    const selected = screen.getByRole('option', { selected: true });
    expect(selected).toHaveTextContent('Work');
  });

  it('has 44px min touch targets', () => {
    render(<PopoverMenu items={items} value="health" onChange={() => {}} />);
    const trigger = screen.getByRole('button');
    expect(trigger.className).toContain('min-h-[44px]');
  });

  it('closes on Escape key', () => {
    render(<PopoverMenu items={items} value="health" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports custom testId', () => {
    render(<PopoverMenu items={items} value="" onChange={() => {}} testId="domain-picker" />);
    expect(screen.getByTestId('domain-picker')).toBeInTheDocument();
  });

  it('renders items with icons', () => {
    const iconItems = [
      { value: 'a', label: 'Alpha', icon: <span data-testid="icon-a">A</span> },
      { value: 'b', label: 'Beta', icon: <span data-testid="icon-b">B</span> },
    ];
    render(<PopoverMenu items={iconItems} value="a" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByTestId('icon-a').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('icon-b')).toBeInTheDocument();
  });
});
