import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock firebase-admin before config.ts is imported
vi.mock('firebase-admin/app', () => ({ initializeApp: vi.fn() }));
vi.mock('firebase-admin/firestore', () => ({ getFirestore: vi.fn(() => ({ mocked: true })) }));

describe('config', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    // Restore env vars after each test
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  describe('APP_URL / getAppUrl', () => {
    it('uses APP_URL env var when explicitly set', async () => {
      process.env.APP_URL = 'https://custom.example.com';
      delete process.env.GCLOUD_PROJECT;
      vi.resetModules();
      const { APP_URL } = await import('./config');

      expect(APP_URL).toBe('https://custom.example.com');
    });

    it('resolves to production URL for anchor-os project', async () => {
      delete process.env.APP_URL;
      process.env.GCLOUD_PROJECT = 'anchor-os';
      vi.resetModules();
      const { APP_URL } = await import('./config');

      expect(APP_URL).toBe('https://anchor-os.web.app');
    });

    it('resolves to staging URL for anchor-os-staging project', async () => {
      delete process.env.APP_URL;
      process.env.GCLOUD_PROJECT = 'anchor-os-staging';
      vi.resetModules();
      const { APP_URL } = await import('./config');

      expect(APP_URL).toBe('https://anchor-os-staging.web.app');
    });

    it('resolves to dev URL when project id contains "dev"', async () => {
      delete process.env.APP_URL;
      process.env.GCLOUD_PROJECT = 'anchor-os-dev-1c6ec';
      vi.resetModules();
      const { APP_URL } = await import('./config');

      expect(APP_URL).toBe('https://anchor-os-dev-1c6ec.web.app');
    });

    it('falls back to production URL for unknown project id', async () => {
      delete process.env.APP_URL;
      process.env.GCLOUD_PROJECT = 'unknown-project';
      vi.resetModules();
      const { APP_URL } = await import('./config');

      expect(APP_URL).toBe('https://anchor-os.web.app');
    });
  });

  describe('constants', () => {
    it('exports APP_ID as anchor-os', async () => {
      vi.resetModules();
      const { APP_ID } = await import('./config');
      expect(APP_ID).toBe('anchor-os');
    });

    it('exports BCRYPT_SALT_ROUNDS as 12', async () => {
      vi.resetModules();
      const { BCRYPT_SALT_ROUNDS } = await import('./config');
      expect(BCRYPT_SALT_ROUNDS).toBe(12);
    });
  });
});
