
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TechnicalDetails } from './TechnicalDetails';

/**
 * UX-ST-03: the raw internal id was primary, unexplained information in the
 * Profile card. These tests assert the *defect's* shape — not just that an id
 * can be rendered.
 */
describe('TechnicalDetails (UX-ST-03)', () => {
  it('is collapsed by default, so the id is not primary information', () => {
    render(<TechnicalDetails uid="test-owner" />);

    const details = screen.getByTestId('technical-details');
    expect(details.tagName.toLowerCase()).toBe('details');
    expect(details).not.toHaveAttribute('open');
  });

  it('explains what the identifier is and what it is not', () => {
    render(<TechnicalDetails uid="test-owner" />);

    expect(screen.getByText(/support agent may ask for it/i)).toBeInTheDocument();
    expect(screen.getByText(/not a password and it does not grant access/i)).toBeInTheDocument();
  });

  it('exposes the id for copying, and reports the copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const onCopied = vi.fn();

    render(<TechnicalDetails uid="test-owner" onCopied={onCopied} />);
    fireEvent.click(screen.getByRole('button', { name: /copy account identifier/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('test-owner'));
    expect(onCopied).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when there is no id to show', () => {
    const { container } = render(<TechnicalDetails uid="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
