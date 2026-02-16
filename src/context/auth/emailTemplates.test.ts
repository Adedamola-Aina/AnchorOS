// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { getWelcomeEmailHtml } from './emailTemplates';

describe('emailTemplates', () => {
  it('generates welcome email with user name', () => {
    const html = getWelcomeEmailHtml('John');
    expect(html).toContain('John');
    expect(html).toContain('Welcome to Anchor OS');
  });

  it('includes setup instructions', () => {
    const html = getWelcomeEmailHtml('Jane');
    expect(html).toContain('Connecting your spouse');
    expect(html).toContain('Adding your first financial account');
    expect(html).toContain('Setting up your commitment tracking');
  });

  it('wraps in styled container', () => {
    const html = getWelcomeEmailHtml('Test');
    expect(html).toContain('font-family');
    expect(html).toContain('max-width: 600px');
  });
});
