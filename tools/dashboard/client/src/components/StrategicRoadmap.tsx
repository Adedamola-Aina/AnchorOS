// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import { RoadmapExplorer } from './RoadmapExplorer';
import type { RoadmapData } from './backlog.types';

export function StrategicRoadmap() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await axios.get('/api/git/roadmap');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch roadmap:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!data) return <div className="card text-red-400">Failed to load roadmap</div>;

  return <RoadmapExplorer roadmap={data} />;
}

export default StrategicRoadmap;
