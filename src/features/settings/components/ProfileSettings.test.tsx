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

  // UX-ST-04: the field used to auto-save on a debounce with no dirty state,
  // no validation and no confirmation.
  describe('UX-ST-04: explicit save', () => {
    it('does not save while the user is still typing', () => {
      const onUpdate = vi.fn();
      render(<ProfileSettings name="Alice" uid="u-1" onUpdateName={onUpdate} />);

      fireEvent.change(screen.getByTestId('profile-name-input'), { target: { value: 'Bob' } });
      act(() => { vi.advanceTimersByTime(2000); });

      expect(onUpdate).not.toHaveBeenCalled();
      expect(screen.getByTestId('profile-dirty')).toBeInTheDocument();
    });

    it('saves the trimmed name when Save is pressed, and confirms in place', () => {
      const onUpdate = vi.fn();
      render(<ProfileSettings name="Alice" uid="u-1" onUpdateName={onUpdate} />);

      fireEvent.change(screen.getByTestId('profile-name-input'), { target: { value: '  Bob  ' } });
      fireEvent.click(screen.getByTestId('profile-save-name'));

      expect(onUpdate).toHaveBeenCalledWith('Bob');
      expect(screen.getByTestId('profile-saved')).toBeInTheDocument();
    });

    it('disables Save until there is something valid to save', () => {
      const onUpdate = vi.fn();
      render(<ProfileSettings name="Alice" uid="u-1" onUpdateName={onUpdate} />);

      // Nothing changed yet.
      expect(screen.getByTestId('profile-save-name')).toBeDisabled();

      fireEvent.change(screen.getByTestId('profile-name-input'), { target: { value: 'Bob' } });
      expect(screen.getByTestId('profile-save-name')).toBeEnabled();

      act(() => { vi.advanceTimersByTime(5000); });
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('rejects an empty name inline instead of saving it', () => {
      const onUpdate = vi.fn();
      render(<ProfileSettings name="Alice" uid="u-1" onUpdateName={onUpdate} />);

      fireEvent.change(screen.getByTestId('profile-name-input'), { target: { value: '   ' } });

      expect(screen.getByTestId('profile-name-error')).toHaveTextContent(/enter a display name/i);
      expect(screen.getByTestId('profile-save-name')).toBeDisabled();

      fireEvent.click(screen.getByTestId('profile-save-name'));
      expect(onUpdate).not.toHaveBeenCalled();
    });
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
