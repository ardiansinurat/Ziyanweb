// ============================================================
// DailyReminder — Daily practice reminder card
// ============================================================

import { Bell } from 'lucide-react';

interface Props {
  dailyCount: number;
  onStartPractice: () => void;
}

export function DailyReminder({ dailyCount, onStartPractice }: Props) {
  const goal = 10;
  const progress = Math.min((dailyCount / goal) * 100, 100);
  const achieved = dailyCount >= goal;

  return (
    <div className="daily-reminder">
      <h3><Bell size={18} /> Target Harian</h3>
      <p>
        {achieved
          ? '🎉 Target hari ini tercapai! Tetap semangat!'
          : `Kirim ${goal - dailyCount} pesan lagi untuk mencapai target hari ini.`}
      </p>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <span className="progress-label">{dailyCount}/{goal} pesan</span>
      {!achieved && (
        <button className="btn-primary" onClick={onStartPractice}>
          Mulai Latihan
        </button>
      )}
    </div>
  );
}
