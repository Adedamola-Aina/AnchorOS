import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SharePermissionPicker } from './SharePermissionPicker';

const mockShowToast = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));

const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
}));

vi.mock('../../../config/firebase', () => ({
  db: {},
  APP_ID: 'test-app',
}));

describe('SharePermissionPicker', () => {
  const defaultProps = {
    accountId: 'acc-1',
    ownerUid: 'owner-1',
    sharedUid: 'shared-1',
    sharedUserName: 'Partner',
    currentPermission: 'read' as const,
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders three permission options', () => {
    render(<SharePermissionPicker {...defaultProps} />);
    expect(screen.getByText(/view only/i)).toBeInTheDocument();
    expect(screen.getByText(/transact/i)).toBeInTheDocument();
    expect(screen.getByText(/full access/i)).toBeInTheDocument();
  });

  it('highlights current permission', () => {
    render(<SharePermissionPicker {...defaultProps} currentPermission="read" />);
    // The active button should have different styling
    const viewBtn = screen.getByText(/view only/i).closest('button');
    expect(viewBtn?.className).toMatch(/white|bg-white|shadow/);
  });

  it('updates permission on click', async () => {
    render(<SharePermissionPicker {...defaultProps} />);
    fireEvent.click(screen.getByText(/transact/i).closest('button')!);
    // Should call updateDoc
    expect(mockUpdateDoc).toHaveBeenCalled();
  });

  it('does not update when clicking current permission', () => {
    render(<SharePermissionPicker {...defaultProps} currentPermission="read" />);
    fireEvent.click(screen.getByText(/view only/i).closest('button')!);
    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });
});
