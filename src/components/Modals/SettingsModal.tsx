// ============================================================
// SettingsModal — Profile & theme settings
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import type { ThemeId } from '../../types';
import { THEME_OPTIONS } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar: string;
  theme: ThemeId;
  hskLevel: number;
  onSave: (data: { name: string; avatar: string; theme: ThemeId; hskLevel: number }) => void;
}

export function SettingsModal({ isOpen, onClose, userName, userAvatar, theme, hskLevel, onSave }: Props) {
  const [tempName, setTempName] = useState(userName);
  const [tempAvatar, setTempAvatar] = useState(userAvatar);
  const [tempTheme, setTempTheme] = useState<ThemeId>(theme);
  const [tempHsk, setTempHsk] = useState(hskLevel);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset temp state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempName(userName);
      setTempAvatar(userAvatar);
      setTempTheme(theme);
      setTempHsk(hskLevel);
    }
  }, [isOpen, userName, userAvatar, theme, hskLevel]);

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

  const handleSave = () => {
    onSave({ name: tempName, avatar: tempAvatar, theme: tempTheme, hskLevel: tempHsk });
    onClose();
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
