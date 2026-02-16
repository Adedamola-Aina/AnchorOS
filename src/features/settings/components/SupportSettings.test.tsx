// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SupportSettings } from './SupportSettings';

describe('SupportSettings', () => {
  it('renders contact section heading', () => {
    render(<SupportSettings onOpenContact={vi.fn()} />);
    expect(screen.getByText('Contact & Feedback')).toBeInTheDocument();
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText(/report bugs/i)).toBeInTheDocument();
  });

  it('calls onOpenContact when button clicked', () => {
    const onOpen = vi.fn();
    render(<SupportSettings onOpenContact={onOpen} />);
    fireEvent.click(screen.getByText('Send Message'));
    expect(onOpen).toHaveBeenCalled();
  });
});
