import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Skeleton,
  TransactionSkeleton,
  AccountSkeleton,
  CommitmentSkeleton,
  DashboardWidgetSkeleton,
  ListSkeleton,
} from './Skeleton';

describe('Skeleton', () => {
  it('renders with default class', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('animate-pulse');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('accepts custom className', () => {
    const { container } = render(<Skeleton className="w-32 h-4" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('w-32');
    expect(el).toHaveClass('h-4');
    expect(el).toHaveClass('animate-pulse');
  });
});

describe('TransactionSkeleton', () => {
  it('renders skeleton placeholders for a transaction row', () => {
    const { container } = render(<TransactionSkeleton />);
    // Should contain multiple skeleton divs
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});

describe('AccountSkeleton', () => {
  it('renders skeleton placeholders for an account card', () => {
    const { container } = render(<AccountSkeleton />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});

describe('CommitmentSkeleton', () => {
  it('renders skeleton placeholders for a commitment item', () => {
    const { container } = render(<CommitmentSkeleton />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});

describe('DashboardWidgetSkeleton', () => {
  it('renders skeleton placeholders for a dashboard widget', () => {
    const { container } = render(<DashboardWidgetSkeleton />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});

describe('ListSkeleton', () => {
  it('renders default 5 transaction skeletons', () => {
    const { container } = render(<ListSkeleton />);
    // 5 items, each with multiple skeleton divs
    const items = container.querySelectorAll('.flex.items-center');
    expect(items.length).toBeGreaterThanOrEqual(5);
  });

  it('renders specified count', () => {
    const { container } = render(<ListSkeleton count={3} />);
    // Should have exactly 3 groups
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBe(3);
  });

  it('renders commitment type skeletons', () => {
    const { container } = render(<ListSkeleton count={2} type="commitment" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBe(2);
    // Commitment skeletons have rounded-full elements
    const roundedFull = container.querySelectorAll('.rounded-full');
    expect(roundedFull.length).toBeGreaterThanOrEqual(2);
  });

  it('renders account type skeletons', () => {
    const { container } = render(<ListSkeleton count={2} type="account" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBe(2);
  });
});
