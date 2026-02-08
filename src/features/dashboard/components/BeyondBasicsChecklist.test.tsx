/**
 * BeyondBasicsChecklist tests — TDD
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BeyondBasicsChecklist } from './BeyondBasicsChecklist';
import type { BeyondBasicsItemState } from '../hooks/useBeyondBasics';

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon" />,
  CheckCircle2: () => <span data-testid="check-icon" />,
  Circle: () => <span data-testid="circle-icon" />,
}));

const mockItems: BeyondBasicsItemState[] = [
  { id: 'explore_finance', label: 'Explore Finance', description: 'Add a transaction', completed: true },
  { id: 'recurring_commitment', label: 'Set a Recurring Commitment', description: 'Try weekly', completed: false },
  { id: 'review_dashboard', label: 'Review Your Dashboard', description: 'Visit dashboard', completed: false },
  { id: 'customize_settings', label: 'Customize Settings', description: 'Make it yours', completed: false },
  { id: 'secure_account', label: 'Secure Your Account', description: 'Verify + MFA', completed: false },
];

describe('BeyondBasicsChecklist', () => {
  const defaultProps = {
    items: mockItems,
    completedCount: 1,
    totalCount: 5,
    isOpen: true,
    onClose: vi.fn(),
  };

  it('renders nothing when closed', () => {
    const { container } = render(<BeyondBasicsChecklist {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders overlay when open', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    expect(screen.getByTestId('beyond-basics-overlay')).toBeInTheDocument();
  });

  it('renders heading and progress count', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    expect(screen.getByText('Beyond the Basics')).toBeInTheDocument();
    expect(screen.getByText('1 of 5 explored')).toBeInTheDocument();
  });

  it('renders all checklist items', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    expect(screen.getByTestId('checklist-item-explore_finance')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-item-recurring_commitment')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-item-secure_account')).toBeInTheDocument();
  });

  it('shows check icon for completed items', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    const completedItem = screen.getByTestId('checklist-item-explore_finance');
    expect(completedItem.querySelector('[data-testid="check-icon"]')).toBeInTheDocument();
  });

  it('shows circle icon for incomplete items', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    const incompleteItem = screen.getByTestId('checklist-item-recurring_commitment');
    expect(incompleteItem.querySelector('[data-testid="circle-icon"]')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<BeyondBasicsChecklist {...defaultProps} onClose={onClose} />);
    const closeBtn = screen.getByLabelText('Close checklist');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn();
    render(<BeyondBasicsChecklist {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('checklist-backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders backdrop with blur effect', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    const backdrop = screen.getByTestId('checklist-backdrop');
    expect(backdrop.className).toContain('backdrop-blur-sm');
  });

  it('shows auto-complete hint text', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    expect(screen.getByText('These complete automatically as you use Anchor OS.')).toBeInTheDocument();
  });

  it('renders overlay via portal into document.body', () => {
    const { baseElement } = render(
      <div data-testid="parent-transform" style={{ transform: 'translateY(0px)' }}>
        <BeyondBasicsChecklist {...defaultProps} />
      </div>,
    );
    // The overlay should be a direct child of body, NOT inside the transformed parent
    const overlay = screen.getByTestId('beyond-basics-overlay');
    expect(overlay.parentElement).toBe(document.body);
    // The parent-transform div should NOT contain the overlay
    const transformDiv = screen.getByTestId('parent-transform');
    expect(transformDiv.contains(overlay)).toBe(false);
  });
});
