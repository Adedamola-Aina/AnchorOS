// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SectionNav } from './SectionNav';

describe('SectionNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all section buttons', () => {
    render(<SectionNav includeAnchorAI={true} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('scrolls to section on click', () => {
    const mockElement = { scrollIntoView: vi.fn() };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

    render(<SectionNav includeAnchorAI={true} />);
    fireEvent.click(screen.getByText('Security'));

    expect(document.getElementById).toHaveBeenCalledWith('settings-security');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('handles missing section element gracefully', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    render(<SectionNav includeAnchorAI={true} />);
    // Should not throw
    fireEvent.click(screen.getByText('Profile'));

    expect(document.getElementById).toHaveBeenCalledWith('settings-profile');
  });

  it('renders as a nav element', () => {
    const { container } = render(<SectionNav includeAnchorAI={true} />);
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('has md:hidden class for mobile-only display', () => {
    const { container } = render(<SectionNav includeAnchorAI={true} />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('md:hidden');
  });

  it('hides AI chip when includeAnchorAI is false', () => {
    render(<SectionNav includeAnchorAI={false} />);
    expect(screen.queryByText('AI')).not.toBeInTheDocument();
  });
});
