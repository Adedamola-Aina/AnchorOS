// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CommitmentsEmptyState, CommitmentsViewSwitcher } from './CommitmentsViewParts';

describe('CommitmentsEmptyState', () => {
  const defaults = { filter: 'all', hasFamilyActive: false, onCreateFirst: vi.fn(), onLearnMore: vi.fn() };

  it('renders welcome message for all filter', () => {
    render(<CommitmentsEmptyState {...defaults} />);
    expect(screen.getByText('Welcome to your Commitments')).toBeInTheDocument();
    expect(screen.getByText(/build consistency/i)).toBeInTheDocument();
  });

  it('renders filter-specific message', () => {
    render(<CommitmentsEmptyState {...defaults} filter="daily" />);
    expect(screen.getByText('No daily commitments')).toBeInTheDocument();
  });

  it('shows family message when family active', () => {
    render(<CommitmentsEmptyState {...defaults} hasFamilyActive />);
    expect(screen.getByText(/you and your family/i)).toBeInTheDocument();
  });

  it('calls onCreateFirst', () => {
    render(<CommitmentsEmptyState {...defaults} />);
    fireEvent.click(screen.getByText('Create First Commitment'));
    expect(defaults.onCreateFirst).toHaveBeenCalled();
  });
});

describe('CommitmentsViewSwitcher', () => {
  const defaults = { viewMode: 'list', onViewChange: vi.fn() };

  it('shows a visible text label for every view instead of icon-only controls', () => {
    render(<CommitmentsViewSwitcher {...defaults} />);
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
  });

  it('exposes the selected view to assistive tech via aria-pressed (UX-CM-11)', () => {
    render(<CommitmentsViewSwitcher {...defaults} />);
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Timeline' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes the view when a labelled control is activated', () => {
    const props = { viewMode: 'list', onViewChange: vi.fn() };
    render(<CommitmentsViewSwitcher {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Week' }));
    expect(props.onViewChange).toHaveBeenCalledWith('calendar');
  });

  /**
   * The two filter bars that used to share this row are deliberately gone: six
   * smart views restating what the rows already say, and five cadence chips that
   * asked the user to filter their day by how a commitment is *stored*.
   */
  it('renders no cadence filter and no smart views', () => {
    render(<CommitmentsViewSwitcher {...defaults} />);
    for (const label of ['All', 'Daily', 'Weekly', 'Monthly', 'One-off', 'Show', 'Show me']) {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    }
    expect(screen.queryByRole('group', { name: /show/i })).not.toBeInTheDocument();
  });
});
