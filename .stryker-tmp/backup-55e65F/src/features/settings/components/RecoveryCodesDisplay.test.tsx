import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RecoveryCodesDisplay } from './RecoveryCodesDisplay';

const mockCodes = ['CODE-001', 'CODE-002', 'CODE-003', 'CODE-004'];
const mockOnDone = vi.fn();

describe('RecoveryCodesDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, { clipboard: { writeText: vi.fn(() => Promise.resolve()) } });
  });

  it('renders all codes', () => {
    render(<RecoveryCodesDisplay codes={mockCodes} onDone={mockOnDone} />);
    mockCodes.forEach(c => expect(screen.getByText(c)).toBeInTheDocument());
  });

  it('shows save reminder instructions', () => {
    render(<RecoveryCodesDisplay codes={mockCodes} onDone={mockOnDone} />);
    expect(screen.getByText('Save Your Recovery Codes')).toBeInTheDocument();
  });

  it('copies all codes to clipboard', async () => {
    render(<RecoveryCodesDisplay codes={mockCodes} onDone={mockOnDone} />);
    fireEvent.click(screen.getByText('Copy All'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCodes.join('\n'));
  });

  it('downloads codes as text file', () => {
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();

    render(<RecoveryCodesDisplay codes={mockCodes} onDone={mockOnDone} />);
    const downloadBtn = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadBtn);
    
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('disables Done until checkbox confirmed', () => {
    render(<RecoveryCodesDisplay codes={mockCodes} onDone={mockOnDone} />);
    const doneBtn = screen.getByText('Done');
    expect(doneBtn).toBeDisabled();
  });

  it('enables Done after checkbox confirmed', () => {
    render(<RecoveryCodesDisplay codes={mockCodes} onDone={mockOnDone} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    const doneBtn = screen.getByText('Done');
    expect(doneBtn).not.toBeDisabled();
  });

  it('calls onDone when Done clicked', () => {
    render(<RecoveryCodesDisplay codes={mockCodes} onDone={mockOnDone} />);
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('Done'));
    expect(mockOnDone).toHaveBeenCalled();
  });
});
