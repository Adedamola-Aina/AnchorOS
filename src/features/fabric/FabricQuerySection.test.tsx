/// <reference types="@testing-library/jest-dom/vitest" />
import React, { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { FabricQuerySection } from './FabricQuerySection';

vi.mock('./FabricPromptChips', () => ({
  FabricPromptChips: ({ onPrompt }: { onPrompt: (prompt: string) => Promise<void> }) => (
    <button type="button" onClick={() => void onPrompt('Prompt test')}>
      Prompt test
    </button>
  ),
}));

describe('FabricQuerySection', () => {
  it('updates free text and submits query', () => {
    const onChangeText = vi.fn();
    const onSubmitText = vi.fn();

    render(
      <FabricQuerySection
        freeText="hello"
        inputRef={createRef<HTMLInputElement>()}
        isQuerying={false}
        queryResult={null}
        thread={[]}
        onAskAgain={vi.fn(async () => undefined)}
        onChangeText={onChangeText}
        onSubmitText={onSubmitText}
        onPrompt={vi.fn(async () => undefined)}
        onGenerateWeeklyReport={vi.fn()}
        onAction={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('What do I have today? Plan my week...'), {
      target: { value: 'new value' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Send' }).closest('form')!);

    expect(onChangeText).toHaveBeenCalledWith('new value');
    expect(onSubmitText).toHaveBeenCalledTimes(1);
  });

  it('disables send button when input is empty or querying', () => {
    const { rerender } = render(
      <FabricQuerySection
        freeText="   "
        inputRef={createRef<HTMLInputElement>()}
        isQuerying={false}
        queryResult={null}
        thread={[]}
        onAskAgain={vi.fn(async () => undefined)}
        onChangeText={vi.fn()}
        onSubmitText={vi.fn()}
        onPrompt={vi.fn(async () => undefined)}
        onGenerateWeeklyReport={vi.fn()}
        onAction={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();

    rerender(
      <FabricQuerySection
        freeText="hello"
        inputRef={createRef<HTMLInputElement>()}
        isQuerying={true}
        queryResult={null}
        thread={[]}
        onAskAgain={vi.fn(async () => undefined)}
        onChangeText={vi.fn()}
        onSubmitText={vi.fn()}
        onPrompt={vi.fn(async () => undefined)}
        onGenerateWeeklyReport={vi.fn()}
        onAction={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('shows thinking state while querying', () => {
    render(
      <FabricQuerySection
        freeText="hello"
        inputRef={createRef<HTMLInputElement>()}
        isQuerying={true}
        queryResult={null}
        thread={[]}
        onAskAgain={vi.fn(async () => undefined)}
        onChangeText={vi.fn()}
        onSubmitText={vi.fn()}
        onPrompt={vi.fn(async () => undefined)}
        onGenerateWeeklyReport={vi.fn()}
        onAction={vi.fn()}
      />,
    );

    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  it('renders query result details and invokes action handlers', () => {
    const onAction = vi.fn();
    const onPrompt = vi.fn(async () => undefined);
    render(
      <FabricQuerySection
        freeText="hello"
        inputRef={createRef<HTMLInputElement>()}
        isQuerying={false}
        thread={[]}
        onAskAgain={vi.fn(async () => undefined)}
        queryResult={{
          data: null,
          summary: 'Summary text',
          detail: 'Line one\nLine two',
          visualizable: false,
          actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
        }}
        onChangeText={vi.fn()}
        onSubmitText={vi.fn()}
        onPrompt={onPrompt}
        onGenerateWeeklyReport={vi.fn()}
        onAction={onAction}
      />,
    );

    expect(screen.getByText('Summary text')).toBeInTheDocument();
    expect(screen.getByText(/Line one/)).toBeInTheDocument();
    expect(screen.getByText(/Line two/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open Finance' }));
    expect(onAction).toHaveBeenCalledWith('navigate', { page: 'finance' });

    fireEvent.click(screen.getByRole('button', { name: 'Prompt test' }));
    expect(onPrompt).toHaveBeenCalledWith('Prompt test');
  });

  it('renders response without action buttons when actions are absent', () => {
    render(
      <FabricQuerySection
        freeText="hello"
        inputRef={createRef<HTMLInputElement>()}
        isQuerying={false}
        thread={[]}
        onAskAgain={vi.fn(async () => undefined)}
        queryResult={{
          data: null,
          summary: 'Summary only',
          visualizable: false,
        }}
        onChangeText={vi.fn()}
        onSubmitText={vi.fn()}
        onPrompt={vi.fn(async () => undefined)}
        onGenerateWeeklyReport={vi.fn()}
        onAction={vi.fn()}
      />,
    );

    expect(screen.getByText('Summary only')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open Finance' })).not.toBeInTheDocument();
  });

  // ─── UX-AI-03: continuity and a stated data source ──────────────────────
  describe('UX-AI-03', () => {
    const baseProps = {
      freeText: '',
      inputRef: createRef<HTMLInputElement>(),
      isQuerying: false,
      onChangeText: vi.fn(),
      onSubmitText: vi.fn(),
      onPrompt: vi.fn(async () => undefined),
      onGenerateWeeklyReport: vi.fn(),
      onAction: vi.fn(),
    };

    it('states which data the answer used', () => {
      render(
        <FabricQuerySection
          {...baseProps}
          queryResult={{ data: null, summary: 'You spent ₦5,000', visualizable: false }}
          thread={[{ id: '1', question: 'How much did I spend?', answer: null }]}
          onAskAgain={vi.fn(async () => undefined)}
        />,
      );

      expect(screen.getByTestId('answer-source')).toHaveTextContent(/your own commitments, accounts and recorded transactions/i);
      expect(screen.getByTestId('query-answer-question')).toHaveTextContent('How much did I spend?');
    });

    it('offers Ask again on the current answer', () => {
      const onAskAgain = vi.fn(async () => undefined);
      render(
        <FabricQuerySection
          {...baseProps}
          queryResult={{ data: null, summary: 'You spent ₦5,000', visualizable: false }}
          thread={[{ id: '1', question: 'How much did I spend?', answer: null }]}
          onAskAgain={onAskAgain}
        />,
      );

      fireEvent.click(screen.getByTestId('ask-again'));
      expect(onAskAgain).toHaveBeenCalledWith('How much did I spend?');
    });

    it('keeps earlier exchanges readable, each with its own Ask again', () => {
      const onAskAgain = vi.fn(async () => undefined);
      render(
        <FabricQuerySection
          {...baseProps}
          queryResult={{ data: null, summary: 'Current summary', visualizable: false }}
          thread={[
            { id: 'new', question: 'Current question', answer: null },
            { id: 'old', question: 'Earlier question', answer: { data: null, summary: 'Earlier summary', visualizable: false } },
          ]}
          onAskAgain={onAskAgain}
        />,
      );

      const thread = screen.getByTestId('ask-anchor-thread');
      expect(within(thread).getByText('Earlier question')).toBeInTheDocument();
      expect(within(thread).getByText('Earlier summary')).toBeInTheDocument();

      fireEvent.click(within(thread).getByText('Ask again'));
      expect(onAskAgain).toHaveBeenCalledWith('Earlier question');
    });

    it('renders no thread section when there is only the current exchange', () => {
      render(
        <FabricQuerySection
          {...baseProps}
          queryResult={{ data: null, summary: 'Only answer', visualizable: false }}
          thread={[{ id: '1', question: 'Only question', answer: null }]}
          onAskAgain={vi.fn(async () => undefined)}
        />,
      );

      expect(screen.queryByTestId('ask-anchor-thread')).not.toBeInTheDocument();
    });
  });

  // ─── AI-15: tap-to-cite — "why I said this" ─────────────────────────────
  describe('AI-15 — every statement expands to its records', () => {
    const baseProps = {
      freeText: '',
      inputRef: createRef<HTMLInputElement>(),
      isQuerying: false,
      onChangeText: vi.fn(),
      onSubmitText: vi.fn(),
      onPrompt: vi.fn(async () => undefined),
      onGenerateWeeklyReport: vi.fn(),
      onAction: vi.fn(),
      onAskAgain: vi.fn(async () => undefined),
    };

    const cited = {
      data: null,
      summary: 'You spent ₦5,000 this month.',
      visualizable: false,
      citations: [
        { label: 'Expense transactions', count: 2, window: 'this month', basis: 'Summed from your ledger; soft-deleted transactions are excluded.' },
      ],
    };

    it('offers the records behind the answer, closed by default', () => {
      render(
        <FabricQuerySection {...baseProps} queryResult={cited} thread={[{ id: '1', question: 'How much did I spend?', answer: null }]} />,
      );

      const toggle = screen.getByTestId('why-said-this');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('citation-list')).not.toBeInTheDocument();
    });

    it('shows what was read, how many, the window and the basis', () => {
      render(
        <FabricQuerySection {...baseProps} queryResult={cited} thread={[{ id: '1', question: 'How much did I spend?', answer: null }]} />,
      );

      fireEvent.click(screen.getByTestId('why-said-this'));

      const list = screen.getByTestId('citation-list');
      expect(within(list).getByText('Expense transactions')).toBeInTheDocument();
      expect(within(list).getByText(/this month/)).toBeInTheDocument();
      expect(within(list).getByText(/2 records/)).toBeInTheDocument();
      expect(within(list).getByText(/soft-deleted transactions are excluded/)).toBeInTheDocument();
    });

    it('can be collapsed again', () => {
      render(
        <FabricQuerySection {...baseProps} queryResult={cited} thread={[{ id: '1', question: 'How much did I spend?', answer: null }]} />,
      );

      fireEvent.click(screen.getByTestId('why-said-this'));
      expect(screen.getByTestId('citation-list')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('why-said-this'));
      expect(screen.queryByTestId('citation-list')).not.toBeInTheDocument();
    });

    it('says nothing about records when the answer claims nothing', () => {
      render(
        <FabricQuerySection
          {...baseProps}
          queryResult={{ data: null, summary: 'Opening Finance.', visualizable: false }}
          thread={[{ id: '1', question: 'Go to finance', answer: null }]}
        />,
      );

      expect(screen.queryByTestId('why-said-this')).not.toBeInTheDocument();
    });
  });
});
