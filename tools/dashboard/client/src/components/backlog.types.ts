export interface Initiative {
  id: string;
  team: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  effort: 'small' | 'medium' | 'large';
  impact: 'low' | 'medium' | 'high' | 'critical';
  detectedFromGit?: boolean;
  matchedCommits?: { hash: string; message: string; date: string }[];
  completedAt?: string;
}

export interface RoadmapData {
  source: string;
  lastUpdated?: string;
  version?: string;
  summary: { total: number; completed: number; inProgress: number; planned: number; autoDetected: number };
  teams: string[];
  initiatives: Initiative[];
}

export interface GitItem {
  id: string;
  type: string;
  title: string;
  hash: string;
  date: string;
  status: 'dev' | 'staging' | 'deployed';
  environments: { dev: boolean; staging: boolean; production: boolean };
}

export interface BacklogData {
  source: string;
  completed: GitItem[];
  inProgress: GitItem[];
  pending: GitItem[];
  summary: { total: number; completed: number; inProgress: number; pending: number };
}
