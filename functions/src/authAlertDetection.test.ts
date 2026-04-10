import { describe, it, expect, vi } from 'vitest';
import { isNewDevice, hashUserAgent, describeDevice } from './authAlertDetection';

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ getUser: vi.fn().mockResolvedValue({ email: 'user@example.com' }) }),
}));
vi.mock('./helpers', () => ({ createAuditLog: vi.fn() }));
vi.mock('./config', () => ({
  getResend: () => ({ emails: { send: vi.fn().mockResolvedValue({ id: 'email-id' }) } }),
  EMAIL_FROM: 'Anchor OS <noreply@example.com>',
  APP_URL: 'https://anchor-os.web.app',
}));

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

  it('detects Android + Chrome', () => {
    expect(describeDevice('Mozilla/5.0 (Linux; Android 12) Chrome/100')).toBe('Android on Chrome');
  });

  it('detects Windows + Edge', () => {
    expect(describeDevice('Mozilla/5.0 (Windows NT 10.0) Edg/100')).toBe('Windows PC on Edge');
  });

  it('detects Linux + Firefox', () => {
    expect(describeDevice('Mozilla/5.0 (X11; Linux x86_64; rv:100.0) Firefox/100')).toBe('Linux PC on Firefox');
  });

  it('returns os-only when browser is unrecognised', () => {
    expect(describeDevice('Mozilla/5.0 (Mac OS X) OperaMini/7')).toBe('Mac');
  });
});
