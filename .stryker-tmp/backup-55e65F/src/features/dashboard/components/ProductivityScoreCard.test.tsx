import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProductivityScoreCard } from './ProductivityScoreCard';

describe('ProductivityScoreCard', () => {
  it('shows empty state when no stats', () => {
    render(<ProductivityScoreCard commitmentStats={null} />);
    expect(screen.getByText('Boost Productivity')).toBeInTheDocument();
    expect(screen.getByText(/set daily or weekly/i)).toBeInTheDocument();
  });

  it('calls navigateTo on empty state CTA', () => {
    const nav = vi.fn();
    render(<ProductivityScoreCard commitmentStats={null} navigateTo={nav} />);
    fireEvent.click(screen.getByText('+ Set Commitments'));
    expect(nav).toHaveBeenCalledWith('commitments');
  });

  it('shows productivity score with stats', () => {
    const stats = {
      total: 10, completed: 7, rate: 70,
      personal: { total: 6, completed: 5, rate: 83 },
      family: { total: 4, completed: 2, rate: 50 },
    };
    render(<ProductivityScoreCard commitmentStats={stats} />);
    expect(screen.getByText(/70%/)).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('5/6')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('2/4')).toBeInTheDocument();
  });
});
