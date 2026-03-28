// @ts-nocheck
/** ID allocation — checks git history + roadmap.json to prevent collisions. */

const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const { ID_PATTERNS } = require('./constants');

const git = simpleGit(path.join(__dirname, '../../../..'));

async function getAllUsedIds() {
    const usedIds = {};

    try {
        const log = await git.log({ maxCount: 500 });
        for (const commit of log.all) {
            for (const [type, pattern] of Object.entries(ID_PATTERNS)) {
                const matches = commit.message.matchAll(pattern);
                for (const match of matches) {
                    const prefix = type.toUpperCase();
                    const num = parseInt(match[1]);
                    if (!usedIds[prefix]) usedIds[prefix] = new Set();
                    usedIds[prefix].add(num);
                }
            }
        }
    } catch (e) {
        console.error('[getAllUsedIds] Error reading git:', e.message);
    }

    try {
        const roadmapPath = path.join(__dirname, '../roadmap.json');
        const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
        for (const item of roadmapData.initiatives) {
            const match = item.id.match(/^([A-Z]+)-(\d+)$/);
            if (match) {
                const prefix = match[1];
                const num = parseInt(match[2]);
                if (!usedIds[prefix]) usedIds[prefix] = new Set();
                usedIds[prefix].add(num);
            }
        }
    } catch (e) {
        console.error('[getAllUsedIds] Error reading roadmap:', e.message);
    }

    return usedIds;
}

async function getNextId(prefix) {
    const usedIds = await getAllUsedIds();
    const usedNumbers = usedIds[prefix.toUpperCase()] || new Set();
    const maxNum = usedNumbers.size > 0 ? Math.max(...usedNumbers) : 0;
    return `${prefix.toUpperCase()}-${String(maxNum + 1).padStart(3, '0')}`;
}

module.exports = { getAllUsedIds, getNextId };
