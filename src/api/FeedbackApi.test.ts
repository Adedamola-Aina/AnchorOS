import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createFeedbackBackup } from './FeedbackApi';

const mockCallable = vi.fn();
const mockHttpsCallable = vi.fn();

vi.mock('firebase/functions', () => ({
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

vi.mock('../config/firebase', () => ({
  functions: {},
}));

describe('FeedbackApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCallable.mockResolvedValue(undefined);
    mockHttpsCallable.mockReturnValue(mockCallable);
  });

  it('calls the submitFeedback Cloud Function with the provided payload', async () => {
    const payload = {
      subject: 'Bug Report',
      message: 'App crashed on Finance page',
      name: 'Test User',
      email: 'test@anchor-os.com',
      userId: 'user-123',
      appVersion: '1.2.3',
      deviceType: 'mobile',
      platform: 'web',
      currentPage: '/finance',
      timestamp: '2026-01-01T00:00:00.000Z',
    };

    await createFeedbackBackup(payload);

    expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), 'submitFeedback');
    expect(mockCallable).toHaveBeenCalledWith(payload);
  });

  it('invokes submitFeedback callable with all required payload fields present', async () => {
    const payload = {
      subject: 'Feature Request',
      message: 'Please add dark mode',
      name: 'Alice',
      email: 'alice@example.com',
      userId: 'user-456',
      appVersion: '2.0.0',
      deviceType: 'desktop',
      platform: 'web',
      currentPage: '/dashboard',
      timestamp: '2026-03-17T10:00:00.000Z',
    };

    await createFeedbackBackup(payload);

    const calledWith = mockCallable.mock.calls[0][0] as typeof payload;
    expect(calledWith.subject).toBe('Feature Request');
    expect(calledWith.userId).toBe('user-456');
    expect(calledWith.currentPage).toBe('/dashboard');
  });

  it('resolves without throwing when the callable succeeds', async () => {
    const payload = {
      subject: 'Test',
      message: 'Test message',
      name: 'Tester',
      email: 'tester@anchor-os.com',
      userId: 'user-789',
      appVersion: '1.0.0',
      deviceType: 'mobile',
      platform: 'android',
      currentPage: '/commitments',
      timestamp: '2026-01-01T00:00:00.000Z',
    };

    await expect(createFeedbackBackup(payload)).resolves.toBeUndefined();
  });

  it('propagates errors thrown by the Cloud Function callable', async () => {
    mockCallable.mockRejectedValue(new Error('Cloud Function error'));

    const payload = {
      subject: 'Error Test',
      message: 'Should propagate',
      name: 'Tester',
      email: 'tester@anchor-os.com',
      userId: 'user-err',
      appVersion: '1.0.0',
      deviceType: 'mobile',
      platform: 'web',
      currentPage: '/settings',
      timestamp: '2026-01-01T00:00:00.000Z',
    };

    await expect(createFeedbackBackup(payload)).rejects.toThrow('Cloud Function error');
  });
});
