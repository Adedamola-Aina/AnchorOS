// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardArtworkPicker } from './CardArtworkPicker';
import { ARTWORK_PRESETS } from './cardConstants';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return { ...actual, Check: () => <span data-testid="check-icon" /> };
});

describe('CardArtworkPicker', () => {
  const defaultProps = {
    currentPreset: undefined as string | undefined,
    cardColor: '#3D52D5',
    onSelect: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders all artwork presets plus "None" option', () => {
    render(<CardArtworkPicker {...defaultProps} />);
    expect(screen.getByText('None')).toBeInTheDocument();
    for (const preset of ARTWORK_PRESETS) {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    }
  });

  it('shows check icon on None when no preset selected', () => {
    render(<CardArtworkPicker {...defaultProps} />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('shows check icon on selected preset', () => {
    render(<CardArtworkPicker {...defaultProps} currentPreset="waves" />);
    const checks = screen.getAllByTestId('check-icon');
    expect(checks).toHaveLength(1);
  });

  it('calls onSelect with preset id when clicked', async () => {
    const onSelect = vi.fn();
    render(<CardArtworkPicker {...defaultProps} onSelect={onSelect} />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Waves'));
    expect(onSelect).toHaveBeenCalledWith('waves');
  });

  it('calls onSelect with undefined when None is clicked', async () => {
    const onSelect = vi.fn();
    render(<CardArtworkPicker {...defaultProps} currentPreset="waves" onSelect={onSelect} />);
    const user = userEvent.setup();

    await user.click(screen.getByText('None'));
    expect(onSelect).toHaveBeenCalledWith(undefined);
  });

  it('calls onClose when Done is clicked', async () => {
    const onClose = vi.fn();
    render(<CardArtworkPicker {...defaultProps} onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Done'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders all preset option buttons', () => {
    render(<CardArtworkPicker {...defaultProps} />);
    // "None" + each preset label + "Done" button
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('Waves')).toBeInTheDocument();
    expect(screen.getByText('Topo')).toBeInTheDocument();
    expect(screen.getByText('Card Pattern')).toBeInTheDocument();
  });
});
