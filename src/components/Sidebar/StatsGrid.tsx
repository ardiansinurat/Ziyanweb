// ============================================================
// StatsGrid — Dynamic learning statistics display
// ============================================================

import { Flame, Target, BookOpen } from 'lucide-react';

interface Props {
  streakDays: number;
  accuracy: number;
  totalWords: number;
}

export function StatsGrid({ streakDays, accuracy, totalWords }: Props) {
  return (
    <div className="stats-grid">
      <div className="stat-box" title="Hari berturut-turut belajar">
        <Flame className="stat-icon" size={28} />
        <span className="stat-value">{streakDays}</span>
        <span className="stat-label">Streak</span>
      </div>
      <div className="stat-box" title="Persentase pesan tanpa koreksi">
        <Target className="stat-icon" size={28} />
        <span className="stat-value">{accuracy}%</span>
        <span className="stat-label">Akurasi</span>
      </div>
      <div className="stat-box" title="Total kosakata tersimpan">
        <BookOpen className="stat-icon" size={28} />
        <span className="stat-value">{totalWords}</span>
        <span className="stat-label">Kosakata</span>
      </div>
    </div>
  );
}
