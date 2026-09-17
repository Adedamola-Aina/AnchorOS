import { describe, expect, it, vi } from 'vitest';

vi.mock('./config', () => ({ APP_URL: 'https://example.test' }));

import { buildInvitationEmail } from './invitationEmailBuilder';

/**
 * RA-02 (#146): invitation email must not emit user-controlled markup.
 */
describe('buildInvitationEmail', () => {
    it('escapes a malicious owner display name', () => {
        const html = buildInvitationEmail('<img src=x onerror=alert(1)>', 'invite-id', '123456');

        expect(html).not.toContain('<img src=x');
        expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    });

    it('escapes script-capable characters in the owner name', () => {
        const html = buildInvitationEmail('A" onmouseover="x', 'invite-id', '123456');

        expect(html).not.toContain('onmouseover="x');
        expect(html).toContain('&quot;');
    });

    it('URL-encodes the invitation id in the accept link', () => {
        const html = buildInvitationEmail('Alice', 'a/b?c=d&e', '123456');

        expect(html).toContain('https://example.test/accept-invite?token=a%2Fb%3Fc%3Dd%26e');
    });

    it('escapes the verification code defensively', () => {
        const html = buildInvitationEmail('Alice', 'invite-id', '<b>123456</b>');

        expect(html).not.toContain('<b>123456</b>');
        expect(html).toContain('&lt;b&gt;123456&lt;/b&gt;');
    });

    it('renders a benign invitation unchanged', () => {
        const html = buildInvitationEmail("Ada O'Hara", 'invite-id', '123456');

        expect(html).toContain("Ada O&#39;Hara");
        expect(html).toContain('https://example.test/accept-invite?token=invite-id');
    });
});
