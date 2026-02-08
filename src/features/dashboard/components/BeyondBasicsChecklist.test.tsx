/**
 * BeyondBasicsChecklist tests — TDD
 * Updated: items are now clickable with deep-link routes
 * Updated: secure_account split into verify_email + enable_mfa (6 items)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BeyondBasicsChecklist } from './BeyondBasicsChecklist';
import type { BeyondBasicsItemState } from '../hooks/useBeyondBasics';

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon" />,
  CheckCircle2: () => <span data-testid="check-icon" />,
  Circle: () => <span data-testid="circle-icon" />,
  ChevronRight: () => <span data-testid="chevron-icon" />,
}));

const mockItems: BeyondBasicsItemState[] = [
  { id: 'explore_finance', label: 'Explore Finance', description: 'Add a transaction', completed: true, route: { tab: 'finance', params: { action: 'add-transaction' } } },
  { id: 'recurring_commitment', label: 'Set a Recurring Commitment', description: 'Try weekly', completed: false, route: { tab: 'commitments', params: { action: 'add-recurring' } } },
  { id: 'review_dashboard', label: 'Review Your Dashboard', description: 'Visit dashboard', completed: false, route: { tab: 'dashboard' } },
  { id: 'customize_settings', label: 'Customize Settings', description: 'Make it yours', completed: false, route: { tab: 'settings', params: { section: 'appearance' } } },
  { id: 'verify_email', label: 'Verify Your Email', description: 'Confirm email', completed: false, route: { tab: 'settings', params: { section: 'security' } } },
  { id: 'enable_mfa', label: 'Enable Two-Factor Auth', description: 'Add 2FA', completed: false, route: { tab: 'settings', params: { section: 'security' } } },
];

describe('BeyondBasicsChecklist', () => {
  const defaultProps = {
    items: mockItems,
    completedCount: 1,
    totalCount: 6,
    isOpen: true,
    onClose: vi.fn(),
    onItemClick: vi.fn(),
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
    expect(screen.getByText('1 of 6 explored')).toBeInTheDocument();
  });

  it('renders all 6 checklist items', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    expect(screen.getByTestId('checklist-item-explore_finance')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-item-recurring_commitment')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-item-verify_email')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-item-enable_mfa')).toBeInTheDocument();
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
    expect(screen.getByText("Tap any item to get started, or they'll complete automatically.")).toBeInTheDocument();
  });

  it('calls onItemClick when an incomplete item is clicked', () => {
    const onItemClick = vi.fn();
    render(<BeyondBasicsChecklist {...defaultProps} onItemClick={onItemClick} />);
    fireEvent.click(screen.getByTestId('checklist-item-recurring_commitment'));
    expect(onItemClick).toHaveBeenCalledWith(mockItems[1]);
  });

  it('does not call onItemClick when a completed item is clicked', () => {
    const onItemClick = vi.fn();
    render(<BeyondBasicsChecklist {...defaultProps} onItemClick={onItemClick} />);
    fireEvent.click(screen.getByTestId('checklist-item-explore_finance'));
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('shows chevron icon on incomplete items', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    const incompleteItem = screen.getByTestId('checklist-item-recurring_commitment');
    expect(incompleteItem.querySelector('[data-testid="chevron-icon"]')).toBeInTheDocument();
  });

  it('does not show chevron icon on completed items', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    const completedItem = screen.getByTestId('checklist-item-explore_finance');
    expect(completedItem.querySelector('[data-testid="chevron-icon"]')).not.toBeInTheDocument();
  });

  it('verify_email and enable_mfa are separate items', () => {
    render(<BeyondBasicsChecklist {...defaultProps} />);
    expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
    expect(screen.getByText('Enable Two-Factor Auth')).toBeInTheDocument();
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
