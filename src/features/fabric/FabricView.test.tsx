import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FabricView from './FabricView';

const useFabricMock = vi.fn();

vi.mock('../../hooks/useFabric', () => ({
  useFabric: () => useFabricMock(),
}));

vi.mock('./FabricPromptChips', () => ({
  FabricPromptChips: () => <div data-testid="prompt-chips">chips</div>,
}));

describe('FabricView', () => {
  it('shows disabled state when Anchor AI is off', () => {
    useFabricMock.mockReturnValue({
      isEnabled: false,
      isReady: false,
      context: { timeOfDay: 'morning' },
      patterns: [],
    });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText('Anchor AI is disabled. Enable it in Settings to view your assistant tab.')).toBeInTheDocument();
  });

  it('shows onboarding and prompt chips when there are no patterns', () => {
    useFabricMock.mockReturnValue({
      isEnabled: true,
      isReady: true,
      context: { timeOfDay: 'morning' },
      patterns: [],
    });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText("Hey! I'm Anchor AI.")).toBeInTheDocument();
    expect(screen.getByTestId('prompt-chips')).toBeInTheDocument();
  });
});
