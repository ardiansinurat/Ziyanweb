// ============================================================
// ProfileCard — User profile display in sidebar
// ============================================================

import { Settings, Sun, Moon } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

// XP thresholds for levels 1–10 (mirrors useStats)
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500, 4500];

interface Props {
  name: string;
  avatar: string;
  hskLevel: number;
  xp?: number;
  level?: number;
  onOpenSettings: () => void;
  theme?: string;
  onToggleTheme?: () => void;
}

export function ProfileCard({ name, avatar, hskLevel, xp = 0, level = 1, onOpenSettings, theme, onToggleTheme }: Props) {
  const prevLevel = useRef(level);
  const [showAnim, setShowAnim] = useState(false);

  useEffect(() => {
    if (level > (prevLevel.current ?? level)) {
      setShowAnim(true);
      setTimeout(() => setShowAnim(false), 700);
    }
    prevLevel.current = level;
  }, [level]);

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progressPct = level >= LEVEL_THRESHOLDS.length
    ? 100
    : Math.min(100, Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100));

  const isImageUrl = avatar && /^(data:|http|blob:|\/)/.test(avatar);

  return (
    <div className="profile-card">
      {avatar ? (
        isImageUrl ? (
          <img src={avatar} alt="Profile" className="avatar" style={{ objectFit: 'cover' }} />
        ) : (
          <div className="avatar avatar-emoji">{avatar}</div>
        )
      ) : (
        <div className="avatar">{name.substring(0, 2).toUpperCase()}</div>
      )}
      <div className="profile-info" style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          <span
            className={showAnim ? 'level-up-anim' : undefined}
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '6px',
              padding: '1px 5px',
              flexShrink: 0,
              letterSpacing: '0.03em',
              display: 'inline-block',
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
      {onToggleTheme && (
        <button
          className="quick-theme-btn"
          onClick={onToggleTheme}
          title={theme?.startsWith('dark') ? 'Mode Terang' : 'Mode Gelap'}
        >
          {theme?.startsWith('dark') ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      )}
      <button className="btn-icon" onClick={onOpenSettings} title="Pengaturan">
        <Settings size={20} />
      </button>
    </div>
  );
}
