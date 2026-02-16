/**
 * Auth Email Templates
 * Extracted from AuthContext.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck


export const getWelcomeEmailHtml = (name: string): string => `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">Welcome to Anchor OS!</h2>
    <p>Hello <strong>${name}</strong>,</p>
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
`;
