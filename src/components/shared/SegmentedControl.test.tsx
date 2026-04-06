import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'personal', label: 'Personal' },
  { value: 'family', label: 'Family' },
];

describe('SegmentedControl', () => {
  it('renders all options', () => {
    render(<SegmentedControl options={options} value="personal" onChange={() => {}} />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('marks selected option as checked', () => {
    render(<SegmentedControl options={options} value="family" onChange={() => {}} />);
    const selected = screen.getByRole('radio', { checked: true });
    expect(selected).toHaveTextContent('Family');
  });

  it('calls onChange on click', () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={options} value="personal" onChange={onChange} />);
    fireEvent.click(screen.getByText('Family'));
    expect(onChange).toHaveBeenCalledWith('family');
  });

  it('renders label when provided', () => {
    render(<SegmentedControl options={options} value="personal" onChange={() => {}} label="Scope" />);
    expect(screen.getByText('Scope')).toBeInTheDocument();
  });

  it('supports 3 options', () => {
    const triOptions = [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ];
    render(<SegmentedControl options={triOptions} value="monthly" onChange={() => {}} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { checked: true })).toHaveTextContent('Monthly');
  });

  it('applies selected styling to active option', () => {
    render(<SegmentedControl options={options} value="personal" onChange={() => {}} />);
    const selected = screen.getByRole('radio', { checked: true });
    expect(selected.className).toContain('bg-white');
  });

  it('supports custom testId', () => {
    render(<SegmentedControl options={options} value="personal" onChange={() => {}} testId="scope-control" />);
    expect(screen.getByTestId('scope-control')).toBeInTheDocument();
  });
});
