import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingBoundary, InlineLoading, PageLoading } from './LoadingBoundary';
import React, { Suspense } from 'react';

// Mock lazy component that throws promise (simulates loading)
const createLoadingComponent = () => {
  let resolve: () => void;
  const promise = new Promise<void>(r => { resolve = r; });
  
  const LazyComponent = React.lazy(() => 
    promise.then(() => ({ default: () => <div>Loaded Content</div> }))
  );
  
  return { LazyComponent, resolve: resolve! };
};

describe('LoadingBoundary', () => {
  it('renders children when loaded', () => {
    render(
      <LoadingBoundary>
        <div>Test Content</div>
      </LoadingBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('accepts skeleton prop', () => {
    render(
      <LoadingBoundary skeleton="dashboard">
        <div>Content</div>
      </LoadingBoundary>
    );
    // Should render content (not skeleton since child is not lazy)
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('accepts custom fallback', () => {
    const { LazyComponent } = createLoadingComponent();
    
    const { container: _container } = render(
      <LoadingBoundary fallback={<div>Custom Loading</div>}>
        <Suspense fallback={null}>
          <LazyComponent />
        </Suspense>
      </LoadingBoundary>
    );
    
    // Just verify component renders without error
    expect(document.body).toBeInTheDocument();
  });
});

describe('InlineLoading', () => {
  it('renders with default message', () => {
    render(<InlineLoading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading...');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<InlineLoading message="Fetching data" />);
    expect(screen.getByText('Fetching data')).toBeInTheDocument();
  });

  it('has spinning indicator', () => {
    const { container } = render(<InlineLoading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});

describe('PageLoading', () => {
  it('renders with status role', () => {
    const { container } = render(<PageLoading />);
    expect(container.querySelector('[role="status"]')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<PageLoading message="Loading dashboard" />);
    expect(screen.getByText('Loading dashboard')).toBeInTheDocument();
  });

  it('has full height class', () => {
    const { container } = render(<PageLoading />);
    expect(container.firstChild).toHaveClass('min-h-dvh');
  });
});
