// ============================================================
// CharacterModal — Display stroke order for Chinese characters
// ============================================================

import { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { X, Play, RefreshCw } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  character: string | null;
  onClose: () => void;
}

export function CharacterModal({ character, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!character || !containerRef.current) return;

    // Clear previous
    containerRef.current.innerHTML = '';

    const isChineseCharacter = /[\u4E00-\u9FA5]/.test(character);
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
    writerRef.current?.animateCharacter();
  };

  const handleQuiz = () => {
    writerRef.current?.quiz({
      onMistake: (strokeData: any) => {
        console.log('Mistake', strokeData);
      },
      onComplete: () => {
        console.log('Quiz complete!');
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel character-modal">
        <div className="modal-header">
          <h2>Urutan Guratan</h2>
          <button className="btn-icon" onClick={onClose} title="Tutup">
            <X size={20} />
          </button>
        </div>

        <div className="character-writer-container" ref={containerRef}>
          {/* HanziWriter will inject SVG here */}
          {!/[\u4E00-\u9FA5]/.test(character) && (
            <p className="not-chinese">Pilih karakter Hanzi untuk melihat urutan guratan.</p>
          )}
        </div>

        {/[\u4E00-\u9FA5]/.test(character) && (
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
