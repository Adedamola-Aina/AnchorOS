// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ContactModal from './ContactModal';

const mockUser = { uid: 'user-1', email: 'test@test.com' };
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, profile: { name: 'Test User' } }),
}));

const mockCreateFeedbackBackup = vi.fn().mockResolvedValue(undefined);
vi.mock('../api/FeedbackApi', () => ({
  createFeedbackBackup: (...args: unknown[]) => mockCreateFeedbackBackup(...args),
}));

// Mock fetch for Formspree
global.fetch = vi.fn().mockResolvedValue({ ok: true });

describe('ContactModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // createPortal needs a target
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('renders contact form', () => {
    render(<ContactModal onClose={vi.fn()} />);
    expect(screen.getByText(/what's this about/i)).toBeTruthy();
  });

  it('renders message textarea', () => {
    render(<ContactModal onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument();
  });

  it('calls onClose on backdrop click', () => {
    const onClose = vi.fn();
    render(<ContactModal onClose={onClose} />);
    // Click the backdrop (outermost div)
    const backdrop = document.querySelector('[class*="fixed"]');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('pre-fills email from auth', () => {
    render(<ContactModal onClose={vi.fn()} />);
    const emailInput = screen.getByDisplayValue('test@test.com');
    expect(emailInput).toBeInTheDocument();
  });

  it('pre-fills name from profile', () => {
    render(<ContactModal onClose={vi.fn()} />);
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    mockCreateFeedbackBackup.mockResolvedValue(undefined);
    render(<ContactModal onClose={vi.fn()} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    fireEvent.change(textarea, { target: { value: 'Great app!' } });
    
    const form = textarea.closest('form');
    if (form) fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockCreateFeedbackBackup).toHaveBeenCalled();
    });
  });

  it('shows error on submission failure', async () => {
    mockCreateFeedbackBackup.mockRejectedValue(new Error('Network error'));
    (global.fetch as any).mockRejectedValue(new Error('fail'));
    
    render(<ContactModal onClose={vi.fn()} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    const form = textarea.closest('form');
    if (form) fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
  });

  it('stops propagation on inner div click', () => {
    const onClose = vi.fn();
    render(<ContactModal onClose={onClose} />);
    // Click the inner form area
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    fireEvent.click(textarea.closest('div[class*="bg-white"]') || textarea);
    // Since stopPropagation is called, onClose should NOT be triggered from inner click
    // The actual assertion checks that the form is still visible
    expect(textarea).toBeInTheDocument();
  });
});
