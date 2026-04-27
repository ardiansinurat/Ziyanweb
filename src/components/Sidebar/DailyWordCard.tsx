// ============================================================
// DailyWordCard — Display a word of the day
// ============================================================

import { Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const DAILY_WORDS = [
  { hanzi: '进步', pinyin: 'jìn bù', meaning: 'kemajuan / meningkat', example: '你的中文进步很大！' },
  { hanzi: '努力', pinyin: 'nǔ lì', meaning: 'berusaha keras', example: '我们要努力学习。' },
  { hanzi: '希望', pinyin: 'xī wàng', meaning: 'berharap / harapan', example: '我希望明天是晴天。' },
  { hanzi: '当然', pinyin: 'dāng rán', meaning: 'tentu saja', example: '当然可以！' },
  { hanzi: '了解', pinyin: 'liǎo jiě', meaning: 'memahami', example: '我不太了解他。' },
];

interface Props {
  playAudio: (text: string) => void;
}

export function DailyWordCard({ playAudio }: Props) {
  const [word, setWord] = useState(DAILY_WORDS[0]);

  useEffect(() => {
    // Get a word based on the current day of the year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    setWord(DAILY_WORDS[dayOfYear % DAILY_WORDS.length]);
  }, []);

  return (
    <div className="daily-word-card">
      <div className="daily-word-header">
        <h3>🌟 Kata Hari Ini</h3>
        <button className="msg-action-btn" onClick={() => playAudio(word.hanzi)} title="Dengarkan">
          <Volume2 size={16} />
        </button>
      </div>
      
      <div className="daily-word-content">
        <div className="daily-word-hanzi">{word.hanzi}</div>
        <div className="daily-word-pinyin">{word.pinyin}</div>
        <div className="daily-word-meaning">{word.meaning}</div>
        <div className="daily-word-example">"{word.example}"</div>
      </div>
    </div>
  );
}
