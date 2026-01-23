/**
 * Email Templates
 * 
 * Centralized email templates for Anchor OS.
 * These templates are used by AuthContext and Cloud Functions.
 */

interface WelcomeEmailData {
    name: string;
}

interface InvitationEmailData {
    ownerName: string;
    inviteeEmail: string;
    verificationCode: string;
    acceptUrl: string;
}

interface PasswordResetEmailData {
    name: string;
    resetUrl: string;
}

export const emailTemplates = {
    welcome: (data: WelcomeEmailData): string => `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Anchor OS!</h2>
            <p>Hello <strong>${data.name}</strong>,</p>
            <p>We're thrilled to have you on board! Anchor OS is designed to help you organize your financial and family life with intentionality.</p>
            <p><strong>Get started by:</strong></p>
            <ul>
                <li>Connecting your spouse (via Settings)</li>
                <li>Adding your first financial account</li>
                <li>Setting up your commitment tracking</li>
            </ul>
            <p>If you have any questions, just reply to this email.</p>
            <p>Welcome home,<br/>The Anchor OS Team</p>
        </div>
    `,

    invitation: (data: InvitationEmailData): string => `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6366f1;">Family Invitation from ${data.ownerName}</h2>
            <p>Hello,</p>
            <p><strong>${data.ownerName}</strong> has invited you to connect on Anchor OS.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #6b7280;">Your Verification Code:</p>
                <p style="font-size: 32px; letter-spacing: 4px; font-weight: bold; color: #1f2937; margin: 10px 0;">
                    ${data.verificationCode}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">This code expires in 24 hours</p>
            </div>
            <p style="text-align: center;">
                <a href="${data.acceptUrl}" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Accept Invitation
                </a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                If you did not expect this invitation, you can safely ignore this email.
            </p>
        </div>
    `,

    passwordReset: (data: PasswordResetEmailData): string => `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ef4444;">Password Reset Request</h2>
            <p>Hello ${data.name},</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" 
                   style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Reset Password
                </a>
            </p>
            <p style="color: #6b7280; font-size: 12px;">
                This link expires in 1 hour. If you didn't request this, please ignore this email.
            </p>
            <p>Best,<br/>The Anchor OS Team</p>
        </div>
    `
};

export const emailSubjects = {
    welcome: 'Welcome to Anchor OS!',
    invitation: (ownerName: string) => `${ownerName} invited you to Anchor OS`,
    passwordReset: 'Reset Your Password'
};
