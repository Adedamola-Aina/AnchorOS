export interface TimelineDay {
  date: string;
  features: string[];
  commitCount: number;
  byType?: Record<string, number>;
  byDomain?: Record<string, number>;
  commits: {
    hash: string;
    message: string;
    date: string;
    author: string;
    type: string;
    category?: string;
    workKind?: string;
    domains?: string[];
    confidence?: number;
  }[];
}

export type FilterType = 'all' | 'anchorOS' | 'dashboard' | 'docs' | 'infra';
