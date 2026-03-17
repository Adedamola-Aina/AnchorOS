export interface Feature {
  id: string;
  type: string;
  title: string;
  hash: string;
  date: string;
  author?: string;
  status: 'dev' | 'staging' | 'deployed';
  environments: {
    dev: boolean;
    staging: boolean;
    production: boolean;
  };
}

export interface BacklogData {
  source: string;
  completed: Feature[];
  inProgress: Feature[];
  pending: Feature[];
  summary: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}
