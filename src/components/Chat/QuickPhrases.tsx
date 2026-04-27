// ============================================================
// QuickPhrases — Suggested conversation starters
// ============================================================

import { Sparkles } from 'lucide-react';

interface Props {
  onSelect: (text: string) => void;
  disabled: boolean;
}

const PHRASES = [
  { emoji: '👋', label: 'Sapa', text: '你好，今天怎么样？' },
  { emoji: '🍜', label: 'Makanan', text: '你最喜欢吃什么？' },
  { emoji: '✈️', label: 'Travel', text: '你想去哪里旅游？' },
  { emoji: '📚', label: 'Belajar', text: '教我一个新词语' },
  { emoji: '🎯', label: 'Latihan', text: '给我一个练习题' },
];

export function QuickPhrases({ onSelect, disabled }: Props) {
  return (
    <div className="quick-phrases">
      <div className="quick-phrases-label">
        <Sparkles size={12} />
        <span>Topik Cepat</span>
      </div>
      <div className="quick-phrases-list">
        {PHRASES.map((p, i) => (
          <button
            key={i}
            className="quick-phrase-btn"
            onClick={() => onSelect(p.text)}
            disabled={disabled}
            title={p.text}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
