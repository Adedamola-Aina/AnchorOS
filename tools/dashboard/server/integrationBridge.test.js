// @ts-nocheck
import { describe, it, expect, beforeEach } from 'vitest';
import { createRequire } from 'node:module';
import { createHmac } from 'node:crypto';

const require = createRequire(import.meta.url);
const integrationBridge = require('./integrationBridge');
const eventIngestion = require('./eventIngestion');

describe('integrationBridge', () => {
    beforeEach(() => {
        eventIngestion.resetEvents();
        delete process.env.JIRA_WEBHOOK_SECRET;
        delete process.env.ASANA_WEBHOOK_SECRET;
        delete process.env.INTEGRATION_WEBHOOK_ENFORCE_SECRET;
    });

    it('normalizes Jira webhook payloads and emits ingestion events', () => {
        const payload = {
            webhookEvent: 'jira:issue_updated',
            issue: {
                key: 'ENG-321',
                fields: {
                    summary: 'BUG-321: resolve transfer rounding drift',
                    status: { name: 'In Progress' }
                }
            }
        };

        const result = integrationBridge.ingestWebhook('jira', payload, { ip: '127.0.0.1' });

        expect(result.provider).toBe('jira');
        expect(result.normalized.workItemId).toBe('BUG-321');
        expect(result.event.source).toBe('integration:jira');
    });

    it('supports dry-run sync mode without provider credentials', async () => {
        const result = await integrationBridge.syncProvider('asana', {
            mode: 'dry-run',
            items: [{ id: 'BUG-101' }, { id: 'FIN-002' }]
        });

        expect(result.provider).toBe('asana');
        expect(result.status).toBe('not-configured');
        expect(result.skipped).toBe(2);
    });

    it('rejects webhook ingestion when provider secret is configured but request is unsigned', () => {
        process.env.JIRA_WEBHOOK_SECRET = 'jira-secret';

        expect(() => {
            integrationBridge.ingestWebhook('jira', {
                webhookEvent: 'jira:issue_updated',
                issue: {
                    key: 'ENG-110',
                    fields: { summary: 'BUG-110: broken webhook auth' }
                }
            }, { headers: {} });
        }).toThrow(/Unauthorized webhook request/);
    });

    it('accepts webhook ingestion with matching shared secret header', () => {
        process.env.JIRA_WEBHOOK_SECRET = 'jira-secret';

        const result = integrationBridge.ingestWebhook('jira', {
            webhookEvent: 'jira:issue_updated',
            issue: {
                key: 'ENG-111',
                fields: { summary: 'BUG-111: webhook secret passes' }
            }
        }, {
            headers: { 'x-integration-secret': 'jira-secret' }
        });

        expect(result.provider).toBe('jira');
        expect(result.event.status).toBe('received');
    });

    it('accepts webhook ingestion with valid HMAC signature header', () => {
        process.env.ASANA_WEBHOOK_SECRET = 'asana-secret';

        const payload = {
            events: [{ action: 'changed', resource: { gid: '123', name: 'FEAT-201 tighten webhook guardrails' } }]
        };
        const rawBody = JSON.stringify(payload);
        const signature = createHmac('sha256', 'asana-secret').update(rawBody).digest('hex');

        const result = integrationBridge.ingestWebhook('asana', payload, {
            rawBody,
            headers: { 'x-integration-signature': `sha256=${signature}` }
        });

        expect(result.provider).toBe('asana');
        expect(result.normalized.workItemId).toBe('FEAT-201');
    });
});
