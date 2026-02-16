// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const { mockShowToast, mockConfirm, mockSeedData, mockWriteBatch, mockHttpsCallable } = vi.hoisted(() => {
  const mockCallable = vi.fn().mockResolvedValue({ data: { message: 'Fixed 3 accounts' } });
  return {
    mockShowToast: vi.fn(),
    mockConfirm: vi.fn().mockResolvedValue(true),
    mockSeedData: vi.fn().mockResolvedValue(undefined),
    mockWriteBatch: vi.fn(() => ({
      set: vi.fn(),
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    })),
    mockHttpsCallable: vi.fn(() => mockCallable),
  };
});

vi.mock('../../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast, confirm: mockConfirm }),
}));

vi.mock('../../../../utils/seeder', () => ({
  seedData: (...args: unknown[]) => mockSeedData(...args),
}));

vi.mock('../../../../config/firebase', () => ({
  db: {},
  APP_ID: 'anchor-os',
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'mock-doc-id' })),
  collection: vi.fn(() => 'mock-collection-ref'),
  writeBatch: mockWriteBatch,
}));
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: mockHttpsCallable,
}));

import { SeedDataAction, SimulateFamilyAction, FixSharedAccountsAction } from './DevToolActions';

describe('DevToolActions', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('SeedDataAction', () => {
    it('renders seed button', () => {
      render(<SeedDataAction userUid="uid1" />);
      expect(screen.getByText('Seed Data')).toBeInTheDocument();
      expect(screen.getByText(/seed test data/i)).toBeInTheDocument();
    });

    it('seeds data after confirmation', async () => {
      render(<SeedDataAction userUid="uid1" />);
      fireEvent.click(screen.getByText('Seed Data'));
      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalled();
        expect(mockSeedData).toHaveBeenCalledWith('uid1');
        expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('Seeding Complete'), 'success');
      });
    });

    it('does not seed when user cancels confirmation', async () => {
      mockConfirm.mockResolvedValueOnce(false);
      render(<SeedDataAction userUid="uid1" />);
      fireEvent.click(screen.getByText('Seed Data'));
      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalled();
      });
      expect(mockSeedData).not.toHaveBeenCalled();
    });

    it('shows error toast on seed failure', async () => {
      mockSeedData.mockRejectedValueOnce(new Error('Seed failed'));
      render(<SeedDataAction userUid="uid1" />);
      fireEvent.click(screen.getByText('Seed Data'));
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Error: Seed failed', 'error');
      });
    });

    it('does nothing when no userUid', async () => {
      render(<SeedDataAction userUid="" />);
      fireEvent.click(screen.getByText('Seed Data'));
      await waitFor(() => {
        expect(mockConfirm).not.toHaveBeenCalled();
      });
    });
  });

  describe('SimulateFamilyAction', () => {
    it('renders simulate button', () => {
      render(<SimulateFamilyAction userUid="uid1" />);
      expect(screen.getByText('Simulate')).toBeInTheDocument();
      expect(screen.getByText(/simulate family data/i)).toBeInTheDocument();
    });

    it('simulates family data on click', async () => {
      render(<SimulateFamilyAction userUid="uid1" />);
      fireEvent.click(screen.getByText('Simulate'));
      await waitFor(() => {
        expect(mockWriteBatch).toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('simulated'), 'success');
      });
    });

    it('shows error toast on simulation failure', async () => {
      mockWriteBatch.mockImplementationOnce(() => ({
        set: vi.fn(),
        update: vi.fn(),
        commit: vi.fn().mockRejectedValue(new Error('Batch error')),
      }));
      render(<SimulateFamilyAction userUid="uid1" />);
      fireEvent.click(screen.getByText('Simulate'));
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Simulation failed: Batch error', 'error');
      });
    });
  });

  describe('FixSharedAccountsAction', () => {
    it('renders fix button', () => {
      render(<FixSharedAccountsAction />);
      expect(screen.getByText('Fix Now')).toBeInTheDocument();
      expect(screen.getByText(/fix shared accounts/i)).toBeInTheDocument();
    });

    it('calls firebase function and shows success toast', async () => {
      render(<FixSharedAccountsAction />);
      fireEvent.click(screen.getByText('Fix Now'));
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'success');
      });
    });
  });
});
