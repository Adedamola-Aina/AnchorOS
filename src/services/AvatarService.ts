import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAppStorage } from '../config/firebase';
import { updateUserProfile } from '../api/AuthProfileApi';

const MAX_BYTES = 5 * 1024 * 1024;

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are supported');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be under 5 MB');
  }

  const storage = getAppStorage();
  const storageRef = ref(storage, `avatars/${userId}/avatar`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await updateUserProfile(userId, { photoURL: url });
  return url;
}

export async function deleteAvatar(userId: string): Promise<void> {
  const storage = getAppStorage();
  const storageRef = ref(storage, `avatars/${userId}/avatar`);
  try {
    await deleteObject(storageRef);
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code !== 'storage/object-not-found') throw err;
  }
  await updateUserProfile(userId, { photoURL: undefined });
}
