// ============================================================
// Sidebar — Main sidebar component
// ============================================================

import { useState } from 'react';
import type { VocabWord } from '../../types';
import { ProfileCard } from './ProfileCard';
import { StatsGrid } from './StatsGrid';
import { VocabNotebook } from './VocabNotebook';
import { DailyWordCard } from './DailyWordCard';

interface WordObj {
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
}

interface Props {
  userName: string;
  userAvatar: string;
  hskLevel: number;
  streakDays: number;
  accuracy: number;
  totalWords: number;
  totalMessages: number;
  dailyCount: number;
  dailyGoal?: number;
  xp?: number;
  level?: number;
  vocabWords: VocabWord[];
  onOpenSettings: () => void;
  theme?: string;
  onToggleTheme?: () => void;
  onRemoveWord: (id: string) => void;
  onAddWord?: (word: Omit<VocabWord, 'id' | 'savedAt'>) => void;
  onSaveDailyWord?: (word: WordObj) => void;
  onStartPractice?: () => void;
  playAudio: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function DailyGoalBar({ count, goal, onStartPractice }: { count: number; goal: number; onStartPractice?: () => void }) {
  const pct = Math.min(100, Math.round((count / goal) * 100));
  const isComplete = count >= goal;

  return (
    <div className="daily-goal-bar glass-panel">
      <div className="daily-goal-header">
        <span className="daily-goal-label">
          {isComplete ? '🎉 Target Hari Ini Tercapai!' : '🎯 Target Harian'}
        </span>
        <span className="daily-goal-count">{count}/{goal} pesan</span>
      </div>
      <div className="daily-goal-track">
        <div
          className={`daily-goal-fill${isComplete ? ' complete' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isComplete && (
        <div className="daily-goal-complete-text">+50 XP bonus earned! ⚡</div>
      )}
      {!isComplete && onStartPractice && (
        <button
          className="daily-goal-practice-btn"
          onClick={onStartPractice}
          style={{
            marginTop: '6px',
            width: '100%',
            padding: '5px',
            border: 'none',
            borderRadius: '8px',
            background: 'var(--primary)',
            color: 'white',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'opacity 0.15s',
          }}
        >
          ⚡ Latihan Sekarang
        </button>
      )}
    </div>
  );
}

export function Sidebar({
  userName,
  userAvatar,
  hskLevel,
  streakDays,
  accuracy,
  totalWords,
  totalMessages,
  dailyCount,
  dailyGoal,
  xp,
  level,
  vocabWords,
  onOpenSettings,
  theme,
  onToggleTheme,
  onRemoveWord,
  onAddWord,
  onSaveDailyWord,
  onStartPractice,
  playAudio,
  isOpen,
  onClose,
}: Props) {
  const [wordCardOpen, setWordCardOpen] = useState(true);
  const [vocabOpen, setVocabOpen] = useState(true);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className={`sidebar glass-panel ${isOpen ? 'sidebar-open' : ''}`}>
        <ProfileCard
          name={userName}
          avatar={userAvatar}
          hskLevel={hskLevel}
          xp={xp}
          level={level}
          onOpenSettings={onOpenSettings}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <StatsGrid
          streakDays={streakDays}
          accuracy={accuracy}
          totalWords={totalWords}
          totalMessages={totalMessages}
        />

        <DailyGoalBar count={dailyCount} goal={dailyGoal ?? 10} onStartPractice={onStartPractice} />

        {/* Collapsible DailyWord section */}
        <div style={{ padding: '0 2px' }}>
          <button
            className="sidebar-section-toggle"
            onClick={() => setWordCardOpen(p => !p)}
            aria-expanded={wordCardOpen}
          >
            <span>Kata Hari Ini</span>
            <span className={`sidebar-section-toggle-icon${!wordCardOpen ? ' collapsed' : ''}`}>▼</span>
          </button>
          <div
            className={`sidebar-section-body${!wordCardOpen ? ' collapsed' : ''}`}
            style={{ maxHeight: wordCardOpen ? '600px' : '0' }}
          >
            <DailyWordCard playAudio={playAudio} onSaveWord={onSaveDailyWord} />
          </div>
        </div>

        {/* Collapsible Vocab section */}
        <div style={{ padding: '0 2px' }}>
          <button
            className="sidebar-section-toggle"
            onClick={() => setVocabOpen(p => !p)}
            aria-expanded={vocabOpen}
          >
            <span>Kosakata</span>
            <span className={`sidebar-section-toggle-icon${!vocabOpen ? ' collapsed' : ''}`}>▼</span>
          </button>
          <div
            className={`sidebar-section-body${!vocabOpen ? ' collapsed' : ''}`}
            style={{ maxHeight: vocabOpen ? '1200px' : '0' }}
          >
            <VocabNotebook
              words={vocabWords}
              onRemove={onRemoveWord}
              playAudio={playAudio}
              onAddWord={onAddWord}
            />
          </div>
        </div>
      </div>
    </>
  );
}
