// ============================================================
// StatsGrid — Dynamic learning statistics display
// ============================================================

import { Flame, Target, BookOpen, MessageSquare } from 'lucide-react';

function getStreakMessage(days: number): { text: string; hot: boolean } {
  if (days === 0) return { text: 'Mulai hari ini!', hot: false };
  if (days === 1) return { text: 'Bagus! Lanjutkan!', hot: false };
  if (days < 3) return { text: 'Terus semangat!', hot: false };
  if (days < 7) return { text: `${days} hari berturut!`, hot: true };
  if (days < 14) return { text: 'Luar biasa! 🎉', hot: true };
  if (days < 30) return { text: 'Kamu keren! 🚀', hot: true };
  return { text: 'LEGENDA! 👑', hot: true };
}

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
        <span className={`stat-streak-msg${getStreakMessage(streakDays).hot ? ' hot' : ''}`}>
          {getStreakMessage(streakDays).text}
        </span>
      </div>

      <div
        className="stat-box stat-accuracy"
        title="Persentase pesan yang dikirim tanpa koreksi dari Ziyan"
      >
        <Target className="stat-icon" size={26} />
        <span className="stat-value">{accuracy}%</span>
        <span className="stat-label">Akurasi</span>
        <span className="stat-streak-msg">
          {accuracy >= 90 ? 'Sempurna! 🎯' : accuracy >= 70 ? 'Bagus! 👍' : accuracy >= 50 ? 'Terus belajar! 💪' : accuracy > 0 ? 'Jangan menyerah! 🌟' : ''}
        </span>
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
