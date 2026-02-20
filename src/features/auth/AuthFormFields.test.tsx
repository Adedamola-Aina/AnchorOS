// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthFormFields } from './AuthFormFields';

describe('AuthFormFields Autofill & Accessibility', () => {
    const defaultProps = {
        setAuthMode: vi.fn(),
        email: '',
        setEmail: vi.fn(),
        password: '',
        setPassword: vi.fn(),
        mfaCode: '',
        setMfaCode: vi.fn(),
        showPassword: false,
        setShowPassword: vi.fn(),
        validationErrors: {},
        setValidationErrors: vi.fn(),
    };

    describe('Login Mode', () => {
        it('renders standard email attributes for password managers', () => {
            render(<AuthFormFields {...defaultProps} authMode="login" />);

            const emailInput = screen.getByPlaceholderText('you@example.com');
            expect(emailInput).toHaveAttribute('name', 'email');
            expect(emailInput).toHaveAttribute('id', 'email');
            expect(emailInput).toHaveAttribute('autoComplete', 'username email');
        });

        it('renders standard password attributes for password managers', () => {
            render(<AuthFormFields {...defaultProps} authMode="login" />);

            const passwordInput = screen.getByPlaceholderText('••••••••');
            expect(passwordInput).toHaveAttribute('name', 'password');
            expect(passwordInput).toHaveAttribute('id', 'password');
            expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
        });
    });

    describe('Signup Mode', () => {
        it('renders standard email attributes for password managers', () => {
            render(<AuthFormFields {...defaultProps} authMode="signup" />);

            const emailInput = screen.getByPlaceholderText('you@example.com');
            expect(emailInput).toHaveAttribute('name', 'email');
            expect(emailInput).toHaveAttribute('id', 'email');
            expect(emailInput).toHaveAttribute('autoComplete', 'email');
        });

        it('renders standard password attributes for password managers', () => {
            render(<AuthFormFields {...defaultProps} authMode="signup" />);

            const passwordInput = screen.getByPlaceholderText('••••••••');
            expect(passwordInput).toHaveAttribute('name', 'password');
            expect(passwordInput).toHaveAttribute('id', 'password');
            expect(passwordInput).toHaveAttribute('autoComplete', 'new-password');
        });
    });

    describe('Reset Mode', () => {
        it('renders standard email attributes for password managers', () => {
            render(<AuthFormFields {...defaultProps} authMode="reset" />);

            const emailInput = screen.getByPlaceholderText('you@example.com');
            expect(emailInput).toHaveAttribute('name', 'email');
            expect(emailInput).toHaveAttribute('id', 'email');
            expect(emailInput).toHaveAttribute('autoComplete', 'email');

            // Password shouldn't be rendered in reset mode
            expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument();
        });
    });

    describe('MFA Mode', () => {
        it('does not render fake hidden inputs that confuse password managers', () => {
            const { container } = render(<AuthFormFields {...defaultProps} authMode="mfa" />);

            // Should not have the confusing hidden inputs anymore
            expect(container.querySelector('input[name="fakeusernameremembered"]')).not.toBeInTheDocument();
            expect(container.querySelector('input[name="fakepasswordremembered"]')).not.toBeInTheDocument();

            const otpInput = screen.getByPlaceholderText('000000');
            expect(otpInput).toHaveAttribute('autoComplete', 'one-time-code');
        });
    });
});
