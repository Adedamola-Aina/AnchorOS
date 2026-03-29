import { secureDb } from '../../../utils/secureDb';
import type { UserPattern } from '../../../types';

interface FabricBehaviorState {
    confirmedPatterns?: UserPattern[];
    patterns?: UserPattern[];
}

export interface PatternKnowledgeSummary {
    patternCount: number;
    patternGroups: number;
}

export function summarizePatternKnowledge(behavior: FabricBehaviorState | null): PatternKnowledgeSummary {
    const confirmed = behavior?.confirmedPatterns ?? [];
    const pending = behavior?.patterns ?? [];
    const all = [...confirmed, ...pending];
    const groups = new Set(
        all.map((pattern) => {
            const triggerType = pattern.trigger?.type ?? 'unknown_trigger';
            const actionType = pattern.followUpAction?.type ?? 'unknown_action';
            const triggerCategory = 'category' in pattern.trigger ? pattern.trigger.category ?? '' : '';
            const actionCategory = 'category' in pattern.followUpAction ? pattern.followUpAction.category ?? '' : '';
            return `${triggerType}|${actionType}|${triggerCategory}|${actionCategory}`;
        })
    );
    return { patternCount: all.length, patternGroups: groups.size };
}

export async function loadPatternKnowledge(userId: string): Promise<PatternKnowledgeSummary> {
    const behavior = await secureDb.getDocument<FabricBehaviorState>(userId, ['fabric_behavior', 'state']);
    return summarizePatternKnowledge(behavior);
}

export async function clearPatternKnowledge(userId: string, now: string): Promise<void> {
    await secureDb.setDocument(userId, ['fabric_behavior', 'state'], {
        patterns: [],
        confirmedPatterns: [],
        recentActions: [],
        dismissedPatterns: [],
        updatedAt: now,
    });
}

export async function clearAllAnchorAIData(userId: string, now: string, enabled: boolean): Promise<void> {
    await Promise.all([
        clearPatternKnowledge(userId, now),
        secureDb.setDocument(userId, ['fabric_predictions', 'state'], {
            active: [],
            updatedAt: now,
        }),
        secureDb.setDocument(userId, ['fabric_settings', 'state'], {
            enabled,
            dataCollectionEnabled: enabled,
            lastCleared: now,
        }),
    ]);
}
