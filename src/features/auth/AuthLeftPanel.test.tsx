import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { AuthLeftPanel } from './AuthLeftPanel';

describe('AuthLeftPanel', () => {
    it('renders without crashing', () => {
        const { container } = render(<AuthLeftPanel />);
        expect(container).toBeInTheDocument();
        // Check for text content
        expect(container).toHaveTextContent('Anchor');
        expect(container).toHaveTextContent('Stay grounded');
    });

    it('contains SVG branding elements', () => {
        const { container } = render(<AuthLeftPanel />);
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThan(0);
    });
});
