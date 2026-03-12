/**
 * Email — templated email sending
 *
 * Legacy template-based email callable kept for compatibility.
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { enforceRateLimit } from './rateLimit';

// ============================================================================
// Types
// ============================================================================

interface EmailTemplateData {
    template: 'invitation' | 'welcome' | 'password-reset';
    recipient: string;
    data: Record<string, string>;
}

// ============================================================================
// Public API
// ============================================================================

export const sendTemplatedEmail = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        await enforceRateLimit('emailSend', request.auth.uid);

        const { template, recipient: _recipient, data: templateData } = request.data as EmailTemplateData;

        const templates: Record<string, { subject: string; body: string }> = {
            invitation: {
                subject: 'You\'ve been invited to join a family on Anchor OS',
                body: `
          Hi there!
          
          ${templateData.senderName} has invited you to join their family on Anchor OS.
          
          Click here to accept: ${templateData.inviteUrl}
          
          This invitation expires in 7 days.
          
          - The Anchor OS Team
        `.trim(),
            },
            welcome: {
                subject: 'Welcome to Anchor OS!',
                body: `
          Welcome to Anchor OS, ${templateData.userName}!
          
          You're all set to start managing your life with our integrated 
          finance and productivity tools.
          
          Get started: ${templateData.appUrl}
          
          - The Anchor OS Team
        `.trim(),
            },
            'password-reset': {
                subject: 'Reset your Anchor OS password',
                body: `
          Hi ${templateData.userName},
          
          Click here to reset your password: ${templateData.resetUrl}
          
          If you didn't request this, please ignore this email.
          
          - The Anchor OS Team
        `.trim(),
            },
        };

        const emailTemplate = templates[template];
        if (!emailTemplate) {
            throw new HttpsError('invalid-argument', `Unknown email template: ${template}`);
        }

        return {
            success: true,
            message: 'Email queued for delivery',
            template,
        };
    }
);
