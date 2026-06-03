// ============================================================
// CharacterModal — Display stroke order for Chinese characters
// ============================================================

import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { X, Play, RefreshCw, CheckCircle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  character: string | null;
  onClose: () => void;
}

type Mode = 'view' | 'quiz';

export function CharacterModal({ character, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const { isDark } = useTheme();

  const [mode, setMode] = useState<Mode>('view');
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [mistakeFlash, setMistakeFlash] = useState(false);
  const [mistakeMsg, setMistakeMsg] = useState('');

  useEffect(() => {
    if (!character || !containerRef.current) return;

    // Clear previous
    containerRef.current.innerHTML = '';
    // Reset quiz state when character changes
    setMode('view');
    setQuizCorrect(0);
    setQuizTotal(0);
    setQuizDone(false);
    setMistakeFlash(false);
    setMistakeMsg('');

    const isChineseCharacter = /[一-龥]/.test(character);
    if (!isChineseCharacter) return;

    // Create HanziWriter instance
    writerRef.current = HanziWriter.create(containerRef.current, character, {
      width: 200,
      height: 200,
      padding: 10,
      strokeAnimationSpeed: 1.5,
      delayBetweenStrokes: 150,
      strokeColor: isDark ? '#ffffff' : '#333333',
      radicalColor: '#ff9a9e',
      outlineColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
    });

    // Auto animate on open
    setTimeout(() => {
      writerRef.current?.animateCharacter();
    }, 300);

  }, [character, isDark]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (character) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [character, onClose]);

  if (!character) return null;

  const handleAnimate = () => {
    setMode('view');
    setQuizDone(false);
    setMistakeMsg('');
    writerRef.current?.animateCharacter();
  };

  const handleQuiz = () => {
    setMode('quiz');
    setQuizCorrect(0);
    setQuizTotal(0);
    setQuizDone(false);
    setMistakeFlash(false);
    setMistakeMsg('');

    writerRef.current?.quiz({
      onMistake: (_strokeData: unknown) => {
        setQuizTotal(prev => prev + 1);
        setMistakeFlash(true);
        setMistakeMsg('Coba lagi!');
        setTimeout(() => {
          setMistakeFlash(false);
          setMistakeMsg('');
        }, 700);
      },
      onCorrectStroke: () => {
        setQuizTotal(prev => prev + 1);
        setQuizCorrect(prev => prev + 1);
        setMistakeMsg('');
      },
      onComplete: (_summaryData: unknown) => {
        setQuizDone(true);
      },
    });
  };

  const isChineseCharacter = /[一-龥]/.test(character);

  const scorePercent = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 100;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel character-modal">
        <div className="modal-header">
          <h2>Urutan Guratan</h2>
          <button className="btn-icon" onClick={onClose} title="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Quiz score bar */}
        {mode === 'quiz' && !quizDone && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '6px 0',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
              {quizCorrect}
            </span>
            <span>/</span>
            <span>{quizTotal}</span>
            <span>guratan benar</span>
          </div>
        )}

        {/* Mistake flash container */}
        <div
          className="character-writer-container"
          ref={containerRef}
          style={{
            transition: 'background 0.15s ease',
            background: mistakeFlash ? 'rgba(239,68,68,0.12)' : undefined,
            borderRadius: '12px',
          }}
        >
          {!isChineseCharacter && (
            <p className="not-chinese">Pilih karakter Hanzi untuk melihat urutan guratan.</p>
          )}
        </div>

        {/* Mistake feedback message */}
        {mistakeMsg && (
          <div style={{
            textAlign: 'center',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 600,
            marginTop: '-4px',
            animation: 'slideIn 0.15s ease',
          }}>
            {mistakeMsg}
          </div>
        )}

        {/* Quiz complete overlay */}
        {quizDone && (
          <div style={{
            textAlign: 'center',
            padding: '12px 0 4px',
            animation: 'slideIn 0.3s ease',
          }}>
            <CheckCircle size={32} style={{ color: 'var(--success)', marginBottom: '6px' }} />
            <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--success)' }}>
              Quiz Selesai!
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Akurasi: <strong style={{ color: scorePercent >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                {scorePercent}%
              </strong>
              {' '}({quizCorrect}/{quizTotal} guratan benar)
            </div>
          </div>
        )}

        {isChineseCharacter && (
          <div className="character-actions">
            <button className="btn-secondary flex-center gap-2" onClick={handleAnimate}>
              <Play size={16} /> Animasi
            </button>
            <button className="btn-primary flex-center gap-2" onClick={handleQuiz}>
              <RefreshCw size={16} /> Mode Latihan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
