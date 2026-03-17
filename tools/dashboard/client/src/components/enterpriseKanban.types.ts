export interface KanbanItem {
    id: string;
    title: string;
    type: 'bug' | 'feature' | 'task' | 'gap' | 'regression';
    priority: 'P0' | 'P1' | 'P2';
    assignee: string;
    status: string;
    label: string;
    description: string;
    createdDate: string | null;
    dueDate: string | null;
    date?: string;
}

export interface GitKanbanResponse {
    backlog?: KanbanItem[];
    todo?: KanbanItem[];
    inProgress: KanbanItem[];
    staging?: KanbanItem[];
    done: KanbanItem[];
    summary: {
        total: number;
        backlog?: number;
        devOnly: number;
        stagingOnly: number;
        deployed: number;
    };
}

export interface KanbanData {
    columns: {
        backlog: string[];
        todo: string[];
        inProgress: string[];
        done: string[];
    };
    items: Record<string, KanbanItem>;
    stats: {
        totalItems: number;
        totalBugs: number;
        criticalBugs: number;
        totalFeatures: number;
        completedThisWeek: number;
        inProgressCount: number;
        wipLimit: number;
        wipExceeded: boolean;
    };
    error?: string;
}

export interface VelocityStatsSummary {
    currentVelocity: number;
    averageCycleTime: number | null;
}

export interface KanbanFilters {
    searchQuery: string;
    filterType: string;
    filterPriority: string;
    filterAssignee: string;
}

export type KanbanColumnKey = keyof KanbanData['columns'];

export interface EnterpriseKanbanColumn {
    id: KanbanColumnKey;
    title: string;
    items: string[];
    color: string;
    bgColor: string;
    icon: JSX.Element;
}
