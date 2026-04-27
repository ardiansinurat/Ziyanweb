// ============================================================
// useVocab — Vocabulary notebook management hook
// ============================================================

import { useState, useCallback } from 'react';
import type { VocabWord } from '../types';
import { getItem, setItem } from '../utils/storage';

export function useVocab() {
  const [words, setWordsState] = useState<VocabWord[]>(() =>
    getItem<VocabWord[]>('vocab_words', [])
  );

  const persist = useCallback((next: VocabWord[]) => {
    setWordsState(next);
    setItem('vocab_words', next);
  }, []);

  const addWord = useCallback((word: Omit<VocabWord, 'id' | 'savedAt'>) => {
    setWordsState(prev => {
      // Avoid duplicates
      if (prev.some(w => w.hanzi === word.hanzi)) return prev;
      const newWord: VocabWord = {
        ...word,
        id: Date.now().toString(),
        savedAt: Date.now(),
      };
      const next = [newWord, ...prev];
      setItem('vocab_words', next);
      return next;
    });
  }, []);

  const removeWord = useCallback((id: string) => {
    setWordsState(prev => {
      const next = prev.filter(w => w.id !== id);
      setItem('vocab_words', next);
      return next;
    });
  }, []);

  const isWordSaved = useCallback((hanzi: string) => {
    return words.some(w => w.hanzi === hanzi);
  }, [words]);

  return {
    words,
    addWord,
    removeWord,
    isWordSaved,
    clearAll: () => persist([]),
    totalWords: words.length,
  };
}
