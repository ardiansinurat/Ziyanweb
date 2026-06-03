// ============================================================
// useActivityHistory — Track daily learning activity history
// ============================================================

import { useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';

export interface DailyActivity {
  date: string;      // YYYY-MM-DD
  messages: number;
  wordsLearned: number;
}

const STORAGE_KEY = 'activity_history';
const MAX_DAYS = 30;

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function buildEmptyDays(count: number): DailyActivity[] {
  return Array.from({ length: count }, (_, i) => ({
    date: getDateStr(count - 1 - i),
    messages: 0,
    wordsLearned: 0,
  }));
}

export function useActivityHistory() {
  const [history, setHistory] = useState<DailyActivity[]>(() =>
    getItem<DailyActivity[]>(STORAGE_KEY, [])
  );

  /**
   * Update today's activity record. Creates or updates the entry for today.
   */
  const updateToday = useCallback(
    (messages: number, words: number) => {
      const today = getTodayStr();
      setHistory(prev => {
        const existing = prev.find(d => d.date === today);
        let next: DailyActivity[];

        if (existing) {
          next = prev.map(d =>
            d.date === today
              ? { ...d, messages, wordsLearned: words }
              : d
          );
        } else {
          next = [...prev, { date: today, messages, wordsLearned: words }];
        }

        // Keep only the latest MAX_DAYS entries, sorted by date ascending
        next = next
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-MAX_DAYS);

        setItem(STORAGE_KEY, next);
        return next;
      });
    },
    []
  );

  /**
   * Returns an array of the last 7 days of activity.
   * Missing days are filled with zeros.
   */
  const getLast7Days = useCallback((): DailyActivity[] => {
    const days = buildEmptyDays(7);
    const map = new Map(history.map(d => [d.date, d]));
    return days.map(d => map.get(d.date) ?? d);
  }, [history]);

  /**
   * Returns an array of the last 30 days of activity.
   * Missing days are filled with zeros.
   */
  const getLast30Days = useCallback((): DailyActivity[] => {
    const days = buildEmptyDays(30);
    const map = new Map(history.map(d => [d.date, d]));
    return days.map(d => map.get(d.date) ?? d);
  }, [history]);

  /**
   * Returns the count of days that had at least 1 message.
   */
  const getTotalDays = useCallback((): number => {
    return history.filter(d => d.messages > 0).length;
  }, [history]);

  return { history, updateToday, getLast7Days, getLast30Days, getTotalDays };
}
