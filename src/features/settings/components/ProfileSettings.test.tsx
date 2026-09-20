// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ProfileSettings } from './ProfileSettings';

vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { providerData: [{ providerId: 'password' }], email: 'alice@example.com' } }),
}));

// Google provider uses Globe icon (Chrome not available in this lucide-react version)

describe('ProfileSettings', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('renders the name input but NOT the raw internal id (UX-ST-03)', () => {
    render(<ProfileSettings name="Alice" uid="u-123" onUpdateName={vi.fn()} />);
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    // The defect: the raw id was primary, unexplained information here.
    expect(screen.queryByText('u-123')).not.toBeInTheDocument();
    expect(screen.queryByText('User Identifier')).not.toBeInTheDocument();
  });

  it('shows the email as the identity field instead of the id (UX-ST-03)', () => {
    render(<ProfileSettings name="Alice" uid="u-123" onUpdateName={vi.fn()} />);
    expect(screen.getByTestId('profile-email')).toHaveTextContent('alice@example.com');
  });

  it('debounces name update', () => {
    const onUpdate = vi.fn();
    render(<ProfileSettings name="Alice" uid="u-1" onUpdateName={onUpdate} />);
    fireEvent.change(screen.getByDisplayValue('Alice'), { target: { value: 'Bob' } });
    expect(onUpdate).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(500); });
    expect(onUpdate).toHaveBeenCalledWith('Bob');
  });

  it('does not fire update if name unchanged', () => {
    const onUpdate = vi.fn();
    render(<ProfileSettings name="Alice" uid="u-1" onUpdateName={onUpdate} />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('shows Email & Password badge for password provider', () => {
    render(<ProfileSettings name="Alice" uid="u-1" onUpdateName={vi.fn()} />);
    expect(screen.getByText(/Email.*Password/i)).toBeInTheDocument();
  });
});
