// ============================================================
// QuickPhrases — Suggested conversation starters by category
// ============================================================

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getItem, setItem } from '../../utils/storage';

interface Props {
  onSelect: (text: string) => void;
  disabled: boolean;
}

type Category = 'Favorit' | 'Sapaan' | 'Makanan' | 'Latihan' | 'Wisata' | 'Perasaan' | 'Bisnis';

const CATEGORIES: { name: Category; emoji: string; color: string }[] = [
  { name: 'Sapaan',   emoji: '👋', color: '#6c8ef7' },
  { name: 'Makanan',  emoji: '🍜', color: '#f7956c' },
  { name: 'Latihan',  emoji: '🎯', color: '#6cf7a8' },
  { name: 'Wisata',   emoji: '✈️', color: '#f7d96c' },
  { name: 'Perasaan', emoji: '💬', color: '#d96cf7' },
  { name: 'Bisnis',   emoji: '💼', color: '#6ce9f7' },
];

const PHRASES: Record<Exclude<Category, 'Favorit'>, { text: string; label: string }[]> = {
  Sapaan: [
    { text: '你好，我叫...', label: 'Perkenalkan diri' },
    { text: '你好吗？', label: 'Apa kabar?' },
    { text: '最近怎么样？', label: 'Bagaimana kabarmu?' },
    { text: '好久不见！', label: 'Lama tidak jumpa!' },
    { text: '请问你叫什么名字？', label: 'Siapa namamu?' },
  ],
  Makanan: [
    { text: '你最喜欢吃什么？', label: 'Makanan favorit?' },
    { text: '这个多少钱？', label: 'Berapa harganya?' },
    { text: '太好吃了！', label: 'Sangat enak!' },
    { text: '我想要一杯咖啡', label: 'Pesan kopi' },
    { text: '我吃素', label: 'Saya vegetarian' },
  ],
  Latihan: [
    { text: '给我一个练习题', label: 'Minta latihan' },
    { text: '帮我练习对话', label: 'Latihan percakapan' },
    { text: '纠正我的语法', label: 'Koreksi tata bahasa' },
    { text: '用这个词造句：__', label: 'Buat kalimat' },
    { text: '解释一下这个语法', label: 'Jelaskan grammar ini' },
  ],
  Wisata: [
    { text: '去哪里旅游？', label: 'Tujuan wisata' },
    { text: '怎么去地铁站？', label: 'Cara ke stasiun' },
    { text: '附近有酒店吗？', label: 'Ada hotel dekat?' },
    { text: '我想预订房间', label: 'Pesan kamar' },
    { text: '这里有什么特色美食？', label: 'Kuliner khas sini?' },
  ],
  Perasaan: [
    { text: '我很高兴', label: 'Saya senang' },
    { text: '我有点紧张', label: 'Saya agak gugup' },
    { text: '这太难了', label: 'Ini terlalu sulit' },
    { text: '我很喜欢中文', label: 'Saya suka Mandarin' },
    { text: '我感觉好多了', label: 'Saya merasa lebih baik' },
  ],
  Bisnis: [
    { text: '我们开会吧', label: 'Ayo rapat' },
    { text: '请发给我邮件', label: 'Tolong kirim email' },
    { text: '这个项目怎么样？', label: 'Bagaimana proyeknya?' },
    { text: '谢谢您的帮助', label: 'Terima kasih bantuannya' },
    { text: '我们可以合作吗？', label: 'Bisakah kita kerja sama?' },
  ],
};

// Flat list of all phrases with their category metadata, used for search
const ALL_PHRASES: { text: string; label: string; category: Exclude<Category, 'Favorit'>; emoji: string; color: string }[] =
  CATEGORIES.flatMap(cat =>
    PHRASES[cat.name as Exclude<Category, 'Favorit'>].map(p => ({
      ...p,
      category: cat.name as Exclude<Category, 'Favorit'>,
      emoji: cat.emoji,
      color: cat.color,
    }))
  );

export function QuickPhrases({ onSelect, disabled }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('Sapaan');
  const [searchQuery, setSearchQuery] = useState('');
  const [favs, setFavs] = useState<string[]>(() => getItem('quick_phrase_favs', []));
  const [usage, setUsage] = useState<Record<string, number>>(() => getItem('quick_phrase_usage', {}));

  // Build visible category tabs (Favorit first, only if there are favs)
  const visibleCategories = [
    ...(favs.length > 0 ? [{ name: 'Favorit' as Category, emoji: '⭐', color: '#f7c948' }] : []),
    ...CATEGORIES,
  ];

  // If Favorit was active but favs become empty, reset to Sapaan
  const effectiveCategory: Category =
    activeCategory === 'Favorit' && favs.length === 0 ? 'Sapaan' : activeCategory;

  const activeMeta =
    effectiveCategory === 'Favorit'
      ? { name: 'Favorit' as Category, emoji: '⭐', color: '#f7c948' }
      : CATEGORIES.find(c => c.name === effectiveCategory)!;

  function toggleFav(text: string) {
    setFavs(prev => {
      const next = prev.includes(text) ? prev.filter(f => f !== text) : [...prev, text];
      setItem('quick_phrase_favs', next);
      return next;
    });
  }

  function handleSelect(text: string) {
    setUsage(prev => {
      const next = { ...prev, [text]: (prev[text] ?? 0) + 1 };
      setItem('quick_phrase_usage', next);
      return next;
    });
    onSelect(text);
  }

  // Determine which phrases to show
  let displayPhrases: { text: string; label: string; emoji: string; color: string }[];

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    displayPhrases = ALL_PHRASES.filter(
      p => p.text.toLowerCase().includes(q) || p.label.toLowerCase().includes(q)
    ).map(p => ({ text: p.text, label: p.label, emoji: p.emoji, color: p.color }));
  } else if (effectiveCategory === 'Favorit') {
    displayPhrases = favs
      .map(text => {
        const found = ALL_PHRASES.find(p => p.text === text);
        return found ? { text: found.text, label: found.label, emoji: found.emoji, color: found.color } : null;
      })
      .filter((p): p is { text: string; label: string; emoji: string; color: string } => p !== null);
  } else {
    displayPhrases = PHRASES[effectiveCategory as Exclude<Category, 'Favorit'>].map(p => ({
      text: p.text,
      label: p.label,
      emoji: activeMeta.emoji,
      color: activeMeta.color,
    }));
  }

  return (
    <div className="quick-phrases">
      <div className="quick-phrases-label">
        <Sparkles size={12} />
        <span>Topik Cepat</span>
      </div>

      {/* Search input */}
      <div className="quick-phrases-search">
        <input
          className="quick-phrases-search-input"
          type="text"
          placeholder="Cari frasa..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category tabs — hidden when searching */}
      {searchQuery.trim() === '' && (
        <div className="quick-phrases-tabs">
          {visibleCategories.map(cat => (
            <button
              key={cat.name}
              className={`quick-phrase-tab ${effectiveCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
              style={effectiveCategory === cat.name ? { borderColor: cat.color, color: cat.color } : {}}
              title={cat.name}
            >
              <span className="quick-phrase-tab-emoji">{cat.emoji}</span>
              <span className="quick-phrase-tab-name">{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Phrase buttons */}
      <div className="quick-phrases-list">
        {displayPhrases.map((p, i) => (
          <button
            key={i}
            className="quick-phrase-btn"
            onClick={() => handleSelect(p.text)}
            disabled={disabled}
            title={p.text}
          >
            <div className="quick-phrase-btn-row">
              <span
                className="quick-phrase-emoji-bg"
                style={{ background: p.color + '22' }}
              >
                {p.emoji}
              </span>
              <span className="quick-phrase-label">{p.label}</span>
              {(usage[p.text] ?? 0) > 0 && (
                <span className="quick-phrase-usage">{usage[p.text]}×</span>
              )}
              <button
                className={'quick-phrase-fav-btn' + (favs.includes(p.text) ? ' active' : '')}
                onClick={(e) => { e.stopPropagation(); toggleFav(p.text); }}
                title={favs.includes(p.text) ? 'Hapus favorit' : 'Tambah favorit'}
              >⭐</button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
