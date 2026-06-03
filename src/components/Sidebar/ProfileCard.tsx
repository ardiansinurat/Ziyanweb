// ============================================================
// ProfileCard — User profile display in sidebar
// ============================================================

import { Settings } from 'lucide-react';

// XP thresholds for levels 1–10 (mirrors useStats)
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500, 4500];

interface Props {
  name: string;
  avatar: string;
  hskLevel: number;
  xp?: number;
  level?: number;
  onOpenSettings: () => void;
}

export function ProfileCard({ name, avatar, hskLevel, xp = 0, level = 1, onOpenSettings }: Props) {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progressPct = level >= LEVEL_THRESHOLDS.length
    ? 100
    : Math.min(100, Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100));

  return (
    <div className="profile-card">
      {avatar ? (
        <img src={avatar} alt="Profile" className="avatar" style={{ objectFit: 'cover' }} />
      ) : (
        <div className="avatar">{name.substring(0, 2).toUpperCase()}</div>
      )}
      <div className="profile-info" style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '6px',
              padding: '1px 5px',
              flexShrink: 0,
              letterSpacing: '0.03em',
            }}
          >
            Lv.{level}
          </span>
        </h2>
        <p style={{ marginBottom: '4px' }}>HSK Level {hskLevel}</p>
        {/* XP progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: 'var(--glass-border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'var(--primary)',
                borderRadius: '2px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>
            {xp} XP
          </span>
        </div>
      </div>
      <button className="btn-icon" onClick={onOpenSettings} title="Pengaturan">
        <Settings size={20} />
      </button>
    </div>
  );
}
