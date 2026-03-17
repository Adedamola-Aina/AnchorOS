interface BugItem {
  id: string;
  title: string;
  content?: string;
}

export interface SummaryProps {
  summary: {
    projectStatus?: {
      currentFocus: string;
      successCriteria: { text: string; status: string }[];
      inProgress: { text: string; status: string }[];
      completed: { text: string; status: string }[];
      criticalBugs: { id: string; description: string }[];
    };
    criteriaProgress?: number;
    bugs?: {
      statistics: {
        totalActive: string;
        critical: string;
        fixedThisMonth: string;
      };
      critical?: BugItem[];
      recentlyFixed?: BugItem[];
    };
    kanban?: {
      backlog: unknown[];
      todo: unknown[];
      inProgress: unknown[];
      done: unknown[];
    };
    parity?: {
      total: number;
      devOnly: number;
      stagingPending: number;
      fullyDeployed: number;
    };
    git?: {
      branch: string;
      isClean: boolean;
      lastCommit: { hash: string; message: string; date: string };
    };
    lastRefresh: string;
  } | null;
  onNavigateToTab?: (tab: string) => void;
}

export type { BugItem };
