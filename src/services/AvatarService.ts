import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAppStorage } from '../config/firebase';
import { updateUserProfile } from '../api/AuthProfileApi';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png']);

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Only JPG and PNG files are allowed');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be under 2 MB');
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
