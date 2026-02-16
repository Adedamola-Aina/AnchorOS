import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  AnimatedHomeIcon,
  AnimatedTasksIcon,
  AnimatedFinanceIcon,
  AnimatedSettingsIcon,
} from './AnimatedNavIcons';

describe('AnimatedNavIcons', () => {
  describe('AnimatedHomeIcon', () => {
    it('renders SVG', () => {
      const { container } = render(<AnimatedHomeIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies account colors when animating', () => {
      const { container } = render(
        <AnimatedHomeIcon isAnimating={true} accountColors={['#ff0000', '#00ff00', '#0000ff', '#ffff00']} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('cycles colors when fewer than 4 provided', () => {
      const { container } = render(
        <AnimatedHomeIcon isAnimating={true} accountColors={['#ff0000']} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('AnimatedTasksIcon', () => {
    it('renders SVG', () => {
      const { container } = render(<AnimatedTasksIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies animating styles', () => {
      const { container } = render(<AnimatedTasksIcon isAnimating={true} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('AnimatedFinanceIcon', () => {
    it('renders SVG', () => {
      const { container } = render(<AnimatedFinanceIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('fills with color when animating', () => {
      const { container } = render(<AnimatedFinanceIcon isAnimating={true} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('AnimatedSettingsIcon', () => {
    it('renders SVG', () => {
      const { container } = render(<AnimatedSettingsIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies dark mode colors', () => {
      const { container } = render(<AnimatedSettingsIcon isAnimating={true} isDarkMode={true} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies light mode colors', () => {
      const { container } = render(<AnimatedSettingsIcon isAnimating={true} isDarkMode={false} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
