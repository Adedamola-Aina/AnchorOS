import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { FilterType, TimelineDay } from './gitTimeline.types';

export function useGitTimeline() {
  const [timeline, setTimeline] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      try {
        const res = await axios.get('/api/git/timeline?days=14');
        const nextTimeline = res.data;
        setTimeline(nextTimeline);

        const stats = { anchorOS: 0, dashboard: 0, docs: 0, infra: 0 };
        for (const day of nextTimeline) {
          for (const commit of day.commits || []) {
            const category = commit.category || 'infra';
            if (stats[category as keyof typeof stats] !== undefined) {
              stats[category as keyof typeof stats] += 1;
            }
          }
        }

        setCategoryStats(stats);
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchTimeline();
  }, []);

  const filteredTimeline = useMemo(() => {
    const filterCommit = (commit: { category?: string }) => filter === 'all' || commit.category === filter;
    return timeline
      .map((day) => ({
        ...day,
        commits: day.commits.filter(filterCommit),
        commitCount: day.commits.filter(filterCommit).length,
      }))
      .filter((day) => day.commitCount > 0);
  }, [filter, timeline]);

  return {
    loading,
    expandedDay,
    filter,
    categoryStats,
    filteredTimeline,
    setExpandedDay,
    setFilter,
  };
}
