// @ts-nocheck
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FabricPredictionsSection } from './FabricPredictionsSection';

vi.mock('../../services/telemetry', () => ({
  logProductEvent: vi.fn(),
}));

import { logProductEvent } from '../../services/telemetry';

const mockPrediction = {
  id: 'pred-1',
  type: 'budget_alert',
  message: 'You are close to your dining budget',
  confidence: 0.85,
};

describe('FabricPredictionsSection', () => {
  it('returns null when predictions array is empty', () => {
    const { container } = render(
      <FabricPredictionsSection
        predictions={[]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders prediction messages', () => {
    render(
      <FabricPredictionsSection
        predictions={[mockPrediction]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    expect(screen.getByText('You are close to your dining budget')).toBeInTheDocument();
  });

  it('renders optional detail text when provided', () => {
    render(
      <FabricPredictionsSection
        predictions={[{ ...mockPrediction, detail: 'Extra context here' }]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    expect(screen.getByText('Extra context here')).toBeInTheDocument();
  });

  it('does not render detail when not provided', () => {
    render(
      <FabricPredictionsSection
        predictions={[mockPrediction]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    expect(screen.queryByText(/Extra context/)).not.toBeInTheDocument();
  });

  it('renders a Dismiss button for each prediction', () => {
    render(
      <FabricPredictionsSection
        predictions={[mockPrediction, { ...mockPrediction, id: 'pred-2', message: 'Another alert' }]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    expect(screen.getAllByRole('button', { name: /Dismiss/i })).toHaveLength(2);
  });

  it('calls dismissPrediction with prediction id when Dismiss is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <FabricPredictionsSection
        predictions={[mockPrediction]}
        dismissPrediction={onDismiss}
        navigateTo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Dismiss/i }));
    expect(onDismiss).toHaveBeenCalledWith('pred-1');
  });

  it('logs telemetry when Dismiss is clicked', () => {
    render(
      <FabricPredictionsSection
        predictions={[mockPrediction]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Dismiss/i }));
    expect(logProductEvent).toHaveBeenCalledWith(
      'fabric_prediction_dismissed',
      expect.objectContaining({ predictionId: 'pred-1' }),
    );
  });

  it('renders the action button when prediction.action.navigateTo is set', () => {
    const predWithAction = {
      ...mockPrediction,
      action: { label: 'View Budget', navigateTo: '/finance' },
    };
    render(
      <FabricPredictionsSection
        predictions={[predWithAction]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /View Budget/i })).toBeInTheDocument();
  });

  it('calls navigateTo when action button is clicked', () => {
    const onNavigate = vi.fn();
    const predWithAction = {
      ...mockPrediction,
      action: { label: 'View Budget', navigateTo: '/finance' },
    };
    render(
      <FabricPredictionsSection
        predictions={[predWithAction]}
        dismissPrediction={vi.fn()}
        navigateTo={onNavigate}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /View Budget/i }));
    expect(onNavigate).toHaveBeenCalledWith('finance');
  });

  it('logs telemetry when action button is clicked', () => {
    const predWithAction = {
      ...mockPrediction,
      action: { label: 'View Budget', navigateTo: '/finance' },
    };
    render(
      <FabricPredictionsSection
        predictions={[predWithAction]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /View Budget/i }));
    expect(logProductEvent).toHaveBeenCalledWith(
      'fabric_prediction_actioned',
      expect.objectContaining({ predictionId: 'pred-1' }),
    );
  });

  it('does not render action button when action.navigateTo is not set', () => {
    render(
      <FabricPredictionsSection
        predictions={[mockPrediction]}
        dismissPrediction={vi.fn()}
        navigateTo={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: /View/i })).not.toBeInTheDocument();
  });

  it('does not throw when telemetry throws (telemetry error is swallowed)', () => {
    (logProductEvent as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('telemetry failure');
    });

    const onDismiss = vi.fn();
    render(
      <FabricPredictionsSection
        predictions={[mockPrediction]}
        dismissPrediction={onDismiss}
        navigateTo={vi.fn()}
      />,
    );

    expect(() => fireEvent.click(screen.getByRole('button', { name: /Dismiss/i }))).not.toThrow();
    expect(onDismiss).toHaveBeenCalledWith('pred-1');
  });
});
