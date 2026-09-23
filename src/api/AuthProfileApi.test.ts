
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  subscribeToProfile,
  updateUserProfile,
  createUserProfile,
  queueWelcomeEmail,
} from './AuthProfileApi';
import type { UserProfile } from '../types';

const addDoc = vi.fn();
const collection = vi.fn();
const doc = vi.fn();
const onSnapshot = vi.fn();
const setDoc = vi.fn();
const updateDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => addDoc(...args),
  collection: (...args: unknown[]) => collection(...args),
  doc: (...args: unknown[]) => doc(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
  setDoc: (...args: unknown[]) => setDoc(...args),
  updateDoc: (...args: unknown[]) => updateDoc(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('AuthProfileApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    addDoc.mockResolvedValue({ id: 'mail-doc-id' });
    setDoc.mockResolvedValue(undefined);
    updateDoc.mockResolvedValue(undefined);
    onSnapshot.mockReturnValue(() => {}); // unsubscribe fn
  });

  describe('subscribeToProfile', () => {
    it('calls onSnapshot with the user document reference', () => {
      const onNext = vi.fn();
      subscribeToProfile('user-1', onNext);

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1',
      );
      expect(onSnapshot).toHaveBeenCalledTimes(1);
    });

    it('passes onNext directly to onSnapshot as callback', () => {
      const onNext = vi.fn();
      subscribeToProfile('user-1', onNext);

      expect(onSnapshot).toHaveBeenCalledWith(expect.any(Object), onNext);
    });

    it('returns the unsubscribe function', () => {
      const unsub = vi.fn();
      onSnapshot.mockReturnValue(unsub);

      const result = subscribeToProfile('user-1', vi.fn());
      expect(result).toBe(unsub);
    });
  });

  describe('updateUserProfile', () => {
    it('calls updateDoc with the partial profile updates', async () => {
      await updateUserProfile('user-1', { name: 'New Name' });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { name: 'New Name' },
      );
    });

    it('uses the correct user document path', async () => {
      await updateUserProfile('user-1', { timezone: 'Africa/Lagos' });

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1',
      );
    });
  });

  describe('createUserProfile', () => {
    it('calls setDoc with the full profile data', async () => {
      const profileData: UserProfile = { name: 'New User', familyMode: false, theme: 'light' };
      await createUserProfile('user-1', profileData);

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        profileData,
      );
    });

    it('uses the correct user document path', async () => {
      await createUserProfile('user-1', {} as unknown as UserProfile);

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1',
      );
    });
  });

  describe('queueWelcomeEmail', () => {
    it('adds a document to the mail collection', async () => {
      await queueWelcomeEmail('test@example.com', '<p>Welcome</p>');

      expect(addDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          to: ['test@example.com'],
          message: expect.objectContaining({ html: '<p>Welcome</p>', subject: 'Welcome to Anchor OS!' }),
        }),
      );
    });

    it('targets the mail collection (not the user artifacts path)', async () => {
      await queueWelcomeEmail('test@example.com', '<p>Hello</p>');

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'mail',
      );
    });
  });
});
