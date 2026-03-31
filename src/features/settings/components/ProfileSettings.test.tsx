// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ProfileSettings } from './ProfileSettings';

vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { providerData: [{ providerId: 'password' }] } }),
}));

// Google provider uses Globe icon (Chrome not available in this lucide-react version)

describe('ProfileSettings', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('renders name input and uid', () => {
    render(<ProfileSettings name="Alice" uid="u-123" onUpdateName={vi.fn()} />);
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByText('u-123')).toBeInTheDocument();
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
