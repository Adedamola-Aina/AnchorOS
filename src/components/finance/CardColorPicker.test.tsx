// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardColorPicker } from './CardColorPicker';
import { PRESET_COLORS } from './cardConstants';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return { ...actual, Check: () => <span data-testid="check-icon" /> };
});

describe('CardColorPicker', () => {
  const defaultProps = {
    currentColor: '#3D52D5',
    onSelect: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders all preset color swatches', () => {
    render(<CardColorPicker {...defaultProps} />);
    const buttons = screen.getAllByRole('button', { name: /Select color/ });
    expect(buttons).toHaveLength(PRESET_COLORS.length);
  });

  it('shows check icon on the currently selected color', () => {
    render(<CardColorPicker {...defaultProps} />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('calls onSelect when a swatch is clicked', async () => {
    const onSelect = vi.fn();
    render(<CardColorPicker {...defaultProps} onSelect={onSelect} />);
    const user = userEvent.setup();

    const buttons = screen.getAllByRole('button', { name: /Select color/ });
    await user.click(buttons[2]);
    expect(onSelect).toHaveBeenCalledWith(PRESET_COLORS[2]);
  });

  it('calls onClose when Done is clicked', async () => {
    const onClose = vi.fn();
    render(<CardColorPicker {...defaultProps} onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Done'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders custom color section', () => {
    render(<CardColorPicker {...defaultProps} />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.currentColor)).toBeInTheDocument();
  });

  it('has 44px minimum touch targets', () => {
    render(<CardColorPicker {...defaultProps} />);
    const buttons = screen.getAllByRole('button', { name: /Select color/ });
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
      expect(btn.className).toContain('min-w-[44px]');
    });
  });
});
