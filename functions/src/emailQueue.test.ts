import { describe, expect, it, vi } from 'vitest';

const add = vi.fn().mockResolvedValue({ id: 'mail-1' });

vi.mock('./config', () => ({
  EMAIL_FROM: 'Anchor OS <noreply@example.com>',
  db: { collection: vi.fn(() => ({ add })) },
}));

import { queueEmail } from './emailQueue';

describe('queueEmail', () => {
  it('writes a Firebase Trigger Email extension message without a client-accessible path', async () => {
    await queueEmail({
      to: 'member@example.com',
      subject: 'Family invitation',
      html: '<p>Invite</p>',
    });

    expect(add).toHaveBeenCalledWith({
      to: ['member@example.com'],
      message: {
        from: 'Anchor OS <noreply@example.com>',
        subject: 'Family invitation',
        html: '<p>Invite</p>',
      },
    });
  });
});
