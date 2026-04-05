import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardStack } from './CardStack';
import { CARD_HEADER_REVEAL, STACK_STAGGER_MS } from './cardConstants';
import type { AnchorAccount } from '../../types';

vi.mock('./AccountCard', () => ({
  CARD_ASPECT_RATIO: 1.586,
  AccountCard: ({ account }: { account: AnchorAccount }) => (
    <div data-testid={`account-card-${account.id}`}>{account.name}</div>
  ),
}));

vi.mock('../../hooks/useCardDrag', () => ({
  useCardDrag: () => ({
    onPointerDown: vi.fn(),
    onPointerMove: vi.fn(),
    onPointerUp: vi.fn(),
  }),
}));

const accounts: AnchorAccount[] = [
  { id: 'acc-1', name: 'Primary Savings', type: 'savings', currency: 'USD', balanceCents: 120000, color: '', scope: 'personal' },
  { id: 'acc-2', name: 'Apple Cash', type: 'checking', currency: 'USD', balanceCents: 45000, color: '', scope: 'personal' },
  { id: 'acc-3', name: 'Joint Checking', type: 'checking', currency: 'USD', balanceCents: 98000, color: '', scope: 'family' },
];

beforeEach(() => {
  class ResizeObserverMock {
    callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe() {
      this.callback([
        {
          contentRect: { width: 343, height: 0, x: 0, y: 0, top: 0, left: 0, bottom: 0, right: 343, toJSON: () => ({}) },
        } as ResizeObserverEntry,
      ], this as unknown as ResizeObserver);
    }

    disconnect() {}

    unobserve() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

describe('CardStack', () => {
  it('keeps the collapsed stack tightly overlapped', () => {
    render(
      <CardStack
        accounts={accounts}
        mode="collapsed"
        onCardTap={vi.fn()}
      />,
    );

    const firstWrapper = screen.getByTestId('account-card-acc-1').parentElement as HTMLDivElement;
    const secondWrapper = screen.getByTestId('account-card-acc-2').parentElement as HTMLDivElement;
    expect(firstWrapper.style.height).not.toBe(`${CARD_HEADER_REVEAL}px`);
    expect(secondWrapper.style.height).toBe(`${CARD_HEADER_REVEAL}px`);
    expect(secondWrapper.style.transform).toContain('translateY(');
  });

  it('uses staggered delayed transforms when the cards fan out', () => {
    render(
      <CardStack
        accounts={accounts}
        mode="expanded"
        onCardTap={vi.fn()}
      />,
    );

    const secondWrapper = screen.getByTestId('account-card-acc-2').parentElement as HTMLDivElement;
    expect(secondWrapper.style.transitionDelay).toBe(`${STACK_STAGGER_MS}ms`);
    expect(secondWrapper.style.height).not.toBe(`${CARD_HEADER_REVEAL}px`);
    expect(secondWrapper.style.transform).not.toBe('');
  });
});