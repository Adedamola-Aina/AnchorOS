import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { FabricSuggestionToast, FabricSuggestionContainer } from './FabricSuggestionToast';

describe('FabricSuggestionToast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const makeSuggestion = (overrides = {}) => ({
    id: 'sug-1',
    message: 'Log this as a transaction?',
    action: vi.fn(),
    dismiss: vi.fn(),
    ...overrides,
  });

  it('renders suggestion message', () => {
    render(<FabricSuggestionToast suggestion={makeSuggestion()} />);
    expect(screen.getByText('Log this as a transaction?')).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<FabricSuggestionToast suggestion={makeSuggestion()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls action on action button click', () => {
    const suggestion = makeSuggestion();
    render(<FabricSuggestionToast suggestion={suggestion} />);
    fireEvent.click(screen.getByText('Yes, Record'));
    expect(suggestion.action).toHaveBeenCalled();
  });

  it('dismisses via Not now button', () => {
    const suggestion = makeSuggestion();
    render(<FabricSuggestionToast suggestion={suggestion} />);
    fireEvent.click(screen.getByText('Not now'));
    act(() => vi.advanceTimersByTime(400));
    expect(suggestion.dismiss).toHaveBeenCalled();
  });

  it('dismisses via X button', () => {
    const suggestion = makeSuggestion();
    render(<FabricSuggestionToast suggestion={suggestion} />);
    fireEvent.click(screen.getByLabelText('Dismiss suggestion'));
    act(() => vi.advanceTimersByTime(400));
    expect(suggestion.dismiss).toHaveBeenCalled();
  });

  it('shows amount metadata when present', () => {
    const suggestion = makeSuggestion({ metadata: { amount: 5000 } });
    render(<FabricSuggestionToast suggestion={suggestion} />);
    expect(screen.getByText(/5,000/)).toBeInTheDocument();
  });
});

describe('FabricSuggestionContainer', () => {
  it('shows only the last suggestion', () => {
    const suggestions = [
      { id: '1', message: 'First', action: vi.fn(), dismiss: vi.fn() },
      { id: '2', message: 'Second', action: vi.fn(), dismiss: vi.fn() },
    ];
    render(<FabricSuggestionContainer suggestions={suggestions} />);
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });

  it('renders nothing for empty array', () => {
    const { container } = render(<FabricSuggestionContainer suggestions={[]} />);
    expect(container.children).toHaveLength(0);
  });
});
