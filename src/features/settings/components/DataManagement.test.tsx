import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DataManagement } from './DataManagement';

const mockShowToast = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));

vi.mock('../../../utils/csvExport', () => ({
  downloadCsv: vi.fn(),
}));

// Mock Firestore dynamic import
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ docs: [{ id: 'doc1', data: () => ({ name: 'Test' }) }] }),
}));

vi.mock('../../../config/firebase', () => ({
  db: {},
}));

describe('DataManagement', () => {
  const defaultProps = {
    userUid: 'user-123',
    profile: { name: 'Test User' },
    onWipeData: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
  });

  it('renders export buttons', () => {
    render(<DataManagement {...defaultProps} />);
    expect(screen.getByRole('button', { name: /json/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /csv/i })).toBeInTheDocument();
  });

  it('shows wipe data in non-production', () => {
    render(<DataManagement {...defaultProps} />);
    expect(screen.getByText('Wipe All Data (Dev Only)')).toBeInTheDocument();
  });
});
