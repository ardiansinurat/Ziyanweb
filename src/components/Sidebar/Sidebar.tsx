// ============================================================
// Sidebar — Main sidebar component
// ============================================================

import type { VocabWord } from '../../types';
import { ProfileCard } from './ProfileCard';
import { StatsGrid } from './StatsGrid';
import { VocabNotebook } from './VocabNotebook';
import { DailyReminder } from './DailyReminder';
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
  xp?: number;
  level?: number;
  vocabWords: VocabWord[];
  onOpenSettings: () => void;
  onRemoveWord: (id: string) => void;
  onAddWord?: (word: Omit<VocabWord, 'id' | 'savedAt'>) => void;
  onStartPractice: () => void;
  onSaveDailyWord?: (word: WordObj) => void;
  playAudio: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
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
  xp,
  level,
  vocabWords,
  onOpenSettings,
  onRemoveWord,
  onAddWord,
  onStartPractice,
  onSaveDailyWord,
  playAudio,
  isOpen,
  onClose,
}: Props) {
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
        />

        <StatsGrid
          streakDays={streakDays}
          accuracy={accuracy}
          totalWords={totalWords}
          totalMessages={totalMessages}
        />

        <DailyWordCard playAudio={playAudio} onSaveWord={onSaveDailyWord} />

        <DailyReminder
          dailyCount={dailyCount}
          onStartPractice={onStartPractice}
        />

        <VocabNotebook
          words={vocabWords}
          onRemove={onRemoveWord}
          playAudio={playAudio}
          onAddWord={onAddWord}
        />
      </div>
    </>
  );
}
