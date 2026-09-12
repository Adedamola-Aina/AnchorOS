// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DataManagement } from './DataManagement';

const { mockShowToast, mockDownloadCsv, mockGetDocs } = vi.hoisted(() => ({
  mockShowToast: vi.fn(),
  mockDownloadCsv: vi.fn(),
  mockGetDocs: vi.fn().mockResolvedValue({ docs: [{ id: 'doc1', data: () => ({ name: 'Test' }) }] }),
}));

vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));

vi.mock('../../../utils/csvExport', () => ({
  downloadCsv: mockDownloadCsv,
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
}));

vi.mock('../../../config/firebase', () => ({
  db: {},
  APP_ID: 'anchor-os',
}));

describe('DataManagement', () => {
  const defaultProps = {
    userUid: 'user-123',
    profile: { name: 'Test User' } as never,
    onWipeData: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
  });

  it('renders export buttons', () => {
    render(<DataManagement {...defaultProps} />);
    expect(screen.getByRole('button', { name: /json/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /csv/i })).toBeInTheDocument();
  });

  it('shows the destructive wipe control in local development only', () => {
    vi.stubEnv('VITE_APP_ENV', 'development');
    render(<DataManagement {...defaultProps} />);
    expect(screen.getByText('Wipe All Data (Dev Only)')).toBeInTheDocument();
  });

  it('never shows the destructive wipe control in staging or production', () => {
    for (const env of ['staging', 'production']) {
      vi.stubEnv('VITE_APP_ENV', env);
      const { unmount } = render(<DataManagement {...defaultProps} />);
      expect(screen.queryByText('Wipe All Data (Dev Only)')).not.toBeInTheDocument();
      unmount();
    }
  });

  it('renders data management heading', () => {
    render(<DataManagement {...defaultProps} />);
    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText(/export personal data/i)).toBeInTheDocument();
  });

  it('exports JSON when button clicked', async () => {
    render(<DataManagement {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /json/i }));
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Data export started.', 'success');
    });
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('exports CSV when button clicked', async () => {
    render(<DataManagement {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /csv/i }));
    await waitFor(() => {
      expect(mockDownloadCsv).toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith('CSV export started.', 'success');
    });
  });

  it('shows error toast when JSON export fails', async () => {
    mockGetDocs.mockRejectedValueOnce(new Error('Network error'));
    render(<DataManagement {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /json/i }));
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Export failed: Network error', 'error');
    });
  });

  it('shows error toast when CSV export fails', async () => {
    mockDownloadCsv.mockImplementationOnce(() => { throw new Error('CSV error'); });
    render(<DataManagement {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /csv/i }));
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('CSV export failed: CSV error', 'error');
    });
  });

  it('calls onWipeData when wipe button clicked', async () => {
    vi.stubEnv('VITE_APP_ENV', 'development');
    render(<DataManagement {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /wipe data/i }));
    expect(defaultProps.onWipeData).toHaveBeenCalled();
  });
});
