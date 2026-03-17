import { AlertTriangle, Bug, CheckCircle, Clock, RefreshCw, Tag, User, Zap } from 'lucide-react';
import type {
    EnterpriseKanbanColumn,
    GitKanbanResponse,
    KanbanData,
    KanbanFilters,
    KanbanItem,
} from './enterpriseKanban.types';

export function transformGitKanbanResponse(gitData: GitKanbanResponse): KanbanData {
    const items: Record<string, KanbanItem> = {};
    const backlogIds: string[] = [];
    const todoIds: string[] = [];
    const inProgressIds: string[] = [];
    const doneIds: string[] = [];

    const seenIds = new Set<string>();

    const addItem = (item: KanbanItem, lane: 'backlog' | 'todo' | 'inProgress' | 'done', defaultPriority: 'P0' | 'P1' | 'P2') => {
        if (seenIds.has(item.id)) {
            return;
        }
        seenIds.add(item.id);

        items[item.id] = {
            ...item,
            priority: item.priority || defaultPriority,
            assignee: item.assignee || 'Agent',
            label: item.type || '',
            description: item.title,
            createdDate: item.date || null,
            dueDate: null,
        };

        if (lane === 'backlog') backlogIds.push(item.id);
        if (lane === 'todo') todoIds.push(item.id);
        if (lane === 'inProgress') inProgressIds.push(item.id);
        if (lane === 'done') doneIds.push(item.id);
    };

    for (const item of gitData.backlog || []) {
        addItem(item, 'backlog', 'P2');
    }

    for (const item of gitData.todo || []) {
        addItem(item, 'todo', 'P2');
    }

    for (const item of gitData.inProgress || []) {
        addItem(item, 'inProgress', 'P1');
    }

    if (!gitData.todo && gitData.staging) {
        for (const item of gitData.staging || []) {
            addItem(item, 'inProgress', 'P1');
        }
    }

    for (const item of gitData.done || []) {
        addItem(item, 'done', 'P2');
    }

    const allItems = Object.values(items);
    const bugCount = allItems.filter((entry) => entry.type === 'bug').length;
    const featureCount = allItems.filter((entry) => entry.type === 'feature').length;
    return {
        columns: {
            backlog: backlogIds,
            todo: todoIds,
            inProgress: inProgressIds,
            done: doneIds,
        },
        items,
        stats: {
            totalItems: gitData.summary.total,
            totalBugs: bugCount,
            criticalBugs: 0,
            totalFeatures: featureCount,
            completedThisWeek: gitData.summary.deployed,
            inProgressCount: todoIds.length + inProgressIds.length,
            wipLimit: 10,
            wipExceeded: (todoIds.length + inProgressIds.length) > 10,
        },
    };
}

export function filterItemIds(itemIds: string[], items: Record<string, KanbanItem>, filters: KanbanFilters): string[] {
    const normalizedSearch = filters.searchQuery.toLowerCase();

    return itemIds.filter((id) => {
        const item = items[id];
        if (!item) {
            return false;
        }

        if (
            filters.searchQuery
            && !item.title.toLowerCase().includes(normalizedSearch)
            && !item.id.toLowerCase().includes(normalizedSearch)
        ) {
            return false;
        }

        if (filters.filterType !== 'all' && item.type !== filters.filterType) {
            return false;
        }

        if (filters.filterPriority !== 'all' && item.priority !== filters.filterPriority) {
            return false;
        }

        if (filters.filterAssignee !== 'all' && item.assignee !== filters.filterAssignee) {
            return false;
        }

        return true;
    });
}

export function buildKanbanColumns(data: KanbanData, filters: KanbanFilters): EnterpriseKanbanColumn[] {
    return [
        {
            id: 'backlog',
            title: 'Backlog',
            items: filterItemIds(data.columns.backlog, data.items, filters),
            color: 'border-slate-500',
            bgColor: 'bg-slate-500/10',
            icon: <Tag className="w-4 h-4" />,
        },
        {
            id: 'todo',
            title: 'To Do',
            items: filterItemIds(data.columns.todo, data.items, filters),
            color: 'border-amber-500',
            bgColor: 'bg-amber-500/10',
            icon: <Clock className="w-4 h-4 text-amber-400" />,
        },
        {
            id: 'inProgress',
            title: 'In Progress',
            items: filterItemIds(data.columns.inProgress, data.items, filters),
            color: 'border-blue-500',
            bgColor: 'bg-blue-500/10',
            icon: <RefreshCw className="w-4 h-4 text-blue-400" />,
        },
        {
            id: 'done',
            title: 'Done',
            items: filterItemIds(data.columns.done, data.items, filters),
            color: 'border-emerald-500',
            bgColor: 'bg-emerald-500/10',
            icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
        },
    ];
}

export function getTypeIcon(type: string): JSX.Element {
    switch (type) {
        case 'bug':
        case 'regression':
            return <Bug className="w-4 h-4 text-red-400" />;
        case 'feature':
            return <Zap className="w-4 h-4 text-purple-400" />;
        case 'gap':
            return <AlertTriangle className="w-4 h-4 text-amber-400" />;
        default:
            return <CheckCircle className="w-4 h-4 text-slate-400" />;
    }
}

export function getPriorityBadge(priority: string): JSX.Element {
    const styles = {
        P0: 'bg-red-900/30 text-red-400 border-red-500/50',
        P1: 'bg-amber-900/30 text-amber-400 border-amber-500/50',
        P2: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${styles[priority as keyof typeof styles] || styles.P2}`}>
            {priority}
        </span>
    );
}

export function hasActiveFilters(filters: KanbanFilters): boolean {
    return Boolean(
        filters.searchQuery
        || filters.filterType !== 'all'
        || filters.filterPriority !== 'all'
        || filters.filterAssignee !== 'all',
    );
}

export function getDragDisabledMessage(): string {
    return '⚠️ Drag-and-drop is visual only. To move items, edit ROADMAP.md or KNOWN_ISSUES.md directly.';
}

export const ASSIGNEE_OPTIONS = ['all', 'Teeto', 'Agent', 'Unassigned'];
export const TYPE_OPTIONS = ['all', 'bug', 'feature', 'task', 'gap', 'regression'];
export const PRIORITY_OPTIONS = ['all', 'P0', 'P1', 'P2'];

export { User };
