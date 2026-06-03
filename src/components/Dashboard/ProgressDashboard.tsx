// ============================================================
// ProgressDashboard — Visual learning progress tracker
// ============================================================

import { useMemo, useEffect, useCallback } from 'react';
import { useToast } from '../UI/Toast';
import { getItem, setItem } from '../../utils/storage';
import {
  MessageSquare,
  Flame,
  Target,
  BookOpen,
  Lock,
  TrendingUp,
  Copy,
} from 'lucide-react';
import type { UserStats, VocabWord } from '../../types';
import { useActivityHistory, type DailyActivity } from '../../hooks/useActivityHistory';
import './dashboard.css';

interface ProgressDashboardProps {
  stats: UserStats;
  accuracy: number;
  words: VocabWord[];
}

// ── XP level thresholds ─────────────────────────────────────
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500, 4500];

// ── HSK milestones ───────────────────────────────────────────
const HSK_LEVELS = [
  { level: 1, label: 'HSK 1', words: 150 },
  { level: 2, label: 'HSK 2', words: 300 },
  { level: 3, label: 'HSK 3', words: 600 },
  { level: 4, label: 'HSK 4+', words: 1200 },
];

// ── Achievement definitions ──────────────────────────────────
interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  check: (s: UserStats, acc: number, wordCount: number) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_message',
    icon: '🌱',
    name: 'Permulaan',
    description: 'Kirim pesan pertama',
    check: (s) => s.totalMessages >= 1,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    name: 'Semangat Belajar',
    description: 'Streak 3 hari',
    check: (s) => s.streakDays >= 3,
  },
  {
    id: 'streak_7',
    icon: '💥',
    name: 'Api Membara',
    description: 'Streak 7 hari',
    check: (s) => s.streakDays >= 7,
  },
  {
    id: 'vocab_10',
    icon: '🗺️',
    name: 'Penjelajah Kosakata',
    description: 'Simpan 10 kata',
    check: (_s, _a, wc) => wc >= 10,
  },
  {
    id: 'vocab_50',
    icon: '📚',
    name: 'Kolektor Kata',
    description: 'Simpan 50 kata',
    check: (_s, _a, wc) => wc >= 50,
  },
  {
    id: 'messages_100',
    icon: '💬',
    name: '100 Pesan',
    description: 'Kirim 100 pesan total',
    check: (s) => s.totalMessages >= 100,
  },
  {
    id: 'accuracy_80',
    icon: '🎯',
    name: 'Master Akurasi',
    description: 'Akurasi di atas 80%',
    check: (_s, acc) => acc > 80,
  },
  {
    id: 'accuracy_90',
    icon: '🏆',
    name: 'Siswa Teladan',
    description: 'Akurasi di atas 90%',
    check: (_s, acc) => acc > 90,
  },
  {
    id: 'daily_20',
    icon: '⚡',
    name: 'Penutur Aktif',
    description: '20 pesan dalam sehari',
    check: (s) => s.dailyMessageCount >= 20,
  },
  {
    id: 'streak_30',
    icon: '👑',
    name: 'Dedikasi',
    description: 'Streak 30 hari',
    check: (s) => s.streakDays >= 30,
  },
];

// ── Day label helper ─────────────────────────────────────────
const ID_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return ID_DAYS[d.getDay()];
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

// ── Circular progress SVG ────────────────────────────────────
interface CircularProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel: string;
}

function CircularProgress({
  percent,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
}: CircularProgressProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="progress-circle-wrapper">
      <svg
        className="progress-circle-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`${percent}%`}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="progress-arc"
        />
        {/* Center text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          className="progress-pct-text"
          fill="var(--text-main)"
        >
          {percent}%
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="progress-sub-text"
          fill="var(--text-muted)"
        >
          {sublabel}
        </text>
      </svg>
      <p className="progress-circle-label">{label}</p>
    </div>
  );
}

// ── Activity Heatmap ─────────────────────────────────────────
function ActivityHeatmap({ days }: { days: DailyActivity[] }) {
  function getCellOpacity(messages: number): number {
    if (messages === 0) return 0;
    if (messages < 5) return 0.3;
    if (messages < 10) return 0.65;
    return 1;
  }

  const activeDays = days.filter(d => d.messages > 0).length;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="activity-heatmap">
      <div className="heatmap-grid">
        {days.map((day) => {
          const opacity = getCellOpacity(day.messages);
          const isTodayCell = day.date === today;
          return (
            <div
              key={day.date}
              className={`heatmap-cell${isTodayCell ? ' heatmap-today' : ''}`}
              style={{
                background: opacity > 0 ? `var(--primary)` : 'var(--glass-border)',
                opacity: opacity > 0 ? opacity : 0.4,
              }}
              title={`${day.date}: ${day.messages} pesan`}
            />
          );
        })}
      </div>
      <div className="heatmap-legend">
        <span className="heatmap-active-days">{activeDays}/30 hari aktif</span>
        <div className="heatmap-scale">
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sedikit</span>
          {[0.3, 0.65, 1].map(op => (
            <div
              key={op}
              className="heatmap-cell"
              style={{ background: 'var(--primary)', opacity: op }}
            />
          ))}
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Banyak</span>
        </div>
      </div>
    </div>
  );
}

// ── XP Progress Bar ──────────────────────────────────────────
function XpProgressBar({ xp, level }: { xp: number; level: number }) {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;

  if (isMaxLevel) {
    return (
      <div className="xp-progress-bar-section">
        <div className="xp-progress-header">
          <span className="xp-level-label">⭐ Level MAX</span>
          <span className="xp-total">{xp} XP Total</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  const remaining = nextThreshold - xp;

  return (
    <div className="xp-progress-bar-section">
      <div className="xp-progress-header">
        <span className="xp-level-label">Level {level}</span>
        <span className="xp-next-label">Level {level + 1}</span>
      </div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="xp-progress-footer">
        <span className="xp-current">{xp} XP</span>
        <span className="xp-remaining">{remaining} XP lagi ke Level {level + 1}</span>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function ProgressDashboard({
  stats,
  accuracy,
  words,
}: ProgressDashboardProps) {
  const { showToast } = useToast();

  const { getLast7Days, getLast30Days } = useActivityHistory();

  const last7 = getLast7Days();
  const last30 = getLast30Days();
  const maxMessages = Math.max(...last7.map(d => d.messages), 1);
  const hasActivity = last7.some(d => d.messages > 0);

  // HSK level calculation
  const { currentLevel, levelPct, nextLevelLabel } = useMemo(() => {
    const wordCount = words.length;
    let current = HSK_LEVELS[0];
    let next = HSK_LEVELS[1];

    for (let i = 0; i < HSK_LEVELS.length - 1; i++) {
      if (wordCount < HSK_LEVELS[i + 1].words) {
        current = HSK_LEVELS[i];
        next = HSK_LEVELS[i + 1];
        break;
      }
      current = HSK_LEVELS[HSK_LEVELS.length - 1];
      next = HSK_LEVELS[HSK_LEVELS.length - 1];
    }

    const prevWords = current.level > 1
      ? (HSK_LEVELS.find(l => l.level === current.level - 1)?.words ?? 0)
      : 0;
    const range = next.words - prevWords;
    const progress = Math.min(wordCount - prevWords, range);
    const pct = range > 0 ? Math.round((progress / range) * 100) : 100;

    return {
      currentLevel: current,
      levelPct: Math.min(pct, 100),
      nextLevelLabel: next.label,
    };
  }, [words.length]);

  // Achievement unlock states
  const unlockedIds = useMemo(
    () =>
      new Set(
        ACHIEVEMENTS
          .filter(a => a.check(stats, accuracy, words.length))
          .map(a => a.id)
      ),
    [stats, accuracy, words.length]
  );

  // Toast notifications for newly unlocked achievements
  useEffect(() => {
    const prevIds = new Set(getItem<string[]>('unlocked_achievements', []));
    const newlyUnlocked = ACHIEVEMENTS.filter(a => unlockedIds.has(a.id) && !prevIds.has(a.id));
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(a => {
        showToast(`${a.icon} Pencapaian Baru: ${a.name}! ${a.description}`, 'success');
      });
      setItem('unlocked_achievements', Array.from(unlockedIds));
    } else if (unlockedIds.size > 0) {
      // Sync storage with current state without toasting
      setItem('unlocked_achievements', Array.from(unlockedIds));
    }
  }, [unlockedIds, showToast]);

  const handleCopyStats = useCallback(() => {
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const text = [
      `📊 Progress Belajar Mandarin — Ziyan`,
      `📅 ${today}`,
      ``,
      `💬 ${stats.totalMessages} pesan terkirim`,
      `🔥 ${stats.streakDays} hari streak`,
      `🎯 ${accuracy}% akurasi`,
      `📖 ${words.length} kata tersimpan`,
      `⭐ Level ${stats.level} (${stats.xp} XP)`,
      ``,
      `Belajar Mandarin bersama Ziyan AI! 🐉`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      showToast('Statistik berhasil disalin!', 'success');
    }).catch(() => {
      showToast('Gagal menyalin statistik', 'info');
    });
  }, [stats, accuracy, words.length, showToast]);

  // Recent vocabulary (last 5 saved)
  const recentWords = useMemo(
    () =>
      [...words]
        .sort((a, b) => b.savedAt - a.savedAt)
        .slice(0, 5),
    [words]
  );

  // Encouragement text
  const encouragement = useMemo(() => {
    if (stats.streakDays >= 7) return 'Luar biasa! Terus pertahankan semangat belajarmu! 🚀';
    if (stats.streakDays >= 3) return 'Bagus! Kamu sedang membangun kebiasaan belajar yang kuat! 💪';
    if (stats.totalMessages >= 10) return 'Kamu berkembang pesat! Terus berlatih setiap hari! ✨';
    return 'Mulai perjalananmu belajar Mandarin bersama Ziyan! 🌟';
  }, [stats.streakDays, stats.totalMessages]);

  return (
    <div className="progress-dashboard">
      {/* ── Header ── */}
      <div className="dashboard-header glass-panel">
        <div className="dashboard-header-text">
          <h2 className="dashboard-title">Progress Belajar 📊</h2>
          <p className="dashboard-subtitle">{encouragement}</p>
        </div>
        <div className="dashboard-header-icon">
          <TrendingUp size={32} />
        </div>
      </div>

      {/* ── XP Progress Bar ── */}
      <XpProgressBar xp={stats.xp} level={stats.level} />

      {/* ── Copy Stats Button ── */}
      <button className="stats-copy-btn" onClick={handleCopyStats}>
        <Copy size={14} />
        Salin Statistik
      </button>

      {/* ── Stats Overview ── */}
      <div className="stats-overview">
        <div className="stat-card glass-panel">
          <div className="stat-card-icon" style={{ color: 'var(--primary)' }}>
            <MessageSquare size={22} />
          </div>
          <div className="stat-card-value">{stats.totalMessages.toLocaleString()}</div>
          <div className="stat-card-label">Total Pesan</div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-icon" style={{ color: 'var(--warning)' }}>
            <Flame size={22} />
          </div>
          <div className="stat-card-value">
            {stats.streakDays}
            <span className="stat-card-unit">hari</span>
          </div>
          <div className="stat-card-label">Streak</div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-icon" style={{ color: 'var(--accent)' }}>
            <Target size={22} />
          </div>
          <div className="stat-card-value">
            {accuracy}
            <span className="stat-card-unit">%</span>
          </div>
          <div className="stat-card-label">Akurasi</div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-icon" style={{ color: 'var(--success)' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-card-value">{words.length.toLocaleString()}</div>
          <div className="stat-card-label">Kosakata</div>
        </div>
      </div>

      {/* ── Weekly Activity Chart ── */}
      <section className="dashboard-section glass-panel">
        <h3 className="section-title">Aktivitas Minggu Ini</h3>
        {hasActivity ? (
          <div className="weekly-chart">
            <div className="chart-bars">
              {last7.map((day) => {
                const heightPct = Math.round((day.messages / maxMessages) * 100);
                const today = isToday(day.date);
                return (
                  <div key={day.date} className="chart-bar-wrapper">
                    <div className="chart-bar-tooltip">{day.messages} pesan</div>
                    <div
                      className={`chart-bar${today ? ' today' : ''}`}
                      style={{ '--bar-height': `${heightPct}%` } as React.CSSProperties}
                      aria-label={`${getDayLabel(day.date)}: ${day.messages} pesan`}
                    />
                    <div className={`chart-bar-day${today ? ' today-label' : ''}`}>
                      {getDayLabel(day.date)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chart-legend">
              <span className="chart-legend-dot today-dot" /> Hari ini
              <span className="chart-legend-dot other-dot" style={{ marginLeft: '16px' }} /> Hari lain
            </div>
          </div>
        ) : (
          <div className="chart-empty">
            <span className="chart-empty-icon">📭</span>
            <p>Belum ada aktivitas minggu ini</p>
            <p className="chart-empty-hint">Mulai chat untuk merekam aktivitas!</p>
          </div>
        )}
      </section>

      {/* ── Activity Heatmap ── */}
      <section className="dashboard-section glass-panel">
        <h3 className="section-title">Aktivitas 30 Hari</h3>
        <ActivityHeatmap days={last30} />
      </section>

      {/* ── Learning Progress ── */}
      <section className="dashboard-section glass-panel">
        <h3 className="section-title">Level Progress</h3>
        <div className="hsk-progress">
          <CircularProgress
            percent={levelPct}
            size={130}
            strokeWidth={11}
            label={`Menuju ${nextLevelLabel}`}
            sublabel={currentLevel.label}
          />
          <div className="hsk-milestones">
            {HSK_LEVELS.map((lv) => {
              const reached = words.length >= lv.words;
              return (
                <div
                  key={lv.level}
                  className={`hsk-milestone${reached ? ' reached' : ''}`}
                >
                  <div className="hsk-milestone-dot" />
                  <div className="hsk-milestone-info">
                    <span className="hsk-milestone-label">{lv.label}</span>
                    <span className="hsk-milestone-words">{lv.words} kata</span>
                  </div>
                  {reached && <span className="hsk-check">✓</span>}
                </div>
              );
            })}
            <div className="hsk-current-words">
              <span className="hsk-current-num">{words.length}</span>
              <span className="hsk-current-label"> kata tersimpan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Achievements ── */}
      <section className="dashboard-section glass-panel">
        <h3 className="section-title">
          Pencapaian
          <span className="achievement-count">
            {unlockedIds.size}/{ACHIEVEMENTS.length}
          </span>
        </h3>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            return (
              <div
                key={a.id}
                className={`achievement-badge${unlocked ? ' unlocked' : ' locked'}`}
                title={a.description}
              >
                <div className="achievement-icon">
                  {unlocked ? a.icon : <Lock size={20} />}
                </div>
                <div className="achievement-name">{a.name}</div>
                <div className="achievement-desc">{a.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Recent Vocabulary ── */}
      {recentWords.length > 0 && (
        <section className="dashboard-section glass-panel">
          <div className="section-header-row">
            <h3 className="section-title">Kosakata Terbaru</h3>
            {words.length > 5 && (
              <span className="see-all-link">
                {words.length} kata tersimpan
              </span>
            )}
          </div>
          <ul className="recent-vocab-list">
            {recentWords.map((w) => (
              <li key={w.id} className="recent-vocab-item">
                <span className="vocab-hanzi">{w.hanzi}</span>
                <span className="vocab-pinyin">{w.pinyin}</span>
                <span className="vocab-meaning">{w.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
