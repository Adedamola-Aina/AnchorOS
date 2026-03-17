import { useEffect, useState } from 'react';
import axios from 'axios';
import type { CompletionPrediction, VelocityStats } from './velocityDashboard.types';

export function useVelocityDashboard() {
  const [stats, setStats] = useState<VelocityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingItems, setRemainingItems] = useState(10);
  const [prediction, setPrediction] = useState<CompletionPrediction | null>(null);

  const fetchVelocityStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/velocity/stats');
      setStats(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch velocity stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchVelocityStats();
  }, []);

  const handleAutoDetect = async () => {
    try {
      const res = await axios.post('/api/velocity/auto-detect');
      if (res.data.newCompletions > 0) {
        alert(`Auto-detected ${res.data.newCompletions} new completions!`);
        await fetchVelocityStats();
      } else {
        alert('No new completions detected.');
      }
    } catch {
      alert('Failed to auto-detect completions');
    }
  };

  const handlePredict = async () => {
    try {
      const res = await axios.post<CompletionPrediction>('/api/velocity/predict', { remainingItems });
      setPrediction(res.data);
    } catch {
      alert('Failed to predict completion date');
    }
  };

  return {
    stats,
    loading,
    error,
    remainingItems,
    prediction,
    setRemainingItems,
    handleAutoDetect,
    handlePredict,
  };
}
