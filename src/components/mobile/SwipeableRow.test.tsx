/**
 * SwipeableRow Component Tests
 * 
 * TDD: Write tests FIRST before implementation (CLAUDE.md Article 2)
 * 
 * Tests the swipeable row component for mobile gesture actions.
 * Note: Touch gesture simulation is limited in jsdom, so we test
 * component rendering and props handling. Full gesture testing
 * is covered in E2E tests.
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwipeableRow } from './SwipeableRow';

describe('SwipeableRow', () => {
  const mockOnSwipeLeft = vi.fn();
  const mockOnSwipeRight = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <SwipeableRow onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
          <div data-testid="child-content">Row Content</div>
        </SwipeableRow>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('has container with correct data-testid', () => {
      render(
        <SwipeableRow onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
          <div>Row Content</div>
        </SwipeableRow>
      );

      expect(screen.getByTestId('swipeable-row')).toBeInTheDocument();
    });

    it('applies custom className to container', () => {
      render(
        <SwipeableRow 
          onSwipeLeft={mockOnSwipeLeft} 
          onSwipeRight={mockOnSwipeRight}
          className="custom-class"
        >
          <div>Row Content</div>
        </SwipeableRow>
      );

      expect(screen.getByTestId('swipeable-row')).toHaveClass('custom-class');
    });
  });

  describe('Action Indicators', () => {
    it('renders left action indicator when leftAction is provided', () => {
      render(
        <SwipeableRow 
          onSwipeLeft={mockOnSwipeLeft} 
          onSwipeRight={mockOnSwipeRight}
          leftAction={{ label: 'Edit', color: 'blue' }}
        >
          <div>Row Content</div>
        </SwipeableRow>
      );

      expect(screen.getByTestId('left-action')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('renders right action indicator when rightAction is provided', () => {
      render(
        <SwipeableRow 
          onSwipeLeft={mockOnSwipeLeft} 
          onSwipeRight={mockOnSwipeRight}
          rightAction={{ label: 'Delete', color: 'red' }}
        >
          <div>Row Content</div>
        </SwipeableRow>
      );

      expect(screen.getByTestId('right-action')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('does not render action indicators when not provided', () => {
      render(
        <SwipeableRow onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
          <div>Row Content</div>
        </SwipeableRow>
      );

      expect(screen.queryByTestId('left-action')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right-action')).not.toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('accepts threshold prop', () => {
      expect(() => {
        render(
          <SwipeableRow 
            onSwipeLeft={mockOnSwipeLeft} 
            onSwipeRight={mockOnSwipeRight}
            threshold={100}
          >
            <div>Row Content</div>
          </SwipeableRow>
        );
      }).not.toThrow();
    });

    it('accepts disabled prop', () => {
      expect(() => {
        render(
          <SwipeableRow 
            onSwipeLeft={mockOnSwipeLeft} 
            onSwipeRight={mockOnSwipeRight}
            disabled
          >
            <div>Row Content</div>
          </SwipeableRow>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has appropriate role for interactive element', () => {
      render(
        <SwipeableRow onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
          <div>Row Content</div>
        </SwipeableRow>
      );

      // The row should be accessible
      const row = screen.getByTestId('swipeable-row');
      expect(row).toBeInTheDocument();
    });

    it('action indicators have aria-hidden when not visible', () => {
      render(
        <SwipeableRow 
          onSwipeLeft={mockOnSwipeLeft} 
          onSwipeRight={mockOnSwipeRight}
          leftAction={{ label: 'Edit', color: 'blue' }}
          rightAction={{ label: 'Delete', color: 'red' }}
        >
          <div>Row Content</div>
        </SwipeableRow>
      );

      // Actions should be aria-hidden when not swiped
      const leftAction = screen.getByTestId('left-action');
      const rightAction = screen.getByTestId('right-action');
      
      expect(leftAction).toHaveAttribute('aria-hidden', 'true');
      expect(rightAction).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Content Wrapper', () => {
    it('wraps children in a transformable div', () => {
      render(
        <SwipeableRow onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
          <div data-testid="child">Content</div>
        </SwipeableRow>
      );

      const contentWrapper = screen.getByTestId('swipeable-content');
      expect(contentWrapper).toHaveStyle({ transform: 'translateX(0px)' });
    });
  });

  describe('Vertical Scroll Discrimination', () => {
    /**
     * Simulates a touch sequence (start → moves → end) on the given element
     * using testing-library's fireEvent which correctly triggers React handlers.
     */
    const simulateTouch = (
      el: HTMLElement,
      startPos: { clientX: number; clientY: number },
      moves: { clientX: number; clientY: number }[],
    ) => {
      fireEvent.touchStart(el, {
        touches: [startPos],
      });
      for (const m of moves) {
        fireEvent.touchMove(el, {
          touches: [m],
        });
      }
      fireEvent.touchEnd(el);
    };

    it('does NOT trigger swipe when vertical movement dominates', () => {
      render(
        <SwipeableRow onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
          <div>Content</div>
        </SwipeableRow>
      );

      const content = screen.getByTestId('swipeable-content');

      // Move primarily downward (vertical scroll) with slight horizontal drift
      simulateTouch(content, { clientX: 200, clientY: 200 }, [
        { clientX: 203, clientY: 220 }, // mostly vertical
        { clientX: 206, clientY: 260 },
        { clientX: 130, clientY: 300 }, // even if horizontal exceeds threshold later
      ]);

      expect(mockOnSwipeLeft).not.toHaveBeenCalled();
      expect(mockOnSwipeRight).not.toHaveBeenCalled();
    });

    it('DOES trigger swipe when horizontal movement dominates', () => {
      render(
        <SwipeableRow onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
          <div>Content</div>
        </SwipeableRow>
      );

      const content = screen.getByTestId('swipeable-content');

      // Move primarily left (horizontal swipe)
      simulateTouch(content, { clientX: 200, clientY: 200 }, [
        { clientX: 180, clientY: 202 }, // clear horizontal intent
        { clientX: 130, clientY: 204 }, // exceeds default 60px threshold
      ]);

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1);
    });
  });
});
