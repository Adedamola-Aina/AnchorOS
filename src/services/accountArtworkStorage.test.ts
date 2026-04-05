import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveAccountArtworkUrl, uploadAccountArtwork } from './accountArtworkStorage';

const mockRef = vi.fn();
const mockUploadBytes = vi.fn();
const mockGetBytes = vi.fn();
const mockGetAppStorage = vi.fn();

vi.mock('firebase/storage', () => ({
  ref: (...args: unknown[]) => mockRef(...args),
  uploadBytes: (...args: unknown[]) => mockUploadBytes(...args),
  getBytes: (...args: unknown[]) => mockGetBytes(...args),
}));

vi.mock('../config/firebase', () => ({
  getAppStorage: () => mockGetAppStorage(),
}));

describe('uploadAccountArtwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAppStorage.mockReturnValue({ bucket: 'test-bucket' });
    mockRef.mockReturnValue({ fullPath: 'artwork-path' });
    mockUploadBytes.mockResolvedValue(undefined);
    mockGetBytes.mockResolvedValue(new Uint8Array([1, 2, 3]));
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:artwork-preview'),
      revokeObjectURL: vi.fn(),
    });
  });

  it('uploads image artwork into the anchored account path and returns its storage path', async () => {
    const file = new File(['image'], 'card art.png', { type: 'image/png' });

    const result = await uploadAccountArtwork('owner-1', 'acc-1', file);

    expect(mockRef).toHaveBeenCalledWith(
      { bucket: 'test-bucket' },
      expect.stringMatching(/^artifacts\/anchor-os\/users\/owner-1\/accounts\/acc-1\/artwork\//),
    );
    expect(mockUploadBytes).toHaveBeenCalledWith(
      { fullPath: 'artwork-path' },
      file,
      expect.objectContaining({ contentType: 'image/png' }),
    );
    expect(result).toBe('artwork-path');
  });

  it('resolves a stored artwork path into an authenticated blob URL', async () => {
    const result = await resolveAccountArtworkUrl({
      cardArtworkPath: 'artifacts/anchor-os/users/owner-1/accounts/acc-1/artwork/card.png',
    });

    expect(mockRef).toHaveBeenCalledWith(
      { bucket: 'test-bucket' },
      'artifacts/anchor-os/users/owner-1/accounts/acc-1/artwork/card.png',
    );
    expect(mockGetBytes).toHaveBeenCalledWith({ fullPath: 'artwork-path' });
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(result).toBe('blob:artwork-preview');
  });

  it('falls back to an existing legacy artwork URL when no storage path is present', async () => {
    const result = await resolveAccountArtworkUrl({
      cardArtwork: 'https://example.com/artwork.png',
    });

    expect(mockGetBytes).not.toHaveBeenCalled();
    expect(result).toBe('https://example.com/artwork.png');
  });

  it('rejects non-image files', async () => {
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' });

    await expect(uploadAccountArtwork('owner-1', 'acc-1', file)).rejects.toThrow(/only image files/i);
    expect(mockUploadBytes).not.toHaveBeenCalled();
  });
});