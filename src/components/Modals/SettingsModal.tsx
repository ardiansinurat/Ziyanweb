// ============================================================
// SettingsModal — Profile & theme settings
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import type { ThemeId, UserStats, VocabWord } from '../../types';
import { THEME_OPTIONS } from '../../types';
import { getItem } from '../../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar: string;
  theme: ThemeId;
  hskLevel: number;
  dailyGoal: number;
  onSave: (data: { name: string; avatar: string; theme: ThemeId; hskLevel: number; dailyGoal: number }) => void;
  onResetStats?: () => void;
  onResetChat?: () => void;
}

export function SettingsModal({ isOpen, onClose, userName, userAvatar, theme, hskLevel, dailyGoal, onSave, onResetStats, onResetChat }: Props) {
  const [tempName, setTempName] = useState(userName);
  const [tempAvatar, setTempAvatar] = useState(userAvatar);
  const [tempTheme, setTempTheme] = useState<ThemeId>(theme);
  const [tempHsk, setTempHsk] = useState(hskLevel);
  const [tempGoal, setTempGoal] = useState(dailyGoal);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset temp state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempName(userName);
      setTempAvatar(userAvatar);
      setTempTheme(theme);
      setTempHsk(hskLevel);
      setTempGoal(dailyGoal);
    }
  }, [isOpen, userName, userAvatar, theme, hskLevel, dailyGoal]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStats = getItem<UserStats>('user_stats', {
    totalMessages: 0, totalWords: 0, corrections: 0, correctMessages: 0,
    streakDays: 0, lastActiveDate: '', dailyMessageCount: 0, xp: 0, level: 1,
  });
  const vocabCount = getItem<VocabWord[]>('vocab_words', []).length;
  const accuracy = currentStats.totalMessages > 0
    ? Math.round((currentStats.correctMessages / currentStats.totalMessages) * 100)
    : 100;

  const handleSave = () => {
    onSave({ name: tempName, avatar: tempAvatar, theme: tempTheme, hskLevel: tempHsk, dailyGoal: tempGoal });
    onClose();
  };

  const handleExportData = () => {
    const data: Record<string, unknown> = {};
    const keys = [
      'user_stats', 'vocab_words', 'current_messages', 'activity_history',
      'srs_data', 'flashcard_known', 'daily_word_visited', 'unlocked_achievements',
      'vocab_mastery', 'quick_phrase_favs', 'quick_phrase_usage', 'msg_reactions', 'msg_thumbs',
    ];
    keys.forEach(k => {
      try {
        const raw = localStorage.getItem(`ziyan_${k}`);
        if (raw) data[k] = JSON.parse(raw);
      } catch {
        // skip
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ziyan-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>⚙️ Pengaturan</h2>
          <button className="btn-icon" onClick={onClose} title="Tutup">
            <X size={20} />
          </button>
        </div>

        <div className="form-group">
          <label>Nama Profil</label>
          <input
            type="text"
            className="form-input"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Foto Profil</label>
          <input
            type="file"
            accept="image/*"
            className="form-input"
            style={{ padding: '8px' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setTempAvatar(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {tempAvatar && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={tempAvatar} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preview</span>
            </div>
          )}
          {/* Emoji avatar quick-pick */}
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Atau pilih avatar emoji:</p>
            <div className="avatar-emoji-picker">
              {['🐼', '🐯', '🦁', '🐻', '🐨', '🦊', '🐱', '🐶', '🐧', '🐸', '🦋', '🌸'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`avatar-emoji-option${tempAvatar === emoji ? ' selected' : ''}`}
                  onClick={() => setTempAvatar(emoji)}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Level HSK</label>
          <div className="hsk-selector">
            {[1, 2, 3, 4, 5, 6].map(level => (
              <button
                key={level}
                className={`hsk-btn ${tempHsk === level ? 'active' : ''}`}
                onClick={() => setTempHsk(level)}
              >
                HSK {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Tema Tampilan</label>
          <div className="custom-dropdown-container" ref={dropdownRef}>
            <div
              className="custom-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{THEME_OPTIONS.find(t => t.id === tempTheme)?.label}</span>
              <ChevronDown size={18} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </div>

            {isDropdownOpen && (
              <div className="custom-dropdown-menu glass-panel">
                <div className="dropdown-category">Light Mode</div>
                {THEME_OPTIONS.filter(t => t.category === 'Light Mode').map(t => (
                  <div
                    key={t.id}
                    className={`dropdown-item ${tempTheme === t.id ? 'active' : ''}`}
                    onClick={() => { setTempTheme(t.id); setIsDropdownOpen(false); }}
                  >
                    <span>{t.label}</span>
                    {tempTheme === t.id && <Check size={16} className="active-icon" />}
                  </div>
                ))}

                <div className="dropdown-divider" />

                <div className="dropdown-category">Dark Mode</div>
                {THEME_OPTIONS.filter(t => t.category === 'Dark Mode').map(t => (
                  <div
                    key={t.id}
                    className={`dropdown-item ${tempTheme === t.id ? 'active' : ''}`}
                    onClick={() => { setTempTheme(t.id); setIsDropdownOpen(false); }}
                  >
                    <span>{t.label}</span>
                    {tempTheme === t.id && <Check size={16} className="active-icon" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Target Pesan Harian</label>
          <div className="goal-selector">
            {[5, 10, 15, 20, 30].map(g => (
              <button
                key={g}
                className={`goal-btn ${tempGoal === g ? 'active' : ''}`}
                onClick={() => setTempGoal(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            pesan per hari
          </p>
        </div>

        {/* Stats Overview */}
        <div className="form-group">
          <label>📊 Progress Belajar</label>
          <div className="settings-stats-overview">
            <div className="settings-stat-chip">
              <span className="settings-stat-chip-value">Lv.{currentStats.level}</span>
              <span className="settings-stat-chip-label">{currentStats.xp} XP</span>
            </div>
            <div className="settings-stat-chip">
              <span className="settings-stat-chip-value">{currentStats.streakDays}🔥</span>
              <span className="settings-stat-chip-label">hari streak</span>
            </div>
            <div className="settings-stat-chip">
              <span className="settings-stat-chip-value">{accuracy}%</span>
              <span className="settings-stat-chip-label">akurasi</span>
            </div>
            <div className="settings-stat-chip">
              <span className="settings-stat-chip-value">{vocabCount}</span>
              <span className="settings-stat-chip-label">kosakata</span>
            </div>
          </div>
        </div>

        <div className="form-group danger-zone">
          <label style={{ color: 'var(--warning)' }}>⚠️ Zona Bahaya</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn-secondary"
              onClick={handleExportData}
              type="button"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              📦 Backup Data
            </button>
            {onResetStats && (
              <button
                className="btn-danger-sm"
                onClick={() => { if (confirm('Reset semua statistik belajar? Ini tidak bisa dibatalkan.')) { onResetStats(); onClose(); } }}
                type="button"
              >
                Reset Statistik
              </button>
            )}
            {onResetChat && (
              <button
                className="btn-danger-sm"
                onClick={() => { if (confirm('Hapus riwayat percakapan? Ini tidak bisa dibatalkan.')) { onResetChat(); onClose(); } }}
                type="button"
              >
                Hapus Riwayat Chat
              </button>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '10px 24px' }} onClick={handleSave}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
