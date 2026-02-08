import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('../../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast, confirm: vi.fn().mockResolvedValue(true) }),
}));
vi.mock('../../../../utils/seeder', () => ({
  seedData: vi.fn().mockResolvedValue(undefined),
}));

const mockShowToast = vi.fn();

import { SeedDataAction, SimulateFamilyAction, FixSharedAccountsAction } from './DevToolActions';

describe('DevToolActions', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('SeedDataAction', () => {
    it('renders seed button', () => {
      render(<SeedDataAction userUid="uid1" />);
      expect(screen.getByText('Seed Data')).toBeInTheDocument();
      expect(screen.getByText(/seed test data/i)).toBeInTheDocument();
    });
  });

  describe('SimulateFamilyAction', () => {
    it('renders simulate button', () => {
      render(<SimulateFamilyAction userUid="uid1" />);
      expect(screen.getByText('Simulate')).toBeInTheDocument();
      expect(screen.getByText(/simulate family data/i)).toBeInTheDocument();
    });
  });

  describe('FixSharedAccountsAction', () => {
    it('renders fix button', () => {
      render(<FixSharedAccountsAction />);
      expect(screen.getByText('Fix Now')).toBeInTheDocument();
      expect(screen.getByText(/fix shared accounts/i)).toBeInTheDocument();
    });
  });
});
