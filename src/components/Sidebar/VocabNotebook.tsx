// ============================================================
// VocabNotebook — Saved vocabulary words display
// ============================================================

import { BookmarkX, Volume2 } from 'lucide-react';
import type { VocabWord } from '../../types';

interface Props {
  words: VocabWord[];
  onRemove: (id: string) => void;
  playAudio: (text: string) => void;
}

export function VocabNotebook({ words, onRemove, playAudio }: Props) {
  if (words.length === 0) {
    return (
      <div className="vocab-notebook">
        <h3>📖 Kosakata Saya</h3>
        <p className="vocab-empty">Belum ada kata tersimpan. Klik ikon bookmark di pesan Ziyan untuk menyimpan kosakata.</p>
      </div>
    );
  }

  return (
    <div className="vocab-notebook">
      <h3>📖 Kosakata Saya ({words.length})</h3>
      <div className="vocab-list">
        {words.slice(0, 10).map(word => (
          <div key={word.id} className="vocab-item">
            <div className="vocab-item-main">
              <span className="vocab-hanzi">{word.hanzi}</span>
              <span className="vocab-pinyin">{word.pinyin}</span>
            </div>
            <span className="vocab-meaning">{word.meaning}</span>
            <div className="vocab-item-actions">
              <button className="msg-action-btn" onClick={() => playAudio(word.hanzi)} title="Dengarkan">
                <Volume2 size={12} />
              </button>
              <button className="msg-action-btn" onClick={() => onRemove(word.id)} title="Hapus">
                <BookmarkX size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
