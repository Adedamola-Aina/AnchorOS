// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fs = require('fs');
const gitData = require('./gitDataProvider');
const router = require('./routes/intake');

function buildRes() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
}

function getRouteHandler(method, path) {
    const layer = router.stack.find(
        (entry) =>
            entry.route &&
            entry.route.path === path &&
            entry.route.methods[method]
    );
    return layer.route.stack[0].handle;
}

describe('intake routes', () => {
    const postIntake = getRouteHandler('post', '/api/intake');
    const getNextId = getRouteHandler('get', '/api/intake/next-id');
    const getUsedIds = getRouteHandler('get', '/api/intake/used-ids');

    beforeEach(() => {
        vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ initiatives: [], lastUpdated: '2026-04-01' }));
        vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
        vi.spyOn(gitData, 'getNextId').mockResolvedValue('BUG-132');
        vi.spyOn(gitData, 'getAllUsedIds').mockResolvedValue({ BUG: new Set([3, 1, 2]), FIN: new Set([12, 10, 11]) });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('creates a new intake ticket and persists roadmap', async () => {
        const req = {
            body: {
                type: 'bug',
                title: 'New test bug',
                description: 'This is a new issue'
            }
        };
        const res = buildRes();

        await postIntake(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.ticket.id).toBe('BUG-132');
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    });

    it('rejects potential duplicate intake requests', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify({
            initiatives: [{ id: 'BUG-120', title: 'Existing', description: 'Already present' }],
            lastUpdated: '2026-04-01'
        }));
        const req = {
            body: {
                type: 'bug',
                title: 'Existing',
                description: 'Already present'
            }
        };
        const res = buildRes();

        await postIntake(req, res);

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toContain('duplicate');
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('returns 400 when required fields are missing', async () => {
        const req = { body: { type: 'bug', title: 'Missing description' } };
        const res = buildRes();

        await postIntake(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Missing required fields');
    });

    it('returns next id with mapped prefix', async () => {
        gitData.getNextId.mockResolvedValue('FIN-019');
        const req = { query: { type: 'feature' } };
        const res = buildRes();

        await getNextId(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            type: 'feature',
            prefix: 'FIN',
            nextId: 'FIN-019'
        });
    });

    it('returns used ids as sorted arrays', async () => {
        const req = { query: {} };
        const res = buildRes();

        await getUsedIds(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.usedIds.BUG).toEqual([1, 2, 3]);
        expect(res.body.usedIds.FIN).toEqual([10, 11, 12]);
    });
});
