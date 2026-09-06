import { db, EMAIL_FROM } from './config';

interface QueuedEmail {
  to: string;
  subject: string;
  html: string;
}

/** Queue transactional email for the Firebase Trigger Email extension. */
export async function queueEmail({ to, subject, html }: QueuedEmail): Promise<void> {
  await db.collection('mail').add({
    to: [to],
    message: { from: EMAIL_FROM, subject, html },
  });
}
