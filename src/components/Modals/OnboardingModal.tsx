// ============================================================
// OnboardingModal — shown once on first visit
// ============================================================

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ThemeId } from '../../types';

interface Props {
  isOpen: boolean;
  onComplete: (data: { name: string; hskLevel: number; theme: ThemeId }) => void;
}

export function OnboardingModal({ isOpen, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [hskLevel, setHskLevel] = useState(1);
  const [theme, setTheme] = useState<ThemeId>('light-pastel');

  if (!isOpen) return null;

  const themes: { id: ThemeId; emoji: string; label: string }[] = [
    { id: 'light-pastel', emoji: '🌸', label: 'Pastel' },
    { id: 'light-vintage', emoji: '📜', label: 'Vintage' },
    { id: 'light-minimalist', emoji: '⬜', label: 'Minimalist' },
    { id: 'dark-astronaut', emoji: '🚀', label: 'Astronaut' },
    { id: 'dark-bintang', emoji: '⭐', label: 'Bintang' },
    { id: 'dark-aurora', emoji: '🌌', label: 'Aurora' },
  ];

  const handleComplete = () => {
    onComplete({ name: name.trim() || 'Pelajar', hskLevel, theme });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content glass-panel onboarding-modal">
        {/* Progress dots */}
        <div className="onboarding-dots">
          {[0, 1, 2].map(i => (
            <div key={i} className={`onboarding-dot ${step >= i ? 'active' : ''}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="onboarding-step">
            <div className="onboarding-emoji">🐉</div>
            <h2>Selamat Datang di Ziyan!</h2>
            <p>Tutor Mandarin interaktifmu untuk bahasa Indonesia. Yuk mulai perjalanan belajarmu!</p>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Siapa namamu?</label>
              <input
                type="text"
                className="form-input"
                placeholder="Masukkan namamu..."
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setStep(1)}
                autoFocus
              />
            </div>
            <button className="btn-primary onboarding-next-btn" onClick={() => setStep(1)}>
              Lanjut <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-step">
            <div className="onboarding-emoji">📚</div>
            <h2>Level Mandarinmu?</h2>
            <p>Pilih level yang sesuai dengan kemampuanmu saat ini. Kamu bisa mengubahnya nanti.</p>
            <div className="hsk-selector" style={{ marginTop: '20px', justifyContent: 'center' }}>
              {[
                { level: 1, desc: 'Pemula' },
                { level: 2, desc: 'Dasar' },
                { level: 3, desc: 'Menengah' },
                { level: 4, desc: 'Atas' },
                { level: 5, desc: 'Lanjut' },
                { level: 6, desc: 'Mahir' },
              ].map(({ level, desc }) => (
                <button
                  key={level}
                  className={`hsk-btn ${hskLevel === level ? 'active' : ''}`}
                  onClick={() => setHskLevel(level)}
                  title={desc}
                >
                  HSK {level}
                  <span style={{ display: 'block', fontSize: '0.6rem', opacity: 0.8 }}>{desc}</span>
                </button>
              ))}
            </div>
            <button className="btn-primary onboarding-next-btn" onClick={() => setStep(2)}>
              Lanjut <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <div className="onboarding-emoji">🎨</div>
            <h2>Pilih Tema Favoritmu</h2>
            <p>Belajar lebih menyenangkan dengan tampilan yang kamu sukai!</p>
            <div className="onboarding-themes">
              {themes.map(t => (
                <button
                  key={t.id}
                  className={`onboarding-theme-btn ${theme === t.id ? 'active' : ''}`}
                  onClick={() => setTheme(t.id)}
                >
                  <span className="theme-emoji">{t.emoji}</span>
                  <span className="theme-label">{t.label}</span>
                </button>
              ))}
            </div>
            <button className="btn-primary onboarding-next-btn" onClick={handleComplete}>
              Mulai Belajar! 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
