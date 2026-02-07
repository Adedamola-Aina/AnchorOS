import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
    it('renders all 3 options by default', () => {
        render(<ThemeToggle theme="light" onSetTheme={() => { }} />);
        expect(screen.getByLabelText('Light theme')).toBeInTheDocument();
        expect(screen.getByLabelText('Auto theme')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark theme')).toBeInTheDocument();
    });

    it('renders only specified options when filtered', () => {
        render(<ThemeToggle theme="light" onSetTheme={() => { }} options={['light', 'dark']} />);
        expect(screen.getByLabelText('Light theme')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark theme')).toBeInTheDocument();
        expect(screen.queryByLabelText('Auto theme')).toBeNull();
    });

    it('calls onSetTheme when a button is clicked', () => {
        const mockSetTheme = vi.fn();
        render(<ThemeToggle theme="light" onSetTheme={mockSetTheme} />);
        fireEvent.click(screen.getByLabelText('Dark theme'));
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('marks the active theme with aria-pressed', () => {
        render(<ThemeToggle theme="dark" onSetTheme={() => { }} />);
        expect(screen.getByLabelText('Dark theme')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByLabelText('Light theme')).toHaveAttribute('aria-pressed', 'false');
    });
});
