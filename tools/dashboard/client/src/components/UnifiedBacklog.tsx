// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layers, RefreshCw } from 'lucide-react';
import { GitBacklogExplorer } from './GitBacklogExplorer';
import { RoadmapExplorer } from './RoadmapExplorer';
import type { BacklogData, RoadmapData } from './backlog.types';

export function UnifiedBacklog() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [gitBacklog, setGitBacklog] = useState<BacklogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'roadmap' | 'git'>('roadmap');

  useEffect(() => {
    async function fetchData() {
      try {
        const [roadmapRes, backlogRes] = await Promise.all([
          axios.get('/api/git/roadmap'),
          axios.get('/api/git/backlog'),
        ]);
        setRoadmap(roadmapRes.data);
        setGitBacklog(backlogRes.data);
      } catch (error) {
        console.error('Failed to fetch backlog data:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!roadmap && !gitBacklog) return <div className="card text-red-400">Failed to load backlog data</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-bold text-white">Backlog & Roadmap</h2>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'roadmap' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📋 Strategic Roadmap
          </button>
          <button
            onClick={() => setViewMode('git')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'git' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🔀 Git Activity
          </button>
        </div>
      </div>

      {viewMode === 'roadmap' && roadmap ? <RoadmapExplorer roadmap={roadmap} /> : null}
      {viewMode === 'git' && gitBacklog ? <GitBacklogExplorer backlog={gitBacklog} /> : null}
    </div>
  );
}

export default UnifiedBacklog;
