// ============================================================
// toneColor — Utility to color-code pinyin syllables by tone
// ============================================================

// Map diacritical vowels to their tone number
const TONE_MAP: Record<string, number> = {
  'ā': 1, 'á': 2, 'ǎ': 3, 'à': 4,
  'ē': 1, 'é': 2, 'ě': 3, 'è': 4,
  'ī': 1, 'í': 2, 'ǐ': 3, 'ì': 4,
  'ō': 1, 'ó': 2, 'ǒ': 3, 'ò': 4,
  'ū': 1, 'ú': 2, 'ǔ': 3, 'ù': 4,
  'ǖ': 1, 'ǘ': 2, 'ǚ': 3, 'ǜ': 4,
};

function getTone(syllable: string): number {
  for (const char of syllable) {
    if (TONE_MAP[char]) return TONE_MAP[char];
  }
  return 0; // neutral / no tone
}

export function ColorizePinyin({ pinyin }: { pinyin: string }) {
  const syllables = pinyin.trim().split(/\s+/);
  return (
    <>
      {syllables.map((syl, i) => {
        const tone = getTone(syl);
        const style = tone > 0
          ? { color: `var(--tone-${tone})` }
          : { color: 'var(--text-muted)' };
        return (
          <span key={i} className="pinyin-syllable" style={style}>{syl}</span>
        );
      })}
    </>
  );
}
