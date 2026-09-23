
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnvironmentBanner } from './EnvironmentBanner';

afterEach(() => vi.unstubAllEnvs());

/**
 * UX-GL-06: the treatment used to be "development, or a raw yellow bar for
 * everything else" — i.e. undefined for every non-dev environment. It is now a
 * per-environment decision that fails closed.
 */
describe('EnvironmentBanner (UX-GL-06)', () => {
  it('renders nothing in production', () => {
    vi.stubEnv('VITE_APP_ENV', 'production');
    const { container } = render(<EnvironmentBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for an unknown environment instead of guessing', () => {
    vi.stubEnv('VITE_APP_ENV', 'preview');
    const { container } = render(<EnvironmentBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('labels development', () => {
    vi.stubEnv('VITE_APP_ENV', 'development');
    render(<EnvironmentBanner />);

    const banner = screen.getByTestId('environment-banner');
    expect(banner).toHaveAttribute('data-environment', 'development');
    expect(screen.getByText('DEVELOPMENT ENVIRONMENT')).toBeInTheDocument();
  });

  it('gives staging its own treatment that states the data is not production', () => {
    vi.stubEnv('VITE_APP_ENV', 'staging');
    render(<EnvironmentBanner />);

    const banner = screen.getByTestId('environment-banner');
    expect(banner).toHaveAttribute('data-environment', 'staging');
    expect(banner.textContent).toMatch(/test data/i);
    // Staging is not "development with different colours": it says what the
    // data is, because a real person can be pointed at staging by mistake.
    expect(banner.className).toContain('bg-amber-400');
  });
});
