// ============================================================
// QuickPhrases — Suggested conversation starters by category
// ============================================================

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  onSelect: (text: string) => void;
  disabled: boolean;
}

type Category = 'Sapaan' | 'Makanan' | 'Latihan' | 'Wisata' | 'Perasaan' | 'Bisnis';

const CATEGORIES: { name: Category; emoji: string; color: string }[] = [
  { name: 'Sapaan',   emoji: '👋', color: '#6c8ef7' },
  { name: 'Makanan',  emoji: '🍜', color: '#f7956c' },
  { name: 'Latihan',  emoji: '🎯', color: '#6cf7a8' },
  { name: 'Wisata',   emoji: '✈️', color: '#f7d96c' },
  { name: 'Perasaan', emoji: '💬', color: '#d96cf7' },
  { name: 'Bisnis',   emoji: '💼', color: '#6ce9f7' },
];

const PHRASES: Record<Category, { text: string; label: string }[]> = {
  Sapaan: [
    { text: '你好，我叫...', label: 'Perkenalkan diri' },
    { text: '你好吗？', label: 'Apa kabar?' },
    { text: '最近怎么样？', label: 'Bagaimana kabarmu?' },
    { text: '好久不见！', label: 'Lama tidak jumpa!' },
  ],
  Makanan: [
    { text: '你最喜欢吃什么？', label: 'Makanan favorit?' },
    { text: '这个多少钱？', label: 'Berapa harganya?' },
    { text: '太好吃了！', label: 'Sangat enak!' },
    { text: '我想要一杯咖啡', label: 'Pesan kopi' },
  ],
  Latihan: [
    { text: '给我一个练习题', label: 'Minta latihan' },
    { text: '帮我练习对话', label: 'Latihan percakapan' },
    { text: '纠正我的语法', label: 'Koreksi tata bahasa' },
    { text: '用这个词造句：__', label: 'Buat kalimat' },
  ],
  Wisata: [
    { text: '去哪里旅游？', label: 'Tujuan wisata' },
    { text: '怎么去地铁站？', label: 'Cara ke stasiun' },
    { text: '附近有酒店吗？', label: 'Ada hotel dekat?' },
    { text: '我想预订房间', label: 'Pesan kamar' },
  ],
  Perasaan: [
    { text: '我很高兴', label: 'Saya senang' },
    { text: '我有点紧张', label: 'Saya agak gugup' },
    { text: '这太难了', label: 'Ini terlalu sulit' },
    { text: '我很喜欢中文', label: 'Saya suka Mandarin' },
  ],
  Bisnis: [
    { text: '我们开会吧', label: 'Ayo rapat' },
    { text: '请发给我邮件', label: 'Tolong kirim email' },
    { text: '这个项目怎么样？', label: 'Bagaimana proyeknya?' },
    { text: '谢谢您的帮助', label: 'Terima kasih bantuannya' },
  ],
};

export function QuickPhrases({ onSelect, disabled }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('Sapaan');
  const activeMeta = CATEGORIES.find(c => c.name === activeCategory)!;

  return (
    <div className="quick-phrases">
      <div className="quick-phrases-label">
        <Sparkles size={12} />
        <span>Topik Cepat</span>
      </div>

      {/* Category tabs */}
      <div className="quick-phrases-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            className={`quick-phrase-tab ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.name)}
            style={activeCategory === cat.name ? { borderColor: cat.color, color: cat.color } : {}}
            title={cat.name}
          >
            <span className="quick-phrase-tab-emoji">{cat.emoji}</span>
            <span className="quick-phrase-tab-name">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Phrase buttons for active category */}
      <div className="quick-phrases-list">
        {PHRASES[activeCategory].map((p, i) => (
          <button
            key={i}
            className="quick-phrase-btn"
            onClick={() => onSelect(p.text)}
            disabled={disabled}
            title={p.text}
          >
            <span
              className="quick-phrase-emoji-bg"
              style={{ background: activeMeta.color + '22' }}
            >
              {activeMeta.emoji}
            </span>
            <span className="quick-phrase-label">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
