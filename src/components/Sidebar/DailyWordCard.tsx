// ============================================================
// DailyWordCard — Display a word of the day with navigation
// ============================================================

import { Volume2, BookmarkPlus, BookmarkCheck, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import HanziWriter from 'hanziwriter';
import { ColorizePinyin } from '../../utils/toneColor';

const DAILY_WORDS = [
  // HSK 1
  { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'halo / permisi', example: '你好，很高兴认识你！' },
  { hanzi: '谢谢', pinyin: 'xiè xiè', meaning: 'terima kasih', example: '谢谢你的帮助！' },
  { hanzi: '对不起', pinyin: 'duì bu qǐ', meaning: 'maaf', example: '对不起，我来晚了。' },
  { hanzi: '没关系', pinyin: 'méi guān xi', meaning: 'tidak apa-apa', example: '没关系，下次注意就好。' },
  { hanzi: '再见', pinyin: 'zài jiàn', meaning: 'sampai jumpa', example: '明天见！再见！' },
  { hanzi: '是', pinyin: 'shì', meaning: 'adalah / ya', example: '我是学生。' },
  { hanzi: '不是', pinyin: 'bú shì', meaning: 'bukan', example: '我不是老师。' },
  { hanzi: '好', pinyin: 'hǎo', meaning: 'baik / bagus', example: '今天天气很好。' },
  { hanzi: '大', pinyin: 'dà', meaning: 'besar', example: '这个苹果很大。' },
  { hanzi: '小', pinyin: 'xiǎo', meaning: 'kecil', example: '那只猫很小。' },
  // HSK 1 continued
  { hanzi: '一', pinyin: 'yī', meaning: 'satu', example: '我有一个苹果。' },
  { hanzi: '水', pinyin: 'shuǐ', meaning: 'air', example: '我要喝水。' },
  { hanzi: '吃', pinyin: 'chī', meaning: 'makan', example: '我们去吃饭吧！' },
  { hanzi: '喝', pinyin: 'hē', meaning: 'minum', example: '你喝茶还是咖啡？' },
  { hanzi: '买', pinyin: 'mǎi', meaning: 'membeli', example: '我想买一件衣服。' },
  { hanzi: '看', pinyin: 'kàn', meaning: 'melihat / menonton', example: '我喜欢看电影。' },
  { hanzi: '去', pinyin: 'qù', meaning: 'pergi', example: '我们去公园吧。' },
  { hanzi: '来', pinyin: 'lái', meaning: 'datang', example: '请进来！' },
  { hanzi: '说', pinyin: 'shuō', meaning: 'berbicara / berkata', example: '他说中文很好。' },
  { hanzi: '听', pinyin: 'tīng', meaning: 'mendengarkan', example: '我喜欢听音乐。' },
  // HSK 2
  { hanzi: '进步', pinyin: 'jìn bù', meaning: 'kemajuan / meningkat', example: '你的中文进步很大！' },
  { hanzi: '努力', pinyin: 'nǔ lì', meaning: 'berusaha keras', example: '我们要努力学习。' },
  { hanzi: '希望', pinyin: 'xī wàng', meaning: 'berharap / harapan', example: '我希望明天是晴天。' },
  { hanzi: '当然', pinyin: 'dāng rán', meaning: 'tentu saja', example: '当然可以！' },
  { hanzi: '了解', pinyin: 'liǎo jiě', meaning: 'memahami', example: '我不太了解他。' },
  { hanzi: '方便', pinyin: 'fāng biàn', meaning: 'nyaman / mudah', example: '这里交通很方便。' },
  { hanzi: '认识', pinyin: 'rèn shí', meaning: 'mengenal', example: '很高兴认识你！' },
  { hanzi: '觉得', pinyin: 'jué de', meaning: 'merasa / menganggap', example: '我觉得这个很有意思。' },
  { hanzi: '帮助', pinyin: 'bāng zhù', meaning: 'membantu / bantuan', example: '谢谢你的帮助。' },
  { hanzi: '问题', pinyin: 'wèn tí', meaning: 'pertanyaan / masalah', example: '你有问题吗？' },
  { hanzi: '重要', pinyin: 'zhòng yào', meaning: 'penting', example: '学习中文很重要。' },
  { hanzi: '开始', pinyin: 'kāi shǐ', meaning: 'mulai', example: '我们开始学习吧！' },
  { hanzi: '结束', pinyin: 'jié shù', meaning: 'selesai / berakhir', example: '课已经结束了。' },
  { hanzi: '已经', pinyin: 'yǐ jīng', meaning: 'sudah', example: '我已经吃饭了。' },
  { hanzi: '还没', pinyin: 'hái méi', meaning: 'belum', example: '我还没准备好。' },
  // HSK 2 continued
  { hanzi: '可以', pinyin: 'kě yǐ', meaning: 'boleh / bisa', example: '你可以帮我吗？' },
  { hanzi: '应该', pinyin: 'yīng gāi', meaning: 'seharusnya', example: '你应该多运动。' },
  { hanzi: '一起', pinyin: 'yī qǐ', meaning: 'bersama-sama', example: '我们一起去吧！' },
  { hanzi: '高兴', pinyin: 'gāo xìng', meaning: 'senang / gembira', example: '见到你很高兴！' },
  { hanzi: '有趣', pinyin: 'yǒu qù', meaning: 'menarik / menyenangkan', example: '这个故事很有趣。' },
  // HSK 3
  { hanzi: '经验', pinyin: 'jīng yàn', meaning: 'pengalaman', example: '他有很多工作经验。' },
  { hanzi: '机会', pinyin: 'jī huì', meaning: 'kesempatan', example: '这是个好机会。' },
  { hanzi: '选择', pinyin: 'xuǎn zé', meaning: 'memilih / pilihan', example: '你有很多选择。' },
  { hanzi: '解决', pinyin: 'jiě jué', meaning: 'menyelesaikan / memecahkan', example: '我们一起解决这个问题。' },
  { hanzi: '发现', pinyin: 'fā xiàn', meaning: 'menemukan / menyadari', example: '我发现一个好餐厅。' },
  { hanzi: '相信', pinyin: 'xiāng xìn', meaning: 'percaya', example: '我相信你能做到！' },
  { hanzi: '成功', pinyin: 'chéng gōng', meaning: 'sukses / berhasil', example: '祝你成功！' },
  { hanzi: '失败', pinyin: 'shī bài', meaning: 'gagal', example: '失败是成功之母。' },
  { hanzi: '继续', pinyin: 'jì xù', meaning: 'melanjutkan', example: '请继续说。' },
  { hanzi: '改变', pinyin: 'gǎi biàn', meaning: 'mengubah / perubahan', example: '你改变了很多！' },
  { hanzi: '关心', pinyin: 'guān xīn', meaning: 'peduli / perhatian', example: '谢谢你的关心。' },
  { hanzi: '安全', pinyin: 'ān quán', meaning: 'aman / keselamatan', example: '注意安全！' },
  { hanzi: '环境', pinyin: 'huán jìng', meaning: 'lingkungan', example: '这里的环境很好。' },
  { hanzi: '文化', pinyin: 'wén huà', meaning: 'budaya', example: '中国文化很有意思。' },
  { hanzi: '语言', pinyin: 'yǔ yán', meaning: 'bahasa', example: '你会几种语言？' },
  { hanzi: '练习', pinyin: 'liàn xí', meaning: 'berlatih / latihan', example: '每天练习很重要。' },
  { hanzi: '复习', pinyin: 'fù xí', meaning: 'mengulang pelajaran', example: '考试前要复习。' },
  { hanzi: '提高', pinyin: 'tí gāo', meaning: 'meningkatkan', example: '我想提高我的中文水平。' },
  { hanzi: '水平', pinyin: 'shuǐ píng', meaning: 'tingkat / level', example: '你的水平很高！' },
  { hanzi: '自信', pinyin: 'zì xìn', meaning: 'percaya diri', example: '要对自己有自信！' },
  { hanzi: '耐心', pinyin: 'nài xīn', meaning: 'sabar', example: '学习需要耐心。' },
];

interface WordObj {
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
}

interface Props {
  playAudio: (text: string) => void;
  onSaveWord?: (word: WordObj) => void;
}

export function DailyWordCard({ playAudio, onSaveWord }: Props) {
  const [dayIndex, setDayIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showStroke, setShowStroke] = useState(false);
  const strokeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff =
      now.getTime() - start.getTime() +
      (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    setDayIndex(dayOfYear % DAILY_WORDS.length);
  }, []);

  const word = DAILY_WORDS[dayIndex];
  const dayNumber = dayIndex + 1;

  useEffect(() => {
    if (!showStroke || !strokeRef.current) {
      if (strokeRef.current) strokeRef.current.innerHTML = '';
      return;
    }
    strokeRef.current.innerHTML = '';
    const firstChar = word.hanzi.charAt(0);
    HanziWriter.create(strokeRef.current, firstChar, {
      width: 120,
      height: 120,
      padding: 5,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 100,
      strokeColor: '#4A90D9',
      outlineColor: document.documentElement.getAttribute('data-theme')?.startsWith('dark') ? '#4a4a5a' : '#cccccc',
      showCharacter: false,
    }).animateCharacter();
    return () => {
      if (strokeRef.current) strokeRef.current.innerHTML = '';
    };
  }, [showStroke, word.hanzi]);

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setDayIndex(prev => (prev + 1) % DAILY_WORDS.length);
      setSaved(false);
      setShowStroke(false);
      setAnimating(false);
    }, 200);
  };

  const handleSave = () => {
    if (onSaveWord && !saved) {
      onSaveWord(word);
      setSaved(true);
    }
  };

  return (
    <div className="daily-word-card">
      <div className="daily-word-header">
        <div className="daily-word-title-row">
          <h3>🌟 Kata Hari Ini</h3>
          <span className="daily-word-day-badge">Hari {dayNumber}</span>
        </div>
        <div className="daily-word-header-actions">
          <button className="msg-action-btn" onClick={() => playAudio(word.hanzi)} title="Dengarkan">
            <Volume2 size={16} />
          </button>
          <button
            className="msg-action-btn"
            onClick={() => setShowStroke(p => !p)}
            title={showStroke ? 'Sembunyikan urutan goresan' : 'Lihat urutan goresan'}
          >
            ✍️
          </button>
          <button className="msg-action-btn" onClick={handleNext} title="Kata berikutnya">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={`daily-word-content${animating ? ' daily-word-fade' : ''}`}>
        <div className="daily-word-hanzi">{word.hanzi}</div>
        <div className="daily-word-pinyin"><ColorizePinyin pinyin={word.pinyin} /></div>
        <div className="daily-word-meaning">{word.meaning}</div>
        <div className="daily-word-example">"{word.example}"</div>
      </div>

      {showStroke && (
        <div className="daily-word-stroke-container" ref={strokeRef} style={{ width: 120, height: 120 }} />
      )}

      {onSaveWord && (
        <button
          className={`daily-word-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saved}
          title={saved ? 'Sudah disimpan' : 'Simpan ke kosakata'}
        >
          {saved ? (
            <>
              <BookmarkCheck size={14} />
              <span>Tersimpan</span>
            </>
          ) : (
            <>
              <BookmarkPlus size={14} />
              <span>Simpan ke Kosakata</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
