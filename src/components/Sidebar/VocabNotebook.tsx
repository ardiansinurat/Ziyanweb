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
  const [sortBy, setSortBy] = useState<'date' | 'alpha' | 'source'>('date');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'chat' | 'daily' | 'manual'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHanzi, setNewHanzi] = useState('');
  const [newPinyin, setNewPinyin] = useState('');
  const [newMeaning, setNewMeaning] = useState('');

  const filteredWords = useMemo(() => {
    let result = [...words];

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

    return result;
  }, [words, search]);

  const displayWords = [...filteredWords]
    .filter(w => sourceFilter === 'all' || (w as any).source === sourceFilter)
    .sort((a, b) => {
      if (sortBy === 'alpha') return a.hanzi.localeCompare(b.hanzi);
      if (sortBy === 'source') return ((a as any).source ?? '').localeCompare((b as any).source ?? '');
      return (b.savedAt ?? 0) - (a.savedAt ?? 0); // newest first (default)
    });

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

      {/* Sort and filter row */}
      <div className="vocab-sort-row">
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Urutkan:</span>
        {(['date', 'alpha', 'source'] as const).map(s => (
          <button
            key={s}
            className={`vocab-sort-btn${sortBy === s ? ' active' : ''}`}
            onClick={() => setSortBy(s)}
          >
            {s === 'date' ? 'Terbaru' : s === 'alpha' ? 'A-Z' : 'Sumber'}
          </button>
        ))}
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: 6 }}>Filter:</span>
        {(['all', 'chat', 'daily', 'manual'] as const).map(src => (
          <button
            key={src}
            className={`vocab-sort-btn${sourceFilter === src ? ' active' : ''}`}
            onClick={() => setSourceFilter(src)}
          >
            {src === 'all' ? 'Semua' : src === 'chat' ? '💬' : src === 'daily' ? '📅' : '✏️'}
          </button>
        ))}
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
        {displayWords.length === 0 ? (
          <p className="vocab-empty">Tidak ada kata yang cocok.</p>
        ) : (
          displayWords.map(word => (
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
