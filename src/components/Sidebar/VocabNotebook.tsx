// ============================================================
// VocabNotebook — Saved vocabulary words display
// ============================================================

import { useState, useMemo } from 'react';
import { BookmarkX, Volume2, Search, Download, BookOpen } from 'lucide-react';
import type { VocabWord } from '../../types';
import { useToast } from '../UI/Toast';

interface Props {
  words: VocabWord[];
  onRemove: (id: string) => void;
  playAudio: (text: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'az';
type SourceFilter = 'all' | 'chat' | 'daily' | 'manual';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Terbaru',
  oldest: 'Terlama',
  az: 'A-Z',
};

const SOURCE_LABELS: Record<SourceFilter, string> = {
  all: 'Semua',
  chat: 'Chat',
  daily: 'Harian',
  manual: 'Manual',
};

export function VocabNotebook({ words, onRemove, playAudio }: Props) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');

  const filtered = useMemo(() => {
    let result = [...words];

    // Source filter
    if (sourceFilter !== 'all') {
      result = result.filter(w => (w as any).source === sourceFilter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        w =>
          w.hanzi.includes(q) ||
          w.pinyin.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'newest') {
      result.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
    } else if (sort === 'oldest') {
      result.sort((a, b) => (a.savedAt ?? 0) - (b.savedAt ?? 0));
    } else if (sort === 'az') {
      result.sort((a, b) => a.hanzi.localeCompare(b.hanzi));
    }

    return result;
  }, [words, search, sort, sourceFilter]);

  const handleExport = () => {
    const text = words
      .map(w => `${w.hanzi} [${w.pinyin}] — ${w.meaning}${(w as any).example ? `\nContoh: ${(w as any).example}` : ''}`)
      .join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${words.length} kata disalin ke clipboard!`, 'success');
    });
  };

  if (words.length === 0) {
    return (
      <div className="vocab-notebook">
        <div className="vocab-header">
          <h3>📖 Kosakata Saya</h3>
        </div>
        <div className="vocab-empty-state">
          <BookOpen size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p className="vocab-empty">Belum ada kata tersimpan.</p>
          <p className="vocab-empty-hint">
            Klik ikon <strong>bookmark</strong> pada pesan Ziyan untuk menyimpan kata ke sini.
            Atau gunakan tombol <strong>"Simpan ke Kosakata"</strong> di Kata Harian.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vocab-notebook">
      <div className="vocab-header">
        <h3>📖 Kosakata Saya</h3>
        <span className="vocab-count">{words.length} kata tersimpan</span>
      </div>

      {/* Search */}
      <div className="vocab-search-wrapper">
        <Search size={14} className="vocab-search-icon" />
        <input
          type="text"
          className="vocab-search-input"
          placeholder="Cari hanzi, pinyin, atau arti..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Controls row */}
      <div className="vocab-controls">
        <div className="vocab-filter-group">
          {(Object.keys(SOURCE_LABELS) as SourceFilter[]).map(s => (
            <button
              key={s}
              className={`vocab-filter-btn ${sourceFilter === s ? 'active' : ''}`}
              onClick={() => setSourceFilter(s)}
            >
              {SOURCE_LABELS[s]}
            </button>
          ))}
        </div>
        <select
          className="vocab-sort-select"
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map(s => (
            <option key={s} value={s}>{SORT_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Word list */}
      <div className="vocab-list">
        {filtered.length === 0 ? (
          <p className="vocab-empty">Tidak ada kata yang cocok.</p>
        ) : (
          filtered.map(word => (
            <div key={word.id} className="vocab-item">
              <div className="vocab-item-top">
                <div className="vocab-item-main">
                  <span className="vocab-hanzi">{word.hanzi}</span>
                  <span className="vocab-pinyin">{word.pinyin}</span>
                </div>
                <div className="vocab-item-actions">
                  <button className="msg-action-btn" onClick={() => playAudio(word.hanzi)} title="Dengarkan">
                    <Volume2 size={12} />
                  </button>
                  <button className="msg-action-btn" onClick={() => onRemove(word.id)} title="Hapus">
                    <BookmarkX size={12} />
                  </button>
                </div>
              </div>
              <span className="vocab-meaning">{word.meaning}</span>
              {(word as any).example && (
                <span className="vocab-example">"{(word as any).example}"</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Export button */}
      <button className="vocab-export-btn" onClick={handleExport} title="Salin semua kata ke clipboard">
        <Download size={14} />
        <span>Ekspor Kosakata</span>
      </button>
    </div>
  );
}
