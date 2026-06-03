// ============================================================
// VocabNotebook — Saved vocabulary words display
// ============================================================

import { useState, useMemo } from 'react';
import { BookmarkX, Volume2, Search, Download, BookOpen, Plus } from 'lucide-react';
import type { VocabWord } from '../../types';

interface Props {
  words: VocabWord[];
  onRemove: (id: string) => void;
  playAudio: (text: string) => void;
  onAddWord?: (word: Omit<VocabWord, 'id' | 'savedAt'>) => void;
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

function playWord(hanzi: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(hanzi);
  u.lang = 'zh-CN';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export function VocabNotebook({ words, onRemove, playAudio: _playAudio, onAddWord }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHanzi, setNewHanzi] = useState('');
  const [newPinyin, setNewPinyin] = useState('');
  const [newMeaning, setNewMeaning] = useState('');

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
    if (words.length === 0) return;
    const header = 'Hanzi,Pinyin,Arti,Tanggal Disimpan';
    const rows = words.map(w => {
      const date = new Date(w.savedAt).toLocaleDateString('id-ID');
      // Escape commas/quotes in fields
      const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
      return [esc(w.hanzi), esc(w.pinyin), esc(w.meaning), date].join(',');
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ziyan-vocab-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="vocab-count">{words.length} kata tersimpan</span>
          {words.length > 0 && (
            <button
              className="vocab-export-btn"
              onClick={handleExport}
              title="Export CSV"
            >
              <Download size={14} />
            </button>
          )}
        </div>
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

      {/* Add word button */}
      {onAddWord && (
        <button
          className="vocab-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          title="Tambah kata"
        >
          <Plus size={14} /> Tambah
        </button>
      )}

      {/* Add word form */}
      {showAddForm && onAddWord && (
        <div className="vocab-add-form">
          <input
            className="form-input"
            placeholder="Hanzi (e.g. 你好)"
            value={newHanzi}
            onChange={e => setNewHanzi(e.target.value)}
          />
          <input
            className="form-input"
            placeholder="Pinyin (e.g. nǐ hǎo)"
            value={newPinyin}
            onChange={e => setNewPinyin(e.target.value)}
          />
          <input
            className="form-input"
            placeholder="Arti dalam Indonesia"
            value={newMeaning}
            onChange={e => setNewMeaning(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-primary"
              style={{ flex: 1, marginTop: 0, padding: '8px' }}
              onClick={() => {
                if (newHanzi.trim() && newMeaning.trim()) {
                  onAddWord({ hanzi: newHanzi.trim(), pinyin: newPinyin.trim(), meaning: newMeaning.trim(), source: 'manual' });
                  setNewHanzi(''); setNewPinyin(''); setNewMeaning('');
                  setShowAddForm(false);
                }
              }}
            >
              Simpan
            </button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddForm(false)}>
              Batal
            </button>
          </div>
        </div>
      )}

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
                  <button className="vocab-audio-btn" onClick={() => playWord(word.hanzi)} title="Dengarkan">
                    <Volume2 size={13} />
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

    </div>
  );
}
