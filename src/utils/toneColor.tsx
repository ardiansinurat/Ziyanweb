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

const TONE_DESCRIPTIONS: Record<number, string> = {
  1: 'Nada 1 (datar: ā)',
  2: 'Nada 2 (naik: á)',
  3: 'Nada 3 (turun-naik: ǎ)',
  4: 'Nada 4 (turun: à)',
  0: 'Nada netral',
};

function getTone(syllable: string): number {
  for (const char of syllable) {
    if (TONE_MAP[char]) return TONE_MAP[char];
  }
  return 0; // neutral / no tone
}

export function getToneNumber(syllable: string): number {
  return getTone(syllable);
}

export function ColorizePinyin({ pinyin, className }: { pinyin: string; className?: string }) {
  const trimmed = pinyin.trim();
  if (!trimmed) return null;

  const syllables = trimmed.split(/\s+/);
  const ariaLabel = `Pinyin: ${trimmed}`;

  return (
    <span aria-label={ariaLabel} className={className}>
      {syllables.map((syl, i) => {
        const tone = getTone(syl);
        const style = tone > 0
          ? { color: `var(--tone-${tone})` }
          : { color: 'var(--text-muted)' };
        return (
          <span
            key={i}
            className="pinyin-syllable"
            style={style}
            title={TONE_DESCRIPTIONS[tone]}
          >
            {syl}
          </span>
        );
      })}
    </span>
  );
}
