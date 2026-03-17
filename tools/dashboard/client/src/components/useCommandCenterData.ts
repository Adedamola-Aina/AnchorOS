import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import type { CommandCenterData } from './commandCenter.types';

interface UseCommandCenterDataResult {
    data: CommandCenterData | null;
    loading: boolean;
    lastRefresh: Date | null;
    fetchData: () => Promise<void>;
}

export function useCommandCenterData(): UseCommandCenterDataResult {
    const [data, setData] = useState<CommandCenterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get<CommandCenterData>('/api/command-center');
            setData(response.data);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to fetch command center data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return { data, loading, lastRefresh, fetchData };
}
