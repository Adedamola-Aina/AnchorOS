import { getBytes, ref, uploadBytes } from 'firebase/storage';
import { getAppStorage } from '../config/firebase';
import type { AnchorAccount } from '../types';

const MAX_ARTWORK_SIZE_BYTES = 5 * 1024 * 1024;

type ArtworkSource = Pick<AnchorAccount, 'cardArtwork' | 'cardArtworkPath'>;

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]+/g, '-').replace(/-+/g, '-');
}

function isLegacyArtworkUrl(value: string | undefined): boolean {
  return Boolean(value && /^(https?:|blob:|data:)/i.test(value));
}

function validateArtworkFile(file: File): void {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded for card artwork.');
  }

  if (file.size > MAX_ARTWORK_SIZE_BYTES) {
    throw new Error('Card artwork must be 5 MB or smaller.');
  }
}

export async function uploadAccountArtwork(
  userId: string,
  accountId: string,
  file: File,
): Promise<string> {
  validateArtworkFile(file);

  const artworkRef = ref(
    getAppStorage(),
    `artifacts/anchor-os/users/${userId}/accounts/${accountId}/artwork/${Date.now()}-${sanitizeFileName(file.name)}`,
  );

  await uploadBytes(artworkRef, file, {
    contentType: file.type,
    customMetadata: {
      userId,
      accountId,
    },
  });

  return artworkRef.fullPath;
}

export async function resolveAccountArtworkUrl(source: ArtworkSource): Promise<string | undefined> {
  if (source.cardArtworkPath) {
    const bytes = await getBytes(ref(getAppStorage(), source.cardArtworkPath));
    return URL.createObjectURL(new Blob([bytes]));
  }

  return isLegacyArtworkUrl(source.cardArtwork) ? source.cardArtwork : undefined;
}

export function revokeAccountArtworkUrl(artworkUrl: string | undefined): void {
  if (artworkUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(artworkUrl);
  }
}