// ============================================================
// Sidebar — Main sidebar component
// ============================================================

import type { VocabWord } from '../../types';
import { ProfileCard } from './ProfileCard';
import { StatsGrid } from './StatsGrid';
import { VocabNotebook } from './VocabNotebook';
import { DailyReminder } from './DailyReminder';
import { DailyWordCard } from './DailyWordCard';

interface Props {
  userName: string;
  userAvatar: string;
  hskLevel: number;
  streakDays: number;
  accuracy: number;
  totalWords: number;
  dailyCount: number;
  vocabWords: VocabWord[];
  onOpenSettings: () => void;
  onRemoveWord: (id: string) => void;
  onStartPractice: () => void;
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
  dailyCount,
  vocabWords,
  onOpenSettings,
  onRemoveWord,
  onStartPractice,
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
          onOpenSettings={onOpenSettings}
        />

        <StatsGrid
          streakDays={streakDays}
          accuracy={accuracy}
          totalWords={totalWords}
        />

        <DailyWordCard playAudio={playAudio} />

        <DailyReminder
          dailyCount={dailyCount}
          onStartPractice={onStartPractice}
        />

        <VocabNotebook
          words={vocabWords}
          onRemove={onRemoveWord}
          playAudio={playAudio}
        />
      </div>
    </>
  );
}
