// ============================================================
// useStats — Learning statistics tracking hook
// ============================================================

import { useState, useCallback } from 'react';
import type { UserStats } from '../types';
import { getItem, setItem } from '../utils/storage';

// XP thresholds for levels 1–10
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500, 4500];

function calcLevel(xp: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}

const DEFAULT_STATS: UserStats = {
  totalMessages: 0,
  totalWords: 0,
  corrections: 0,
  correctMessages: 0,
  streakDays: 0,
  lastActiveDate: '',
  dailyMessageCount: 0,
  xp: 0,
  level: 1,
};

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function useStats() {
  const [stats, setStatsState] = useState<UserStats>(() => {
    const saved = getItem<UserStats>('user_stats', DEFAULT_STATS);
    // Backfill xp/level for existing users who don't have it
    if (saved.xp === undefined) saved.xp = 0;
    if (saved.level === undefined) saved.level = calcLevel(saved.xp);
    return saved;
  });

  const persistStats = useCallback((next: UserStats) => {
    setStatsState(next);
    setItem('user_stats', next);
  }, []);

  const gainXp = useCallback((amount: number) => {
    setStatsState(prev => {
      const newXp = prev.xp + amount;
      const next: UserStats = {
        ...prev,
        xp: newXp,
        level: calcLevel(newXp),
      };
      setItem('user_stats', next);
      return next;
    });
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

      const newXp = prev.xp + 5; // +5 XP per message sent
      const next: UserStats = {
        ...prev,
        totalMessages: prev.totalMessages + 1,
        dailyMessageCount: isNewDay ? 1 : prev.dailyMessageCount + 1,
        lastActiveDate: today,
        streakDays: newStreak,
        xp: newXp,
        level: calcLevel(newXp),
      };
      setItem('user_stats', next);
      return next;
    });
  }, []);

  const recordAiResponse = useCallback((hadCorrection: boolean, wordCount: number) => {
    setStatsState(prev => {
      const xpGain = hadCorrection ? 3 : 10; // +10 correct, +3 with correction
      const newXp = prev.xp + xpGain;
      const next: UserStats = {
        ...prev,
        totalWords: prev.totalWords + wordCount,
        corrections: prev.corrections + (hadCorrection ? 1 : 0),
        correctMessages: prev.correctMessages + (hadCorrection ? 0 : 1),
        xp: newXp,
        level: calcLevel(newXp),
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
    gainXp,
    recordUserMessage,
    recordAiResponse,
    resetStats: () => persistStats(DEFAULT_STATS),
  };
}
