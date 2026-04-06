import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isNewDevice, hashUserAgent, describeDevice } from './authAlertDetection';

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ getUser: vi.fn().mockResolvedValue({ email: 'user@example.com' }) }),
}));
vi.mock('./helpers', () => ({ createAuditLog: vi.fn() }));

describe('isNewDevice', () => {
  it('returns true for first-ever sign-in (no history)', () => {
    expect(isNewDevice('ua-hash-abc', [])).toBe(true);
  });

  it('returns false when user-agent hash exists in recent events', () => {
    const recentHashes = ['ua-hash-abc', 'ua-hash-def'];
    expect(isNewDevice('ua-hash-abc', recentHashes)).toBe(false);
  });

  it('returns true when user-agent hash is not in recent events', () => {
    const recentHashes = ['ua-hash-abc', 'ua-hash-def'];
    expect(isNewDevice('ua-hash-xyz', recentHashes)).toBe(true);
  });

  it('handles empty hash gracefully', () => {
    expect(isNewDevice('', ['ua-hash-abc'])).toBe(true);
  });
});

describe('hashUserAgent', () => {
  it('returns empty string for empty input', () => {
    expect(hashUserAgent('')).toBe('');
  });

  it('returns consistent hash for same user-agent', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/100';
    expect(hashUserAgent(ua)).toBe(hashUserAgent(ua));
  });

  it('returns different hashes for different user-agents', () => {
    expect(hashUserAgent('Chrome')).not.toBe(hashUserAgent('Firefox'));
  });
});

describe('describeDevice', () => {
  it('detects Mac + Chrome', () => {
    expect(describeDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit Chrome/100')).toBe('Mac on Chrome');
  });

  it('detects iPhone + Safari', () => {
    expect(describeDevice('Mozilla/5.0 (iPhone; CPU iPhone OS) AppleWebKit Safari/604')).toBe('iPhone on Safari');
  });

  it('returns Unknown device for empty string', () => {
    expect(describeDevice('')).toBe('Unknown device');
  });
});
