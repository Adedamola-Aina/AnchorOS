// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CommitmentsEmptyState, CommitmentsLoadingState, CommitmentsViewSwitcher } from './CommitmentsViewParts';

describe('CommitmentsEmptyState', () => {
  const defaults = { hasFamilyActive: false, onCreateFirst: vi.fn() };

  it('names the state, explains it, and offers the one action it names', () => {
    render(<CommitmentsEmptyState {...defaults} />);
    expect(screen.getByText('No commitments yet')).toBeInTheDocument();
    expect(screen.getByText(/things you keep doing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create a commitment' })).toBeInTheDocument();
  });

  it('mentions the family when family sharing is active', () => {
    render(<CommitmentsEmptyState {...defaults} hasFamilyActive />);
    expect(screen.getByText(/you and your family/i)).toBeInTheDocument();
  });

  it('calls onCreateFirst', () => {
    render(<CommitmentsEmptyState {...defaults} />);
    fireEvent.click(screen.getByRole('button', { name: 'Create a commitment' }));
    expect(defaults.onCreateFirst).toHaveBeenCalled();
  });

  /**
   * A search with no matches used to fall through to "Welcome to your
   * Commitments" — a lie to someone with sixteen commitments who mistyped a word,
   * offering to create the first one.
   */
  it('answers a search with no matches as a search, not as an empty account', () => {
    const onClearSearch = vi.fn();
    render(<CommitmentsEmptyState {...defaults} query="gymm" onClearSearch={onClearSearch} />);

    expect(screen.getByTestId('commitments-empty-search')).toBeInTheDocument();
    expect(screen.getByText(/No matches for “gymm”/)).toBeInTheDocument();
    expect(screen.queryByText('No commitments yet')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClearSearch).toHaveBeenCalled();
  });

  /** The dead "Learn More" button (a toast that promised a future feature) is gone. */
  it('offers no action it cannot perform', () => {
    render(<CommitmentsEmptyState {...defaults} />);
    expect(screen.queryByRole('button', { name: /learn more/i })).not.toBeInTheDocument();
  });
});

describe('CommitmentsLoadingState', () => {
  it('announces that it is loading and shows placeholder rows', () => {
    render(<CommitmentsLoadingState rows={3} />);
    const region = screen.getByTestId('commitments-loading');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
    expect(screen.getByText('Loading your commitments…')).toBeInTheDocument();
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
