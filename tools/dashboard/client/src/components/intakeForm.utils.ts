import axios from 'axios';

export function getIntakeErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : 'Failed to create ticket';
  }

  const status = err.response?.status;
  const data = err.response?.data as {
    error?: string;
    duplicate?: { id?: string; title?: string; reason?: string };
  } | undefined;

  if (status === 409 && data?.duplicate?.id) {
    return `Duplicate detected: ${data.duplicate.id} - ${data.duplicate.title || 'Existing initiative'} (${data.duplicate.reason || 'overlap'}). Update that item instead of creating a new one.`;
  }

  return data?.error || err.message || 'Failed to create ticket';
}
