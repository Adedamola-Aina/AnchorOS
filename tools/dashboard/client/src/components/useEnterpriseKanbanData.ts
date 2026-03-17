import { useEffect, useState } from 'react';
import axios from 'axios';
import type { GitKanbanResponse, KanbanData, VelocityStatsSummary } from './enterpriseKanban.types';
import { transformGitKanbanResponse } from './enterpriseKanban.helpers';

interface UseEnterpriseKanbanDataResult {
    data: KanbanData | null;
    loading: boolean;
    velocityStats: VelocityStatsSummary | null;
}

export function useEnterpriseKanbanData(): UseEnterpriseKanbanDataResult {
    const [data, setData] = useState<KanbanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [velocityStats, setVelocityStats] = useState<VelocityStatsSummary | null>(null);

    useEffect(() => {
        async function fetchKanban(): Promise<void> {
            try {
                const response = await axios.get<GitKanbanResponse>('/api/git/kanban');
                setData(transformGitKanbanResponse(response.data));
            } catch (error) {
                console.error('Failed to fetch Kanban:', error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchVelocity(): Promise<void> {
            try {
                const response = await axios.get<VelocityStatsSummary>('/api/velocity/stats');
                setVelocityStats(response.data);
            } catch (error) {
                console.error('Failed to fetch velocity:', error);
            }
        }

        fetchKanban();
        fetchVelocity();
    }, []);

    return { data, loading, velocityStats };
}
