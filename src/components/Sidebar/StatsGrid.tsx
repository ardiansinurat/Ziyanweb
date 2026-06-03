// ============================================================
// StatsGrid — Dynamic learning statistics display
// ============================================================

import { Flame, Target, BookOpen, MessageSquare } from 'lucide-react';

interface Props {
  streakDays: number;
  accuracy: number;
  totalWords: number;
  totalMessages: number;
}

export function StatsGrid({ streakDays, accuracy, totalWords, totalMessages }: Props) {
  return (
    <div className="stats-grid">
      <div
        className={`stat-box stat-streak${streakDays > 0 ? ' stat-active' : ''}`}
        title="Hari berturut-turut belajar tanpa henti"
      >
        <Flame
          className={`stat-icon${streakDays > 0 ? ' stat-icon-flame' : ''}`}
          size={26}
        />
        <span className="stat-value">
          {streakDays}{streakDays > 0 ? ' 🔥' : ''}
        </span>
        <span className="stat-label">Streak</span>
      </div>

      <div
        className="stat-box stat-accuracy"
        title="Persentase pesan yang dikirim tanpa koreksi dari Ziyan"
      >
        <Target className="stat-icon" size={26} />
        <span className="stat-value">{accuracy}%</span>
        <span className="stat-label">Akurasi</span>
        <div className="stat-progress-bar" title={`${accuracy}% akurasi`}>
          <div
            className="stat-progress-fill"
            style={{ width: `${Math.min(accuracy, 100)}%` }}
          />
        </div>
      </div>

      <div
        className="stat-box stat-vocab"
        title="Total kata yang kamu simpan ke Kosakata Saya"
      >
        <BookOpen className="stat-icon" size={26} />
        <span className="stat-value">{totalWords}</span>
        <span className="stat-label">Kosakata</span>
      </div>

      <div
        className="stat-box stat-messages"
        title="Total pesan yang telah kamu kirim ke Ziyan"
      >
        <MessageSquare className="stat-icon" size={26} />
        <span className="stat-value">{totalMessages}</span>
        <span className="stat-label">Pesan Total</span>
      </div>
    </div>
  );
}
