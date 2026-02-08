import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('../../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: vi.fn() }),
}));

import { AutoAcceptInvitationAction } from './AutoAcceptAction';

describe('AutoAcceptInvitationAction', () => {
  it('renders auto-accept button and description', () => {
    render(<AutoAcceptInvitationAction userUid="uid1" />);
    expect(screen.getByText('Auto-Accept')).toBeInTheDocument();
    expect(screen.getByText(/auto-accept invitation/i)).toBeInTheDocument();
    expect(screen.getByText(/bypass email verification/i)).toBeInTheDocument();
  });
});
