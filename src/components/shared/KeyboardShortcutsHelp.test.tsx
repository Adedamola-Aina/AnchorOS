import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

// Mock Modal component since it wraps content
vi.mock('./Modal', () => ({
  Modal: ({ isOpen, onClose, children, title }: any) =>
    isOpen ? <div data-testid="modal"><h2>{title}</h2>{children}</div> : null,
}));

describe('KeyboardShortcutsHelp', () => {
  it('renders nothing when closed', () => {
    render(<KeyboardShortcutsHelp isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders shortcut categories when open', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });

  it('displays keyboard shortcuts', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={vi.fn()} />);
    // Should show at least some kbd elements
    const kbds = document.querySelectorAll('kbd');
    expect(kbds.length).toBeGreaterThan(0);
  });

  it('shows help hint in footer', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/anytime/i)).toBeInTheDocument();
  });
});
