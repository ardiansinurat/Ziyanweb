// ============================================================
// FlashcardView — Flashcard & Quiz UI
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Volume2 } from 'lucide-react';
import HanziWriter from 'hanziwriter';
import type { VocabWord } from '../../types';
import type { FlashcardFilter, FlashcardMode, QuizOption } from '../../hooks/useFlashcard';
import { useFlashcard } from '../../hooks/useFlashcard';
import './flashcard.css';

interface FlashcardViewProps {
  vocabWords: VocabWord[];
  hskLevel: number;
  onSendToChat: (text: string) => void;
}

// ── Filter / Mode labels ──────────────────────────────────────
const FILTER_LABELS: { value: FlashcardFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: '1', label: 'HSK 1' },
  { value: '2', label: 'HSK 2' },
  { value: '3', label: 'HSK 3' },
  { value: 'review', label: '📅 Review' },
  { value: 'saved', label: 'Kosakata Saya' },
];

// ── Star rating helper ────────────────────────────────────────
function getStars(pct: number): number {
  if (pct >= 90) return 3;
  if (pct >= 60) return 2;
  return 1;
}

function getCompletionMessage(pct: number): string {
  if (pct >= 90) return 'Luar biasa! Kamu sudah hafal hampir semuanya! 🎉';
  if (pct >= 70) return 'Bagus sekali! Terus berlatih ya! 💪';
  if (pct >= 50) return 'Cukup bagus! Ulangi lagi untuk hasil lebih baik. 😊';
  return 'Jangan menyerah! Latihan terus, kamu pasti bisa! 🌟';
}

// ── Study card ────────────────────────────────────────────────
interface StudyCardProps {
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
  isFlipped: boolean;
  onFlip: () => void;
  onPlayAudio?: () => void;
}

function StudyCard({ hanzi, pinyin, meaning, example, isFlipped, onFlip, onPlayAudio }: StudyCardProps) {
  return (
    <div className="flashcard-container" style={{ position: 'relative' }} onClick={onFlip}>
      <div className={`flashcard${isFlipped ? ' flipped' : ''}`}>
        {/* Front */}
        <div className="flashcard-front">
          <div className="flashcard-hanzi">{hanzi}</div>
          <span className="flashcard-tap-hint">Ketuk untuk melihat arti</span>
        </div>
        {/* Back */}
        <div className="flashcard-back">
          <button
            className="flashcard-audio-btn"
            onClick={(e) => { e.stopPropagation(); onPlayAudio?.(); }}
            title="Dengarkan"
          >
            <Volume2 size={18} />
          </button>
          <div className="flashcard-hanzi" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>
            {hanzi}
          </div>
          <div className="flashcard-pinyin">{pinyin}</div>
          <div className="flashcard-divider" />
          <div className="flashcard-meaning">{meaning}</div>
          {example ? (
            <div className="flashcard-example">{example}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Quiz card ─────────────────────────────────────────────────
interface QuizCardProps {
  hanzi: string;
  options: QuizOption[];
  onAnswer: (optionId: string, isCorrect: boolean) => void;
  answered: string | null; // id of selected option
}

function QuizCard({ hanzi, options, onAnswer, answered }: QuizCardProps) {
  return (
    <>
      <div className="quiz-card">
        <div className="quiz-hanzi">{hanzi}</div>
        <div className="quiz-prompt">Pilih arti yang benar:</div>
      </div>
      <div className="quiz-options">
        {options.map(opt => {
          let cls = 'quiz-option';
          if (answered !== null) {
            if (opt.isCorrect) cls += ' correct';
            else if (opt.id === answered) cls += ' incorrect';
          }
          return (
            <button
              key={opt.id}
              className={cls}
              disabled={answered !== null}
              onClick={() => onAnswer(opt.id, opt.isCorrect)}
            >
              {opt.meaning}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ── Completion screen ─────────────────────────────────────────
interface CompletionProps {
  correct: number;
  incorrect: number;
  total: number;
  onReset: () => void;
}

function CompletionScreen({ correct, incorrect, total, onReset }: CompletionProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = getStars(pct);
  const msg = getCompletionMessage(pct);

  return (
    <div className="completion-screen">
      <div className="glass-panel">
        <div className="stars-display">
          {[1, 2, 3].map(s => (
            <span key={s}>{s <= stars ? '⭐' : '☆'}</span>
          ))}
        </div>
        <div className="completion-score">{pct}%</div>
        <div className="completion-score-label">Skor kamu</div>
        <h2 className="completion-title">Selesai!</h2>
        <p className="completion-message">{msg}</p>
        <div className="completion-detail">
          <span className="correct-count">✓ {correct} benar</span>
          <span className="incorrect-count">✗ {incorrect} salah</span>
        </div>
      </div>
      <div className="completion-actions">
        <button className="btn-primary" onClick={onReset}>
          Ulangi
        </button>
      </div>
    </div>
  );
}

// ── HanziWriter practice ──────────────────────────────────────
interface HanziPracticeProps {
  hanzi: string;
}

function HanziPractice({ hanzi }: HanziPracticeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const character = hanzi.charAt(0);
    const isDark = document.documentElement.getAttribute('data-theme')?.startsWith('dark') ?? false;

    // Clear any previous content
    containerRef.current.innerHTML = '';

    const writer = HanziWriter.create(containerRef.current, character, {
      width: 180,
      height: 180,
      padding: 8,
      strokeAnimationSpeed: 1.5,
      delayBetweenStrokes: 50,
      strokeColor: '#4A90D9',
      outlineColor: isDark ? '#4a4a5a' : '#cccccc',
      drawingColor: '#ef4444',
      drawingWidth: 4,
      showHintAfterMisses: 2,
      highlightOnComplete: true,
    });
    writer.quiz({ onComplete: () => {} });

    return () => {
      if ((writer as any).cancelQuiz) {
        (writer as any).cancelQuiz();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [hanzi]);

  return (
    <>
      <div
        ref={containerRef}
        className="hanzi-practice-canvas"
        style={{ width: 180, height: 180 }}
      />
      <div className="hanzi-practice-hint">Telusuri karakter untuk berlatih</div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────
export default function FlashcardView({
  vocabWords,
  hskLevel: _hskLevel,
  onSendToChat: _onSendToChat,
}: FlashcardViewProps) {
  const {
    state,
    deck,
    currentCard,
    quizOptions,
    flipCard,
    nextCard,
    prevCard,
    markCorrect,
    markIncorrect,
    resetDeck,
    setFilter,
    setMode,
    srsData,
    reviewCount,
  } = useFlashcard(vocabWords, 'all', 'study');

  // Quiz: track selected answer id (null = unanswered)
  const [answeredId, setAnsweredId] = useState<string | null>(null);

  // Study: track writing practice visibility
  const [showPractice, setShowPractice] = useState(false);

  // Auto-play hanzi when card is flipped to back
  useEffect(() => {
    if (state.isFlipped && currentCard && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(currentCard.hanzi);
      u.lang = 'zh-CN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  }, [state.isFlipped, currentCard?.hanzi]);

  const playCurrentCard = useCallback(() => {
    if (!currentCard || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentCard.hanzi);
    u.lang = 'zh-CN';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }, [currentCard]);

  // Reset answeredId and showPractice whenever card changes
  useEffect(() => {
    setAnsweredId(null);
    setShowPractice(false);
  }, [state.currentIndex, state.mode]);

  const handleQuizAnswer = useCallback(
    (optionId: string, isCorrect: boolean) => {
      if (answeredId !== null) return;
      setAnsweredId(optionId);
      if (isCorrect) {
        setTimeout(() => {
          markCorrect();
        }, 900);
      } else {
        setTimeout(() => {
          markIncorrect();
        }, 900);
      }
    },
    [answeredId, markCorrect, markIncorrect],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't capture keys when user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (state.mode === 'study' && currentCard && !state.isComplete) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          flipCard();
        } else if ((e.key === 'ArrowRight' || e.key === 'k') && state.isFlipped) {
          e.preventDefault();
          markCorrect();
        } else if ((e.key === 'ArrowLeft' || e.key === 'j') && state.isFlipped) {
          e.preventDefault();
          markIncorrect();
        } else if (e.key === 'n') {
          e.preventDefault();
          nextCard();
        } else if (e.key === 'p') {
          e.preventDefault();
          prevCard();
        }
      } else if (state.mode === 'quiz' && currentCard && !state.isComplete && answeredId === null) {
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < quizOptions.length) {
          e.preventDefault();
          handleQuizAnswer(quizOptions[idx].id, quizOptions[idx].isCorrect);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.mode, state.isFlipped, state.isComplete, currentCard, answeredId, flipCard, markCorrect, markIncorrect, nextCard, prevCard, quizOptions, handleQuizAnswer]);

  const total = state.score.correct + state.score.incorrect;
  const progressPct = deck.length > 0
    ? Math.round((state.currentIndex / deck.length) * 100)
    : 0;

  // ── Empty state ───────────────────────────────────────────
  if (deck.length === 0) {
    return (
      <div className="flashcard-view">
        <div className="flashcard-header">
          <ChevronLeft size={22} className="btn-icon back-btn" style={{ opacity: 0.4 }} />
          <h1 className="header-title">Kartu Belajar 🃏</h1>
        </div>
        <div className="filter-tabs">
          {FILTER_LABELS.map(f => (
            <button
              key={f.value}
              className={`filter-tab${state.filter === f.value ? ' active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value === 'review' && reviewCount > 0 && (
                <span className="filter-btn-badge">{reviewCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flashcard-empty">
          <div className="flashcard-empty-icon">📚</div>
          {state.filter === 'review' ? (
            <p>Tidak ada kartu yang perlu direview hari ini. Terus berlatih! 🎉</p>
          ) : (
            <p>Belum ada kosakata untuk filter ini.</p>
          )}
          {state.filter === 'saved' && (
            <p style={{ fontSize: '0.85rem' }}>
              Simpan kata dari Chat untuk belajar di sini.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Completion ────────────────────────────────────────────
  if (state.isComplete) {
    return (
      <div className="flashcard-view">
        <div className="flashcard-header">
          <ChevronLeft size={22} className="btn-icon back-btn" style={{ opacity: 0.4 }} />
          <h1 className="header-title">Kartu Belajar 🃏</h1>
        </div>
        <CompletionScreen
          correct={state.score.correct}
          incorrect={state.score.incorrect}
          total={total}
          onReset={resetDeck}
        />
      </div>
    );
  }

  // ── Main view ─────────────────────────────────────────────
  return (
    <div className="flashcard-view">
      {/* Header */}
      <div className="flashcard-header">
        <ChevronLeft size={22} className="btn-icon back-btn" style={{ opacity: 0.4 }} />
        <h1 className="header-title">Kartu Belajar 🃏</h1>
        <span className="header-progress">
          {state.currentIndex + 1} / {deck.length}
        </span>
      </div>

      {/* Progress bar (quiz mode) */}
      {state.mode === 'quiz' && (
        <div className="flashcard-progress-bar">
          <div
            className="flashcard-progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Filter tabs */}
      <div className="filter-tabs">
        {FILTER_LABELS.map(f => (
          <button
            key={f.value}
            className={`filter-tab${state.filter === f.value ? ' active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {f.value === 'review' && reviewCount > 0 && (
              <span className="filter-btn-badge">{reviewCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Mode toggle */}
      <div className="mode-toggle">
        {(['study', 'quiz'] as FlashcardMode[]).map(m => (
          <button
            key={m}
            className={`mode-toggle-btn${state.mode === m ? ' active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'study' ? 'Mode Belajar' : 'Mode Kuis'}
          </button>
        ))}
      </div>

      {/* Score chips */}
      {(state.score.correct > 0 || state.score.incorrect > 0) && (
        <div className="score-chips">
          <span className="score-chip correct">✓ {state.score.correct}</span>
          <span className="score-chip incorrect">✗ {state.score.incorrect}</span>
        </div>
      )}

      {/* Card area */}
      {currentCard && (
        <>
          {state.mode === 'study' ? (
            <>
              <StudyCard
                hanzi={currentCard.hanzi}
                pinyin={currentCard.pinyin}
                meaning={currentCard.meaning}
                example={currentCard.example}
                isFlipped={state.isFlipped}
                onFlip={flipCard}
                onPlayAudio={playCurrentCard}
              />
              {/* Controls */}
              <div className="flashcard-controls">
                <button
                  className="btn-icon"
                  onClick={prevCard}
                  disabled={state.currentIndex === 0}
                  title="Sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="flashcard-action-btn incorrect"
                  onClick={markIncorrect}
                >
                  <ThumbsDown size={16} />
                  Tidak Tahu
                </button>
                <button
                  className="flashcard-action-btn correct"
                  onClick={markCorrect}
                >
                  <ThumbsUp size={16} />
                  Tahu
                </button>
                <button
                  className="btn-icon"
                  onClick={nextCard}
                  title="Berikutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              {/* Keyboard hint */}
              {state.mode === 'study' && !state.isComplete && deck.length > 0 && (
                <div className="flashcard-keyboard-hint">
                  <kbd>Space</kbd> balik · <kbd>→</kbd> tahu · <kbd>←</kbd> tidak tahu
                </div>
              )}
              {/* SRS interval hint (shown when card is flipped and has SRS data) */}
              {state.isFlipped && currentCard && srsData[currentCard.id] && (
                <div className="srs-interval-hint">
                  ⏱ Review ulang dalam {srsData[currentCard.id].interval} hari
                </div>
              )}
              {/* HanziWriter writing practice toggle */}
              {state.isFlipped && currentCard && (
                <>
                  <button
                    className="hanzi-practice-btn"
                    onClick={() => setShowPractice(p => !p)}
                  >
                    ✍️ Latihan Tulis
                  </button>
                  {showPractice && (
                    <div className="hanzi-practice-section">
                      <HanziPractice hanzi={currentCard.hanzi} />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <QuizCard
              hanzi={currentCard.hanzi}
              options={quizOptions}
              onAnswer={handleQuizAnswer}
              answered={answeredId}
            />
          )}
        </>
      )}
    </div>
  );
}

// Re-export for consumers that need named imports
export type { FlashcardViewProps };
