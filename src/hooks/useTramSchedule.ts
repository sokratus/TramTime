import { useState, useEffect } from 'react';
import axios from 'axios';
import { TramSchedule } from '../types';

export const useTramSchedule = (stopId: string | null) => {
  const [schedule, setSchedule] = useState<TramSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stopId) {
      setSchedule(null);
      return;
    }

    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/schedule/${stopId}`);
        setSchedule(response.data);
      } catch (err) {
        setError('Failed to fetch tram schedule');
        console.error('Error fetching schedule:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
    const interval = setInterval(fetchSchedule, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [stopId]);

  return { schedule, isLoading, error };
};