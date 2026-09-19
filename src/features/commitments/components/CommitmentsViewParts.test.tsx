// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CommitmentsEmptyState, CommitmentsFilterBar } from './CommitmentsViewParts';

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

describe('CommitmentsFilterBar', () => {
  const defaults = { filter: 'all', viewMode: 'list', onFilterChange: vi.fn(), onViewChange: vi.fn() };

  it('renders all filter buttons', () => {
    render(<CommitmentsFilterBar {...defaults} />);
    expect(screen.getByText('all')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
    expect(screen.getByText('weekly')).toBeInTheDocument();
    expect(screen.getByText('monthly')).toBeInTheDocument();
    expect(screen.getByText('todo')).toBeInTheDocument();
  });

  it('switches view mode', () => {
    render(<CommitmentsFilterBar {...defaults} />);
    fireEvent.click(screen.getByRole('button', { name: 'Week' }));
    expect(defaults.onViewChange).toHaveBeenCalledWith('calendar');
  });

  it('changes filter', () => {
    render(<CommitmentsFilterBar {...defaults} />);
    fireEvent.click(screen.getByText('daily'));
    expect(defaults.onFilterChange).toHaveBeenCalledWith('daily');
  });
});

describe('CommitmentsFilterBar — labelled, stateful view switcher (UX-CM-11)', () => {
  const props = { filter: 'all', viewMode: 'list', onFilterChange: vi.fn(), onViewChange: vi.fn() };

  it('shows a visible text label for every view instead of icon-only controls', () => {
    render(<CommitmentsFilterBar {...props} />);
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
  });

  it('exposes the selected view to assistive tech via aria-pressed', () => {
    render(<CommitmentsFilterBar {...props} />);
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Timeline' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes the view when a labelled control is activated', () => {
    render(<CommitmentsFilterBar {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Week' }));
    expect(props.onViewChange).toHaveBeenCalledWith('calendar');
  });
});
