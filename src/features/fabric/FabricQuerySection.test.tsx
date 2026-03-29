/// <reference types="@testing-library/jest-dom/vitest" />
import React, { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
});
