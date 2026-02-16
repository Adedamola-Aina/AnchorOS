// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonListItem, 
  SkeletonDashboard,
  SkeletonFinance,
  SkeletonCommitments,
  SkeletonSettings
} from './Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('animate-pulse', 'rounded');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies variant classes', () => {
    const { rerender, container } = render(<Skeleton variant="circular" />);
    expect(container.firstChild).toHaveClass('rounded-full');

    rerender(<Skeleton variant="rectangular" />);
    expect(container.firstChild).toHaveClass('rounded-none');

    rerender(<Skeleton variant="rounded" />);
    expect(container.firstChild).toHaveClass('rounded-xl');
  });

  it('applies width and height classes', () => {
    const { container } = render(<Skeleton width="w-24" height="h-4" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('w-24', 'h-4');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonCard', () => {
  it('renders card structure', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toHaveClass('rounded-2xl', 'bg-white');
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});

describe('SkeletonListItem', () => {
  it('renders without avatar by default', () => {
    const { container } = render(<SkeletonListItem />);
    expect(container.querySelectorAll('.rounded-full')).toHaveLength(0);
  });

  it('renders with avatar when specified', () => {
    const { container } = render(<SkeletonListItem hasAvatar />);
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });
});

describe('SkeletonDashboard', () => {
  it('renders dashboard skeleton layout', () => {
    const { container } = render(<SkeletonDashboard />);
    expect(container.querySelector('.animate-in')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(5);
  });
});

describe('SkeletonFinance', () => {
  it('renders finance skeleton layout', () => {
    const { container } = render(<SkeletonFinance />);
    expect(container.querySelector('.animate-in')).toBeInTheDocument();
  });
});

describe('SkeletonCommitments', () => {
  it('renders commitments skeleton layout', () => {
    const { container } = render(<SkeletonCommitments />);
    expect(container.querySelector('.animate-in')).toBeInTheDocument();
  });
});

describe('SkeletonSettings', () => {
  it('renders settings skeleton layout', () => {
    const { container } = render(<SkeletonSettings />);
    expect(container.querySelector('.animate-in')).toBeInTheDocument();
  });
});
