// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { Star } from 'lucide-react';

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(<EmptyState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-illustration')).toBeInTheDocument();
  });

  it('renders preset configuration', () => {
    render(<EmptyState preset="no-tasks" />);
    expect(screen.getByText('No commitments')).toBeInTheDocument();
    expect(screen.getByText(/haven't created any commitments/)).toBeInTheDocument();
  });

  it('allows custom title and message', () => {
    render(
      <EmptyState 
        title="Custom Title" 
        message="Custom message text"
      />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message text')).toBeInTheDocument();
  });

  it('overrides preset with custom props', () => {
    render(
      <EmptyState 
        preset="no-tasks"
        title="Override Title"
      />
    );
    expect(screen.getByText('Override Title')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    const { container } = render(<EmptyState icon={Star} />);
    // Star icon should be rendered (checking SVG element exists)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const handleClick = vi.fn();
    render(
      <EmptyState 
        actionLabel="Add Item"
        onAction={handleClick}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Add Item' });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render button without both actionLabel and onAction', () => {
    const { rerender } = render(<EmptyState actionLabel="Click me" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<EmptyState onAction={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<EmptyState className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('applies custom accent color', () => {
    const { container } = render(<EmptyState accentColor="text-red-500" />);
    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });

  describe('presets', () => {
    const presetTests = [
      { preset: 'no-data', title: 'No data yet' },
      { preset: 'no-tasks', title: 'No commitments' },
      { preset: 'no-transactions', title: 'No transactions' },
      { preset: 'no-notifications', title: 'All caught up' },
      { preset: 'no-family', title: 'No family connection' },
      { preset: 'no-events', title: 'No events' },
      { preset: 'no-search-results', title: 'No results found' },
      { preset: 'no-documents', title: 'No documents' },
    ] as const;

    presetTests.forEach(({ preset, title }) => {
      it(`renders ${preset} preset correctly`, () => {
        render(<EmptyState preset={preset} />);
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });
});
