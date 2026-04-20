// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { NotificationProvider } from './NotificationContext';
import { NotificationContext } from './NotificationContextDefinition';

vi.mock('../config/firebase', () => ({
  messaging: {},
  db: {},
  auth: { currentUser: { uid: 'u1' } },
  APP_ID: 'test-app',
}));
vi.mock('firebase/messaging', () => ({
  getToken: vi.fn(),
  onMessage: vi.fn(() => vi.fn()),
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'd' })),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => 'ts'),
}));
vi.mock('../services/fcmTokenService', () => ({
  getFcmTokenWithRetry: vi.fn().mockResolvedValue(null),
}));
vi.mock('../utils/error', () => ({ captureError: vi.fn() }));

global.Notification = { requestPermission: vi.fn(), permission: 'default' } as any;

function withContext(render: (ctx: any) => React.ReactNode) {
  return (
    <NotificationProvider>
      <NotificationContext.Consumer>{render}</NotificationContext.Consumer>
    </NotificationProvider>
  );
}

describe('NotificationContext — toast & confirm flows', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('showToast renders info, success, and error variants', () => {
    let ctx: any;
    render(withContext((c) => { ctx = c; return null; }));

    act(() => ctx.showToast('Hello world', 'info'));
    expect(screen.getByText('Hello world')).toBeDefined();

    act(() => ctx.showToast('Saved', 'success'));
    expect(screen.getByText('Saved')).toBeDefined();

    act(() => ctx.showToast('Broken', 'error'));
    expect(screen.getByText('Broken')).toBeDefined();
  });

  it('showToast auto-dismisses after 5s', () => {
    let ctx: any;
    render(withContext((c) => { ctx = c; return null; }));

    act(() => ctx.showToast('Temporary'));
    expect(screen.getByText('Temporary')).toBeDefined();

    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.queryByText('Temporary')).toBeNull();
  });

  it('confirm resolves true when user confirms', async () => {
    vi.useRealTimers();
    let ctx: any;
    render(withContext((c) => { ctx = c; return null; }));

    let result: Promise<boolean>;
    act(() => {
      result = ctx.confirm({ title: 'Delete?', message: 'Are you sure?', confirmText: 'Yes' });
    });

    const yes = await screen.findByRole('button', { name: 'Yes' });
    fireEvent.click(yes);
    await expect(result!).resolves.toBe(true);
  });

  it('confirm resolves false when user cancels', async () => {
    vi.useRealTimers();
    let ctx: any;
    render(withContext((c) => { ctx = c; return null; }));

    let result: Promise<boolean>;
    act(() => {
      result = ctx.confirm({ title: 'Delete?', message: 'Really?' });
    });

    const cancel = await screen.findByRole('button', { name: /cancel/i });
    fireEvent.click(cancel);
    await expect(result!).resolves.toBe(false);
  });

  it('toast dismiss button removes a single toast', async () => {
    vi.useRealTimers();
    let ctx: any;
    render(withContext((c) => { ctx = c; return null; }));

    act(() => ctx.showToast('Keep me briefly', 'info'));
    const dismiss = document.querySelector('button.ml-auto') as HTMLButtonElement;
    expect(dismiss).toBeTruthy();
    fireEvent.click(dismiss);
    expect(screen.queryByText('Keep me briefly')).toBeNull();
  });
});
