// ============================================================
// useFlashcard — Flashcard / Quiz state management hook
// ============================================================

import { useState, useCallback, useMemo } from 'react';
import type { HSKWord } from '../data/hsk-words';
import type { VocabWord } from '../types';
import { getItem, setItem } from '../utils/storage';
import { HSK_WORDS_BY_LEVEL, HSK_WORDS } from '../data/hsk-words';

export type FlashcardMode = 'study' | 'quiz';
export type FlashcardFilter = 'all' | '1' | '2' | '3' | 'saved';

export interface FlashcardState {
  currentIndex: number;
  isFlipped: boolean;
  score: { correct: number; incorrect: number };
  isComplete: boolean;
  mode: FlashcardMode;
  filter: FlashcardFilter;
  deck: HSKWord[];
}

// Convert a VocabWord (saved by user) to the HSKWord shape so it
// can live alongside HSK cards in the same deck.
function vocabToHSK(v: VocabWord): HSKWord {
  return {
    id: `saved_${v.id}`,
    hanzi: v.hanzi,
    pinyin: v.pinyin,
    meaning: v.meaning,
    example: v.example ?? '',
    hskLevel: 1,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `count` unique random items from `pool`, excluding `exclude`. */
function pickRandom<T>(pool: T[], exclude: T, count: number): T[] {
  const candidates = pool.filter(x => x !== exclude);
  return shuffle(candidates).slice(0, count);
}

export interface QuizOption {
  id: string;
  meaning: string;
  isCorrect: boolean;
}

export function useFlashcard(
  vocabWords: VocabWord[],
  initialFilter: FlashcardFilter = 'all',
  initialMode: FlashcardMode = 'study',
) {
  // ── Derived deck helpers ─────────────────────────────────────

  const savedCards = useMemo(() => vocabWords.map(vocabToHSK), [vocabWords]);

  const buildDeck = useCallback(
    (filter: FlashcardFilter): HSKWord[] => {
      switch (filter) {
        case '1': return shuffle([...HSK_WORDS_BY_LEVEL[1]]);
        case '2': return shuffle([...HSK_WORDS_BY_LEVEL[2]]);
        case '3': return shuffle([...HSK_WORDS_BY_LEVEL[3]]);
        case 'saved': return shuffle([...savedCards]);
        default: return shuffle([...HSK_WORDS]);
      }
    },
    [savedCards],
  );

  // ── Core state ────────────────────────────────────────────────

  const [filter, setFilterState] = useState<FlashcardFilter>(initialFilter);
  const [mode, setModeState] = useState<FlashcardMode>(initialMode);
  const [deck, setDeck] = useState<HSKWord[]>(() => buildDeck(initialFilter));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [knownWords, setKnownWordsState] = useState<string[]>(() =>
    getItem<string[]>('flashcard_known', []),
  );

  const currentCard: HSKWord | null = deck[currentIndex] ?? null;

  // ── Quiz options (4-choice) ──────────────────────────────────

  const quizOptions = useMemo<QuizOption[]>(() => {
    if (!currentCard) return [];
    const pool = HSK_WORDS.length > 3 ? HSK_WORDS : deck;
    const distractors = pickRandom(pool, currentCard, 3);
    const options: QuizOption[] = [
      { id: currentCard.id, meaning: currentCard.meaning, isCorrect: true },
      ...distractors.map(d => ({ id: d.id, meaning: d.meaning, isCorrect: false })),
    ];
    return shuffle(options);
  }, [currentCard, deck]);

  // ── Actions ──────────────────────────────────────────────────

  const flipCard = useCallback(() => setIsFlipped(prev => !prev), []);

  const advance = useCallback(
    (newDeck: HSKWord[], newIndex: number) => {
      setDeck(newDeck);
      setIsFlipped(false);
      if (newIndex >= newDeck.length) {
        setIsComplete(true);
      } else {
        setCurrentIndex(newIndex);
      }
    },
    [],
  );

  const nextCard = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, deck.length]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const markCorrect = useCallback(() => {
    if (!currentCard) return;
    // Persist as known
    const updated = Array.from(new Set([...knownWords, currentCard.id]));
    setKnownWordsState(updated);
    setItem('flashcard_known', updated);
    setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    advance(deck, currentIndex + 1);
  }, [currentCard, knownWords, deck, currentIndex, advance]);

  const markIncorrect = useCallback(() => {
    if (!currentCard) return;
    setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    // Reshuffle the card back into the remaining unseen portion of the deck
    const remaining = deck.slice(currentIndex + 1);
    const insertAt = remaining.length > 0
      ? Math.floor(Math.random() * remaining.length) + 1
      : 0;
    const newRemaining = [...remaining];
    newRemaining.splice(insertAt, 0, currentCard);
    const newDeck = [...deck.slice(0, currentIndex), ...newRemaining];
    advance(newDeck, currentIndex);
  }, [currentCard, deck, currentIndex, advance]);

  const resetDeck = useCallback(() => {
    const newDeck = buildDeck(filter);
    setDeck(newDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
    setIsComplete(false);
  }, [filter, buildDeck]);

  const shuffleDeck = useCallback(() => {
    setDeck(prev => shuffle([...prev]));
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  }, []);

  const setFilter = useCallback(
    (newFilter: FlashcardFilter) => {
      setFilterState(newFilter);
      const newDeck = buildDeck(newFilter);
      setDeck(newDeck);
      setCurrentIndex(0);
      setIsFlipped(false);
      setScore({ correct: 0, incorrect: 0 });
      setIsComplete(false);
    },
    [buildDeck],
  );

  const setMode = useCallback(
    (newMode: FlashcardMode) => {
      setModeState(newMode);
      setCurrentIndex(0);
      setIsFlipped(false);
      setScore({ correct: 0, incorrect: 0 });
      setIsComplete(false);
    },
    [],
  );

  // ── Composed state snapshot ──────────────────────────────────

  const state: FlashcardState = {
    currentIndex,
    isFlipped,
    score,
    isComplete,
    mode,
    filter,
    deck,
  };

  return {
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
    shuffleDeck,
    knownWords,
    setFilter,
    setMode,
  };
}
