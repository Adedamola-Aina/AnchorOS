// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkeletonCards } from './SkeletonCards';

describe('SkeletonCards', () => {
  it('renders the specified number of skeleton cards', () => {
    const { container } = render(<SkeletonCards count={3} />);
    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards).toHaveLength(3);
  });

  it('defaults to 3 skeleton cards', () => {
    const { container } = render(<SkeletonCards />);
    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards).toHaveLength(3);
  });

  it('applies staggered animation delays', () => {
    const { container } = render(<SkeletonCards count={3} />);
    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards[0].style.animationDelay).toBe('0ms');
    expect(cards[1].style.animationDelay).toBe('120ms');
    expect(cards[2].style.animationDelay).toBe('240ms');
  });

  it('uses ISO credit card aspect ratio', () => {
    const { container } = render(<SkeletonCards count={1} />);
    const card = container.querySelector('.animate-pulse');
    expect(card?.style.aspectRatio).toContain('1.586');
  });
});
