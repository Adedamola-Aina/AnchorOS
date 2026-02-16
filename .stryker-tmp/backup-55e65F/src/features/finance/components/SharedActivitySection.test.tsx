import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('./ActivityFeed', () => ({
  ActivityFeed: ({ activities }: any) => <div data-testid="activity-feed">{activities.length} activities</div>,
}));

import { SharedActivitySection } from './SharedActivitySection';

describe('SharedActivitySection', () => {
  it('renders heading with Shared label', () => {
    render(<SharedActivitySection activities={[]} currentUserId="u1" loading={false} />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Shared')).toBeInTheDocument();
  });

  it('passes activities to ActivityFeed', () => {
    const activities = [{ id: '1', type: 'transaction_added', performedBy: 'u2', timestamp: new Date().toISOString() }] as any[];
    render(<SharedActivitySection activities={activities} currentUserId="u1" loading={false} />);
    expect(screen.getByTestId('activity-feed')).toHaveTextContent('1 activities');
  });
});
