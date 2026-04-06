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
  it('keeps the collapsed stack tightly overlapped with last card in front', () => {
    render(
      <CardStack
        accounts={accounts}
        mode="collapsed"
        onCardTap={vi.fn()}
      />,
    );

    const firstWrapper = screen.getByTestId('card-stack-item-acc-1');
    const lastWrapper = screen.getByTestId('card-stack-item-acc-3');
    /* All cards rendered at full height — overlap handled by ascending z-order */
    expect(firstWrapper.style.top).toBe('0px');
    expect(lastWrapper.style.top).not.toBe('0px');
    /* Last card (front) is draggable, first card (back) is not */
    expect(firstWrapper).toHaveAttribute('data-draggable', 'false');
    expect(lastWrapper).toHaveAttribute('data-draggable', 'true');
  });

  it('uses staggered delayed transforms when the cards fan out', () => {
    render(
      <CardStack
        accounts={accounts}
        mode="expanded"
        onCardTap={vi.fn()}
      />,
    );

    const firstWrapper = screen.getByTestId('card-stack-item-acc-1');
    const secondWrapper = screen.getByTestId('card-stack-item-acc-2');
    expect(firstWrapper).toHaveAttribute('data-draggable', 'false');
    expect(secondWrapper.style.transitionDelay).toBe(`${STACK_STAGGER_MS}ms`);
    expect(secondWrapper.style.height).not.toBe(`${CARD_HEADER_REVEAL}px`);
    expect(secondWrapper.style.top).not.toBe('');
  });
});