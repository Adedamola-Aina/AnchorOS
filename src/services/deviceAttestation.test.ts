import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockCallable, mockIsNative } = vi.hoisted(() => ({
  mockCallable: vi.fn().mockResolvedValue({ data: { trusted: true } }),
  mockIsNative: vi.fn().mockReturnValue(false),
}));

vi.mock('firebase/functions', () => ({
  httpsCallable: () => mockCallable,
}));
vi.mock('../config/firebase', () => ({
  functions: {},
}));
vi.mock('../utils/platform', () => ({
  isNative: () => mockIsNative(),
}));

import { attestDevice, isDeviceTrusted } from './deviceAttestation';

describe('deviceAttestation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsNative.mockReturnValue(false);
  });

  describe('attestDevice', () => {
    it('returns web-appcheck for non-native platforms', async () => {
      mockIsNative.mockReturnValue(false);
      const result = await attestDevice();
      expect(result).toEqual({ trusted: true, method: 'web-appcheck' });
      expect(mockCallable).not.toHaveBeenCalled();
    });

    it('calls Cloud Function for native platforms', async () => {
      mockIsNative.mockReturnValue(true);
      mockCallable.mockResolvedValue({ data: { trusted: true } });
      const result = await attestDevice();
      expect(result).toEqual({ trusted: true, method: 'native-attestation' });
      expect(mockCallable).toHaveBeenCalled();
    });

    it('returns untrusted on CF failure for native', async () => {
      mockIsNative.mockReturnValue(true);
      mockCallable.mockRejectedValue(new Error('Network error'));
      const result = await attestDevice();
      expect(result).toEqual({ trusted: false, method: 'native-attestation', error: 'Attestation failed' });
    });
  });

  describe('isDeviceTrusted', () => {
    it('returns true for web platform (App Check covers it)', async () => {
      mockIsNative.mockReturnValue(false);
      expect(await isDeviceTrusted()).toBe(true);
    });

    it('returns true when native attestation succeeds', async () => {
      mockIsNative.mockReturnValue(true);
      mockCallable.mockResolvedValue({ data: { trusted: true } });
      expect(await isDeviceTrusted()).toBe(true);
    });

    it('returns false when native attestation fails', async () => {
      mockIsNative.mockReturnValue(true);
      mockCallable.mockRejectedValue(new Error('fail'));
      expect(await isDeviceTrusted()).toBe(false);
    });
  });
});
