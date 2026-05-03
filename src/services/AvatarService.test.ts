import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/firebase', () => ({
  getAppStorage: vi.fn(() => ({})),
  app: {},
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
}));

vi.mock('../api/AuthProfileApi', () => ({
  updateUserProfile: vi.fn(),
}));

import * as firebaseStorage from 'firebase/storage';
import { updateUserProfile } from '../api/AuthProfileApi';
import { uploadAvatar, deleteAvatar } from './AvatarService';

const mockRef = { fullPath: 'avatars/user123/avatar' };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(firebaseStorage.ref).mockReturnValue(mockRef as ReturnType<typeof firebaseStorage.ref>);
  vi.mocked(firebaseStorage.uploadBytes).mockResolvedValue({ ref: mockRef } as unknown as Awaited<ReturnType<typeof firebaseStorage.uploadBytes>>);
  vi.mocked(firebaseStorage.getDownloadURL).mockResolvedValue('https://firebasestorage.example.com/avatar.jpg');
  vi.mocked(updateUserProfile).mockResolvedValue(undefined);
});

describe('uploadAvatar', () => {
  it('uploads file, gets download URL, and saves to profile', async () => {
    const file = new File(['img'], 'photo.png', { type: 'image/png' });
    const url = await uploadAvatar('user123', file);

    expect(firebaseStorage.ref).toHaveBeenCalled();
    expect(firebaseStorage.uploadBytes).toHaveBeenCalledWith(mockRef, file);
    expect(firebaseStorage.getDownloadURL).toHaveBeenCalledWith(mockRef);
    expect(updateUserProfile).toHaveBeenCalledWith('user123', { photoURL: url });
    expect(url).toBe('https://firebasestorage.example.com/avatar.jpg');
  });

  it('throws if file exceeds 5 MB', async () => {
    const big = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    await expect(uploadAvatar('user123', big)).rejects.toThrow('Image must be under 5 MB');
    expect(firebaseStorage.uploadBytes).not.toHaveBeenCalled();
  });

  it('throws if file type is not an image', async () => {
    const doc = new File(['data'], 'resume.pdf', { type: 'application/pdf' });
    await expect(uploadAvatar('user123', doc)).rejects.toThrow('Only image files are supported');
    expect(firebaseStorage.uploadBytes).not.toHaveBeenCalled();
  });

  it('propagates storage upload errors', async () => {
    vi.mocked(firebaseStorage.uploadBytes).mockRejectedValue(new Error('quota exceeded'));
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    await expect(uploadAvatar('user123', file)).rejects.toThrow('quota exceeded');
  });
});

describe('deleteAvatar', () => {
  it('deletes storage object and clears photoURL in profile', async () => {
    vi.mocked(firebaseStorage.deleteObject).mockResolvedValue(undefined);
    await deleteAvatar('user123');

    expect(firebaseStorage.ref).toHaveBeenCalled();
    expect(firebaseStorage.deleteObject).toHaveBeenCalledWith(mockRef);
    expect(updateUserProfile).toHaveBeenCalledWith('user123', { photoURL: undefined });
  });

  it('still clears Firestore photoURL when storage object is already gone (404)', async () => {
    const notFoundErr = Object.assign(new Error('not found'), { code: 'storage/object-not-found' });
    vi.mocked(firebaseStorage.deleteObject).mockRejectedValue(notFoundErr);
    await deleteAvatar('user123');
    expect(updateUserProfile).toHaveBeenCalledWith('user123', { photoURL: undefined });
  });
});
