import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ContactModal from './ContactModal';

const mockUser = { uid: 'user-1', email: 'test@test.com' };
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, profile: { name: 'Test User' } }),
}));

const mockAddDoc = vi.fn().mockResolvedValue({ id: 'doc-1' });
vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('../config/firebase', () => ({
  db: {},
  APP_ID: 'test-app',
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
    expect(screen.getByRole('combobox') || screen.getByRole('listbox') || screen.getByText(/feedback/i)).toBeTruthy();
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
});
