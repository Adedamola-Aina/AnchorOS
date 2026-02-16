"use strict";
/**
 * Email — templated email sending
 *
 * Legacy template-based email callable kept for compatibility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTemplatedEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const rateLimit_1 = require("./rateLimit");
// ============================================================================
// Public API
// ============================================================================
exports.sendTemplatedEmail = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    await (0, rateLimit_1.enforceRateLimit)('emailSend', request.auth.uid);
    const { template, recipient, data: templateData } = request.data;
    const templates = {
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
        throw new https_1.HttpsError('invalid-argument', `Unknown email template: ${template}`);
    }
    console.log('Email to send:', {
        to: recipient,
        subject: emailTemplate.subject,
        body: emailTemplate.body,
    });
    return {
        success: true,
        message: 'Email queued for delivery',
        template,
        recipient,
    };
});
//# sourceMappingURL=email.js.map