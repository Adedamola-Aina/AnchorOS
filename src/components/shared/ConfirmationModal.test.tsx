// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';

vi.mock('./Modal', () => ({
  Modal: ({ isOpen, title, children }: { isOpen: boolean; title: string; children: React.ReactNode }) =>
    isOpen ? <div role="dialog"><h2>{title}</h2>{children}</div> : null,
}));

describe('ConfirmationModal', () => {
  const defaults = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Delete Item?',
    message: 'This action cannot be undone.',
  };

  it('renders title and message', () => {
    render(<ConfirmationModal {...defaults} />);
    expect(screen.getByText('Delete Item?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('renders default button labels', () => {
    render(<ConfirmationModal {...defaults} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onConfirm and onClose on confirm click', () => {
    render(<ConfirmationModal {...defaults} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaults.onConfirm).toHaveBeenCalled();
    expect(defaults.onClose).toHaveBeenCalled();
  });

  it('calls onClose on cancel click', () => {
    render(<ConfirmationModal {...defaults} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaults.onClose).toHaveBeenCalled();
  });

  it('renders custom labels', () => {
    render(<ConfirmationModal {...defaults} confirmLabel="Delete" cancelLabel="Keep" />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<ConfirmationModal {...defaults} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });
});
