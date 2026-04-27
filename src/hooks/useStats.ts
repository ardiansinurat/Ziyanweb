// ============================================================
// useStats — Learning statistics tracking hook
// ============================================================

import { useState, useCallback } from 'react';
import type { UserStats } from '../types';
import { getItem, setItem } from '../utils/storage';

const DEFAULT_STATS: UserStats = {
  totalMessages: 0,
  totalWords: 0,
  corrections: 0,
  correctMessages: 0,
  streakDays: 0,
  lastActiveDate: '',
  dailyMessageCount: 0,
};

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function useStats() {
  const [stats, setStatsState] = useState<UserStats>(() =>
    getItem<UserStats>('user_stats', DEFAULT_STATS)
  );

  const persistStats = useCallback((next: UserStats) => {
    setStatsState(next);
    setItem('user_stats', next);
  }, []);

  const recordUserMessage = useCallback(() => {
    setStatsState(prev => {
      const today = getTodayDate();
      const isNewDay = prev.lastActiveDate !== today;

      let newStreak = prev.streakDays;
      if (isNewDay) {
        // Check if yesterday was active (continuation of streak)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (prev.lastActiveDate === yesterdayStr) {
          newStreak = prev.streakDays + 1;
        } else if (prev.lastActiveDate === '') {
          newStreak = 1;
        } else {
          newStreak = 1; // Streak broken
        }
      }

      const next: UserStats = {
        ...prev,
        totalMessages: prev.totalMessages + 1,
        dailyMessageCount: isNewDay ? 1 : prev.dailyMessageCount + 1,
        lastActiveDate: today,
        streakDays: newStreak,
      };
      setItem('user_stats', next);
      return next;
    });
  }, []);

  const recordAiResponse = useCallback((hadCorrection: boolean, wordCount: number) => {
    setStatsState(prev => {
      const next: UserStats = {
        ...prev,
        totalWords: prev.totalWords + wordCount,
        corrections: prev.corrections + (hadCorrection ? 1 : 0),
        correctMessages: prev.correctMessages + (hadCorrection ? 0 : 1),
      };
      setItem('user_stats', next);
      return next;
    });
  }, []);

  const accuracy = stats.totalMessages > 0
    ? Math.round((stats.correctMessages / stats.totalMessages) * 100)
    : 100;

  return {
    stats,
    accuracy,
    recordUserMessage,
    recordAiResponse,
    resetStats: () => persistStats(DEFAULT_STATS),
  };
}
