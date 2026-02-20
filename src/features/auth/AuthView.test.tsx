import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthView from './AuthView';

// Mock dependencies
vi.mock('../../hooks/useKeyboardAvoidance', () => ({
    useKeyboardAvoidance: vi.fn(),
}));

describe('AuthView', () => {
    const defaultProps = {
        authMode: 'login' as const,
        setAuthMode: vi.fn(),
        email: '',
        setEmail: vi.fn(),
        password: '',
        setPassword: vi.fn(),
        mfaCode: '',
        setMfaCode: vi.fn(),
        authError: '',
        isAuthenticating: false,
        onSubmit: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login view correctly', () => {
        render(<AuthView {...defaultProps} />);
        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.getByText('Sign into your world')).toBeInTheDocument();
    });

    it('renders signup view correctly', () => {
        render(<AuthView {...defaultProps} authMode="signup" />);
        expect(screen.getByText('Create your account')).toBeInTheDocument();
    });

    it('displays auth error when provided', () => {
        render(<AuthView {...defaultProps} authError="Invalid credentials" />);
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('validates empty fields on submit', () => {
        render(<AuthView {...defaultProps} />);
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it('validates invalid email format', () => {
        const props = { ...defaultProps, email: 'invalid-email' };
        render(<AuthView {...props} />);
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it('validates missing password on login', () => {
        const props = { ...defaultProps, email: 'test@example.com' };
        render(<AuthView {...props} />);
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(screen.getByText('Password is required')).toBeInTheDocument();
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it('validates password length on signup', () => {
        const props = { ...defaultProps, authMode: 'signup' as const, email: 'test@example.com', password: 'short' };
        render(<AuthView {...props} />);
        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit when validation passes', () => {
        const props = { ...defaultProps, email: 'test@example.com', password: 'validpassword123' };
        render(<AuthView {...props} />);
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(props.onSubmit).toHaveBeenCalled();
    });

    it('enforces rate limiting after 5 attempts', () => {
        const props = { ...defaultProps, email: 'test@example.com', password: 'validpassword123' };
        render(<AuthView {...props} />);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        // Fire 5 times
        for (let i = 0; i < 5; i++) {
            fireEvent.click(submitButton);
        }
        expect(props.onSubmit).toHaveBeenCalledTimes(5);

        // 6th time should be rate limited
        fireEvent.click(submitButton);
        expect(screen.getByText(/Too many attempts/i)).toBeInTheDocument();
        expect(props.onSubmit).toHaveBeenCalledTimes(5); // Still 5
    });

    it('toggles auth mode appropriately', () => {
        render(<AuthView {...defaultProps} />);
        const signUpLink = screen.getByText('Sign up');
        fireEvent.click(signUpLink);
        expect(defaultProps.setAuthMode).toHaveBeenCalledWith('signup');
    });
});
