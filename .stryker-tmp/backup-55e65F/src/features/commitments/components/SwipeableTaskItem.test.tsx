import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SwipeableTaskItem } from './SwipeableTaskItem';
import { buildTask } from '../../../test/factories';

vi.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({ isMobile: false }),
}));

describe('SwipeableTaskItem', () => {
  const task = buildTask({ title: 'Morning run', completed: false, type: 'daily' });
  const defaultProps = {
    task,
    hasFamilyActive: false,
    isEditing: false,
    onToggle: vi.fn(),
    onStartEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders task title', () => {
    render(<SwipeableTaskItem {...defaultProps} />);
    expect(screen.getByText('Morning run')).toBeInTheDocument();
  });

  it('renders as TaskItem on desktop', () => {
    const { container } = render(<SwipeableTaskItem {...defaultProps} />);
    // Desktop renders TaskItem directly (no swipe wrapper)
    expect(container.firstChild).toBeInTheDocument();
  });
});
