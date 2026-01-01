import { useState, useEffect, useCallback } from 'react';
import { Issue } from '@/types';

interface UseFetchIssuesResult {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchIssues = (
  lat?: number,
  lon?: number,
  radius?: number
): UseFetchIssuesResult => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (lat !== undefined) params.append('lat', lat.toString());
      if (lon !== undefined) params.append('lon', lon.toString());
      if (radius !== undefined) params.append('radius', radius.toString());

      const response = await fetch(`/api/fetch-issues?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch issues');
      }

      setIssues(data.issues || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, radius]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return { issues, loading, error, refetch: fetchIssues };
};
