// ============================================================
// LessonsView.tsx — Structured lesson browser + detail viewer
// for the Ziyan Mandarin learning app
// ============================================================

import { useState, useMemo } from 'react';
import {
  BookOpen,
  Play,
  Check,
  ChevronLeft,
  MessageCircle,
  Volume2,
  BookmarkPlus,
  BookmarkCheck,
  Search,
  X,
} from 'lucide-react';

import {
  LESSONS,
  LESSON_CATEGORIES,
  type Lesson,
} from '../../data/lessons';
import { getItem, setItem } from '../../utils/storage';
import { ColorizePinyin } from '../../utils/toneColor';
import type { VocabWord } from '../../types';
import './lessons.css';

// ── Props ─────────────────────────────────────────────────────
interface LessonsViewProps {
  hskLevel: number;
  onSendToChat: (text: string) => void;
  isWordSaved?: (hanzi: string) => boolean;
  onSaveWord?: (word: Omit<VocabWord, 'id' | 'savedAt'>) => void;
  onShowCharacter?: (char: string) => void;
}

// ── Clickable Hanzi helper ────────────────────────────────────
function ClickableHanzi({ text, onShowCharacter }: { text: string; onShowCharacter?: (c: string) => void }) {
  return (
    <>
      {text.split('').map((char, i) => {
        const isHanzi = /[一-龥]/.test(char);
        return isHanzi ? (
          <span
            key={i}
            className="clickable-hanzi"
            onClick={() => onShowCharacter?.(char)}
            title="Lihat urutan guratan"
          >
            {char}
          </span>
        ) : <span key={i}>{char}</span>;
      })}
    </>
  );
}

// ── Audio helper ──────────────────────────────────────────────
function playWord(hanzi: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(hanzi);
  u.lang = 'zh-CN';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

// ── Types for local state ─────────────────────────────────────
type HskFilter = 'all' | 1 | 2 | 3;
type TabKey = 'vocab' | 'dialog' | 'grammar' | 'practice';

const HSK_COLORS: Record<number, string> = { 1: 'hsk-1', 2: 'hsk-2', 3: 'hsk-3' };

// Derive CSS class from part-of-speech label
function posCssClass(pos: string): string {
  return pos.replace(/\s+/g, '-');
}

// ── Sub-component: Lesson Browser ─────────────────────────────
interface BrowserProps {
  hskFilter: HskFilter;
  categoryFilter: string;
  completedIds: Set<string>;
  onSelectLesson: (lesson: Lesson) => void;
  onSetHskFilter: (f: HskFilter) => void;
  onSetCategoryFilter: (c: string) => void;
}

function LessonBrowser({
  hskFilter,
  categoryFilter,
  completedIds,
  onSelectLesson,
  onSetHskFilter,
  onSetCategoryFilter,
}: BrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Derive the visible lessons
  const filteredLessons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return LESSONS.filter((l) => {
      const matchHsk = hskFilter === 'all' || l.hskLevel === hskFilter;
      const matchCat = categoryFilter === 'all' || l.category === categoryFilter;
      const matchSearch = !q || l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
      return matchHsk && matchCat && matchSearch;
    });
  }, [hskFilter, categoryFilter, searchQuery]);

  // Build category list from visible lessons (before category filter) for pills
  const visibleCategories = useMemo(() => {
    const hskFiltered = LESSONS.filter(
      (l) => hskFilter === 'all' || l.hskLevel === hskFilter,
    );
    const cats = new Set(hskFiltered.map((l) => l.category));
    return Array.from(cats);
  }, [hskFilter]);

  return (
    <>
      {/* Header */}
      <div className="lessons-header">
        <h2>Kurikulum Belajar 📚</h2>
        <p>Pelajari Mandarin dari HSK 1 hingga HSK 3 secara terstruktur</p>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '10px 24px 0' }}>
        <div className="lessons-search-wrap">
          <Search size={14} className="lessons-search-icon" />
          <input
            className="lessons-search-input"
            placeholder="Cari pelajaran..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="lessons-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* HSK Filter */}
      <div className="hsk-filter-tabs">
        {(['all', 1, 2, 3] as HskFilter[]).map((level) => (
          <button
            key={level}
            className={`hsk-filter-tab ${hskFilter === level ? 'active' : ''}`}
            onClick={() => {
              onSetHskFilter(level);
              onSetCategoryFilter('all');
            }}
          >
            {level === 'all' ? 'Semua' : `HSK ${level}`}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        <button
          className={`category-pill ${categoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => onSetCategoryFilter('all')}
        >
          🗂️ Semua
        </button>
        {visibleCategories.map((cat) => {
          const info = LESSON_CATEGORIES[cat];
          return (
            <button
              key={cat}
              className={`category-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => onSetCategoryFilter(cat)}
            >
              {info.emoji} {info.label}
            </button>
          );
        })}
      </div>

      {/* Lesson Grid */}
      <div className="lessons-scroll-area">
        {filteredLessons.length === 0 ? (
          searchQuery ? (
            <div className="lessons-no-results">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <p>Tidak ada pelajaran yang cocok dengan "{searchQuery}"</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>Coba kata kunci lain</p>
            </div>
          ) : (
            <div className="lessons-empty">
              <span className="empty-icon">📭</span>
              Tidak ada pelajaran yang cocok dengan filter ini.
            </div>
          )
        ) : (
          <div className="lessons-grid">
            {filteredLessons.map((lesson) => {
              const done = completedIds.has(lesson.id);
              return (
                <button
                  key={lesson.id}
                  className={`lesson-card ${done ? 'completed' : ''}`}
                  onClick={() => onSelectLesson(lesson)}
                  aria-label={`Buka pelajaran ${lesson.title}`}
                >
                  {done && (
                    <div className="lesson-card-complete-check" aria-label="Selesai">
                      ✓
                    </div>
                  )}

                  <div className="lesson-card-top">
                    <span className="lesson-card-emoji" aria-hidden="true">
                      {lesson.emoji}
                    </span>
                    <div className="lesson-card-badges">
                      <span
                        className={`lesson-hsk-badge ${HSK_COLORS[lesson.hskLevel]}`}
                      >
                        HSK {lesson.hskLevel}
                      </span>
                      {done && (
                        <span className="completed-badge">
                          <Check size={10} /> Selesai
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="lesson-card-title">{lesson.title}</div>
                    <div className="lesson-card-title-cn">{lesson.titleChinese}</div>
                  </div>

                  <p className="lesson-card-desc">{lesson.description}</p>

                  <div className="lesson-card-footer">
                    <BookOpen size={13} />
                    <span>{lesson.vocab.length} kata</span>
                    <span style={{ marginLeft: 4 }}>·</span>
                    <span>~{lesson.estimatedMinutes} menit</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ── Sub-component: Vocab Tab ──────────────────────────────────
interface VocabTabProps {
  lesson: Lesson;
  isWordSaved?: (hanzi: string) => boolean;
  onSaveWord?: (word: Omit<VocabWord, 'id' | 'savedAt'>) => void;
}

function VocabTab({ lesson, isWordSaved, onSaveWord }: VocabTabProps) {
  return (
    <table className="vocab-table">
      <thead>
        <tr>
          <th>Hanzi</th>
          <th>Arti (Indonesia)</th>
          <th>Kelas Kata</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {lesson.vocab.map((v, i) => (
          <tr key={i} className="vocab-row">
            <td>
              <div className="vocab-hanzi">{v.hanzi}</div>
              <div className="vocab-pinyin"><ColorizePinyin pinyin={v.pinyin} /></div>
            </td>
            <td>
              <div className="vocab-meaning">{v.meaning}</div>
            </td>
            <td>
              <span className={`pos-badge ${posCssClass(v.partOfSpeech)}`}>
                {v.partOfSpeech}
              </span>
            </td>
            <td>
              <div className="vocab-actions">
                <button
                  className="vocab-action-btn"
                  onClick={() => playWord(v.hanzi)}
                  aria-label={`Putar audio untuk ${v.hanzi}`}
                  title="Putar audio"
                >
                  <Volume2 size={14} />
                </button>
                <button
                  className={`vocab-action-btn${isWordSaved?.(v.hanzi) ? ' saved' : ''}`}
                  onClick={() => onSaveWord?.({
                    hanzi: v.hanzi,
                    pinyin: v.pinyin,
                    meaning: v.meaning,
                    source: 'manual',
                  })}
                  aria-label={isWordSaved?.(v.hanzi) ? `${v.hanzi} sudah disimpan` : `Simpan ${v.hanzi} ke catatan`}
                  title={isWordSaved?.(v.hanzi) ? 'Sudah disimpan' : 'Simpan ke catatan'}
                >
                  {isWordSaved?.(v.hanzi) ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Sub-component: Dialog Tab ─────────────────────────────────
function DialogTab({ lesson, onShowCharacter }: { lesson: Lesson; onShowCharacter?: (char: string) => void }) {
  return (
    <div className="dialogue-container">
      {lesson.dialogue.map((line, i) => (
        <div
          key={i}
          className={`dialogue-line ${line.speaker === 'A' ? 'speaker-a' : 'speaker-b'}`}
        >
          <div className="dialogue-speaker-label">
            {line.speaker === 'A' ? '🧑 Pembicara A' : '💬 Pembicara B'}
          </div>
          <div className="dialogue-bubble">
            <div className="dialogue-hanzi">
              <ClickableHanzi text={line.hanzi} onShowCharacter={onShowCharacter} />
            </div>
            <div className="dialogue-pinyin">{line.pinyin}</div>
            <div className="dialogue-translation">{line.translation}</div>
            <div className="dialogue-line-actions">
              <button
                className="dialogue-play-btn"
                onClick={(e) => { e.stopPropagation(); playWord(line.hanzi); }}
                title="Dengarkan"
              >
                <Volume2 size={13} /> Putar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sub-component: Grammar Tab ────────────────────────────────
function GrammarTab({ lesson, onShowCharacter }: { lesson: Lesson; onShowCharacter?: (char: string) => void }) {
  return (
    <div className="grammar-section">
      {lesson.grammar.map((g, i) => (
        <div key={i} className="grammar-item">
          <div className="grammar-pattern">
            <div className="grammar-pattern-label">Pola Tata Bahasa</div>
            <div className="grammar-pattern-formula">{g.pattern}</div>
          </div>

          <div className="grammar-explanation">{g.explanation}</div>

          <div className="grammar-examples">
            <div className="grammar-examples-label">Contoh Kalimat</div>
            {g.examples.map((ex, j) => (
              <div key={j} className="grammar-example">
                <div className="grammar-example-hanzi">
                  <ClickableHanzi text={ex.hanzi} onShowCharacter={onShowCharacter} />
                </div>
                <div className="grammar-example-pinyin">{ex.pinyin}</div>
                <div className="grammar-example-translation">{ex.translation}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sub-component: Practice Tab ───────────────────────────────
interface PracticeTabProps {
  lesson: Lesson;
  isCompleted: boolean;
  onStartPractice: () => void;
}

function PracticeTab({ lesson, isCompleted, onStartPractice }: PracticeTabProps) {
  return (
    <div className="practice-section">
      <div className="practice-intro">
        <span className="practice-intro-emoji" aria-hidden="true">🤖</span>
        <h4>Latihan dengan Ziyan AI</h4>
        <p>
          Praktikkan kosakata dan tata bahasa dari pelajaran ini langsung dengan
          Ziyan, asisten AI yang akan membantumu bercakap-cakap dalam bahasa
          Mandarin.
        </p>
      </div>

      <div className="practice-prompt-box">
        <div className="practice-prompt-label">Pesan yang akan dikirim ke Ziyan</div>
        <div className="practice-prompt-text">{lesson.practicePrompt}</div>
      </div>

      <button
        className="practice-cta-btn"
        onClick={onStartPractice}
        aria-label="Mulai latihan dengan Ziyan"
      >
        <MessageCircle size={18} />
        Mulai Latihan dengan Ziyan
      </button>

      {isCompleted && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <span className="completed-badge" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            <Check size={13} /> Pelajaran ini sudah diselesaikan
          </span>
        </div>
      )}

      <div className="practice-tips">
        <h5>
          <BookOpen size={14} /> Tips Latihan
        </h5>
        <ul>
          <li>Coba gunakan kosakata baru dari pelajaran ini dalam percakapan</li>
          <li>Minta Ziyan untuk mengoreksi kesalahanmu dan menjelaskan alasannya</li>
          <li>Tanyakan contoh kalimat tambahan untuk memperkuat pemahamanmu</li>
          <li>Berlatihlah secara rutin — konsistensi adalah kunci keberhasilan belajar</li>
        </ul>
      </div>
    </div>
  );
}

// ── Sub-component: Lesson Detail ──────────────────────────────
interface DetailProps {
  lesson: Lesson;
  isCompleted: boolean;
  onBack: () => void;
  onMarkComplete: (id: string) => void;
  onStartPractice: (prompt: string) => void;
  isWordSaved?: (hanzi: string) => boolean;
  onSaveWord?: (word: Omit<VocabWord, 'id' | 'savedAt'>) => void;
  onShowCharacter?: (char: string) => void;
}

function LessonDetail({
  lesson,
  isCompleted,
  onBack,
  onMarkComplete,
  onStartPractice,
  isWordSaved,
  onSaveWord,
  onShowCharacter,
}: DetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('vocab');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'vocab',    label: 'Kosakata' },
    { key: 'dialog',   label: 'Dialog' },
    { key: 'grammar',  label: 'Tata Bahasa' },
    { key: 'practice', label: 'Latihan' },
  ];

  function handleStartPractice() {
    onMarkComplete(lesson.id);
    onStartPractice(lesson.practicePrompt);
  }

  return (
    <div className="lesson-detail-view">
      {/* Header */}
      <div className="lesson-detail-header">
        <button
          className="lesson-detail-back"
          onClick={onBack}
          aria-label="Kembali ke daftar pelajaran"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="lesson-detail-title-block">
          <h3>{lesson.title}</h3>
          <span>
            {lesson.titleChinese} ·{' '}
            <span className={`lesson-hsk-badge ${HSK_COLORS[lesson.hskLevel]}`}>
              HSK {lesson.hskLevel}
            </span>
          </span>
        </div>

        <span className="lesson-detail-emoji" aria-hidden="true">
          {lesson.emoji}
        </span>
      </div>

      {/* Tabs */}
      <div className="lesson-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            className={`lesson-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="lesson-tab-content" role="tabpanel">
        {activeTab === 'vocab' && (
          <VocabTab
            lesson={lesson}
            isWordSaved={isWordSaved}
            onSaveWord={onSaveWord}
          />
        )}
        {activeTab === 'dialog' && <DialogTab lesson={lesson} onShowCharacter={onShowCharacter} />}
        {activeTab === 'grammar' && <GrammarTab lesson={lesson} onShowCharacter={onShowCharacter} />}
        {activeTab === 'practice' && (
          <PracticeTab
            lesson={lesson}
            isCompleted={isCompleted}
            onStartPractice={handleStartPractice}
          />
        )}
      </div>

      {/* Floating complete button (only on non-practice tabs) */}
      {activeTab !== 'practice' && !isCompleted && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--glass-border)', flexShrink: 0 }}>
          <button
            className="practice-cta-btn"
            onClick={() => setActiveTab('practice')}
            aria-label="Pergi ke tab latihan"
          >
            <Play size={16} /> Mulai Latihan
          </button>
        </div>
      )}

      {activeTab !== 'practice' && isCompleted && (
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--glass-border)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <span className="completed-badge" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            <Check size={13} /> Sudah Diselesaikan
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function LessonsView({ onSendToChat, isWordSaved, onSaveWord, onShowCharacter }: LessonsViewProps) {
  // Persistence: track completed lesson IDs
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(getItem<string[]>('completed_lessons', [])),
  );

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [hskFilter, setHskFilter]         = useState<HskFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  function handleMarkComplete(id: string) {
    if (completedIds.has(id)) return;
    const next = new Set(completedIds);
    next.add(id);
    setCompletedIds(next);
    setItem('completed_lessons', Array.from(next));
  }

  function handleStartPractice(prompt: string) {
    onSendToChat(prompt);
    setSelectedLesson(null); // collapse back so user sees chat
  }

  return (
    <div className="lessons-view">
      {selectedLesson ? (
        <LessonDetail
          lesson={selectedLesson}
          isCompleted={completedIds.has(selectedLesson.id)}
          onBack={() => setSelectedLesson(null)}
          onMarkComplete={handleMarkComplete}
          onStartPractice={handleStartPractice}
          isWordSaved={isWordSaved}
          onSaveWord={onSaveWord}
          onShowCharacter={onShowCharacter}
        />
      ) : (
        <LessonBrowser
          hskFilter={hskFilter}
          categoryFilter={categoryFilter}
          completedIds={completedIds}
          onSelectLesson={(l) => {
            setSelectedLesson(l);
          }}
          onSetHskFilter={setHskFilter}
          onSetCategoryFilter={setCategoryFilter}
        />
      )}
    </div>
  );
}
