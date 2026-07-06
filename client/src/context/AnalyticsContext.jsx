import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { analyticsAPI } from '../services/api';
import { getSocketUrl } from '../utils/socketUrl';
import { io } from 'socket.io-client';

const AnalyticsContext = createContext(null);

const EMPTY_SUMMARY = {
  totals: { visits: 0, clicks: 0, messages: 0 },
  today: { visits: 0, clicks: 0, messages: 0 },
  week: { visits: 0, clicks: 0, messages: 0 },
  month: { visits: 0, clicks: 0, messages: 0 },
  series: { daily: [], weekly: [], monthly: [] },
  recent: [],
};

export function AnalyticsProvider({ children }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);

  const refreshSummary = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await analyticsAPI.getSummary();
      setSummary(data);
    } catch {
      setSummary(EMPTY_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSummary(EMPTY_SUMMARY);
      return undefined;
    }

    refreshSummary();

    const token = localStorage.getItem('token');
    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('analytics:update', (payload) => {
      if (payload) setSummary(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, refreshSummary]);

  const value = useMemo(
    () => ({
      summary,
      loading,
      refreshSummary,
    }),
    [summary, loading, refreshSummary]
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return context;
}
