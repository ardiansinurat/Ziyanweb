// ============================================================
// lessons.ts — Structured lesson database for HSK 1–3
// All explanations and translations are in Indonesian
// ============================================================

export interface LessonVocab {
  hanzi: string;
  pinyin: string;
  meaning: string; // Indonesian
  partOfSpeech:
    | 'kata benda'
    | 'kata kerja'
    | 'kata sifat'
    | 'kata keterangan'
    | 'kata ganti'
    | 'partikel';
}

export interface LessonDialogue {
  speaker: 'A' | 'B';
  hanzi: string;
  pinyin: string;
  translation: string; // Indonesian
}

export interface LessonGrammar {
  pattern: string; // e.g. "Subject + 是 + Object"
  explanation: string; // Indonesian explanation
  examples: Array<{ hanzi: string; pinyin: string; translation: string }>;
}

export interface Lesson {
  id: string;
  title: string; // Indonesian title
  titleChinese: string; // Chinese title
  description: string; // Indonesian description
  hskLevel: 1 | 2 | 3;
  category:
    | 'greetings'
    | 'family'
    | 'food'
    | 'travel'
    | 'shopping'
    | 'work'
    | 'hobbies'
    | 'weather'
    | 'time'
    | 'directions';
  emoji: string;
  estimatedMinutes: number;
  vocab: LessonVocab[];
  dialogue: LessonDialogue[];
  grammar: LessonGrammar[];
  practicePrompt: string;
}

// ─────────────────────────────────────────────────────────────
// HSK 1 Lessons
// ─────────────────────────────────────────────────────────────

const lesson_hsk1_perkenalan: Lesson = {
  id: 'hsk1_perkenalan',
  title: 'Perkenalan Diri',
  titleChinese: '自我介绍',
  description: 'Belajar cara memperkenalkan diri, menanyakan nama, dan bertanya asal negara seseorang.',
  hskLevel: 1,
  category: 'greetings',
  emoji: '👋',
  estimatedMinutes: 15,
  vocab: [
    { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'halo / selamat datang', partOfSpeech: 'kata keterangan' },
    { hanzi: '我', pinyin: 'wǒ', meaning: 'saya / aku', partOfSpeech: 'kata ganti' },
    { hanzi: '叫', pinyin: 'jiào', meaning: 'bernama / memanggil', partOfSpeech: 'kata kerja' },
    { hanzi: '是', pinyin: 'shì', meaning: 'adalah / iya', partOfSpeech: 'kata kerja' },
    { hanzi: '哪国人', pinyin: 'nǎ guó rén', meaning: 'warga negara mana', partOfSpeech: 'kata ganti' },
    { hanzi: '学生', pinyin: 'xuésheng', meaning: 'pelajar / murid', partOfSpeech: 'kata benda' },
    { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'guru', partOfSpeech: 'kata benda' },
    { hanzi: '印度尼西亚人', pinyin: 'yìndùníxīyǎ rén', meaning: 'orang Indonesia', partOfSpeech: 'kata benda' },
    { hanzi: '你', pinyin: 'nǐ', meaning: 'kamu / anda', partOfSpeech: 'kata ganti' },
    { hanzi: '高兴', pinyin: 'gāoxìng', meaning: 'senang / gembira', partOfSpeech: 'kata sifat' },
    { hanzi: '认识', pinyin: 'rènshi', meaning: 'mengenal / berkenalan', partOfSpeech: 'kata kerja' },
    { hanzi: '再见', pinyin: 'zàijiàn', meaning: 'sampai jumpa / selamat tinggal', partOfSpeech: 'kata keterangan' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '你好！我叫安迪，你叫什么名字？',
      pinyin: 'Nǐ hǎo! Wǒ jiào Āndí, nǐ jiào shénme míngzi?',
      translation: 'Halo! Saya bernama Andi, kamu namanya siapa?',
    },
    {
      speaker: 'B',
      hanzi: '你好！我叫李明。你是哪国人？',
      pinyin: 'Nǐ hǎo! Wǒ jiào Lǐ Míng. Nǐ shì nǎ guó rén?',
      translation: 'Halo! Saya bernama Li Ming. Kamu orang mana?',
    },
    {
      speaker: 'A',
      hanzi: '我是印度尼西亚人。你是中国人吗？',
      pinyin: 'Wǒ shì yìndùníxīyǎ rén. Nǐ shì zhōngguó rén ma?',
      translation: 'Saya orang Indonesia. Apakah kamu orang China?',
    },
    {
      speaker: 'B',
      hanzi: '是的，我是中国人。你是学生吗？',
      pinyin: 'Shì de, wǒ shì zhōngguó rén. Nǐ shì xuésheng ma?',
      translation: 'Ya, saya orang China. Apakah kamu pelajar?',
    },
    {
      speaker: 'A',
      hanzi: '我是学生。很高兴认识你！',
      pinyin: 'Wǒ shì xuésheng. Hěn gāoxìng rènshi nǐ!',
      translation: 'Saya pelajar. Senang berkenalan denganmu!',
    },
    {
      speaker: 'B',
      hanzi: '我也很高兴认识你！再见！',
      pinyin: 'Wǒ yě hěn gāoxìng rènshi nǐ! Zàijiàn!',
      translation: 'Saya juga senang berkenalan denganmu! Sampai jumpa!',
    },
  ],
  grammar: [
    {
      pattern: 'Subject + 是 + Noun',
      explanation:
        '动词 "是" (shì) digunakan seperti kata "adalah" dalam bahasa Indonesia. Digunakan untuk menyatakan identitas seseorang atau sesuatu.',
      examples: [
        { hanzi: '我是学生。', pinyin: 'Wǒ shì xuésheng.', translation: 'Saya adalah pelajar.' },
        { hanzi: '他是老师。', pinyin: 'Tā shì lǎoshī.', translation: 'Dia adalah guru.' },
        { hanzi: '她是中国人。', pinyin: 'Tā shì zhōngguó rén.', translation: 'Dia adalah orang China.' },
      ],
    },
    {
      pattern: 'Statement + 吗？',
      explanation:
        'Untuk membuat kalimat tanya ya/tidak dalam bahasa Mandarin, cukup tambahkan partikel "吗" (ma) di akhir kalimat pernyataan.',
      examples: [
        { hanzi: '你是学生吗？', pinyin: 'Nǐ shì xuésheng ma?', translation: 'Apakah kamu pelajar?' },
        { hanzi: '你好吗？', pinyin: 'Nǐ hǎo ma?', translation: 'Apakah kamu baik-baik saja?' },
        { hanzi: '他是老师吗？', pinyin: 'Tā shì lǎoshī ma?', translation: 'Apakah dia guru?' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇和我聊天，帮我练习自我介绍：我的名字、国籍和身份。请用简单的HSK1词汇。',
};

const lesson_hsk1_keluarga: Lesson = {
  id: 'hsk1_keluarga',
  title: 'Keluarga',
  titleChinese: '家庭',
  description: 'Pelajari cara menyebut anggota keluarga dalam bahasa Mandarin dan memperkenalkan keluargamu.',
  hskLevel: 1,
  category: 'family',
  emoji: '👨‍👩‍👧‍👦',
  estimatedMinutes: 15,
  vocab: [
    { hanzi: '家庭', pinyin: 'jiātíng', meaning: 'keluarga', partOfSpeech: 'kata benda' },
    { hanzi: '爸爸', pinyin: 'bàba', meaning: 'ayah / bapak', partOfSpeech: 'kata benda' },
    { hanzi: '妈妈', pinyin: 'māma', meaning: 'ibu', partOfSpeech: 'kata benda' },
    { hanzi: '哥哥', pinyin: 'gēge', meaning: 'kakak laki-laki', partOfSpeech: 'kata benda' },
    { hanzi: '姐姐', pinyin: 'jiějie', meaning: 'kakak perempuan', partOfSpeech: 'kata benda' },
    { hanzi: '弟弟', pinyin: 'dìdi', meaning: 'adik laki-laki', partOfSpeech: 'kata benda' },
    { hanzi: '妹妹', pinyin: 'mèimei', meaning: 'adik perempuan', partOfSpeech: 'kata benda' },
    { hanzi: '几', pinyin: 'jǐ', meaning: 'berapa (untuk jumlah kecil)', partOfSpeech: 'kata ganti' },
    { hanzi: '口', pinyin: 'kǒu', meaning: 'orang (satuan untuk anggota keluarga)', partOfSpeech: 'kata benda' },
    { hanzi: '有', pinyin: 'yǒu', meaning: 'ada / mempunyai', partOfSpeech: 'kata kerja' },
    { hanzi: '没有', pinyin: 'méiyǒu', meaning: 'tidak ada / tidak punya', partOfSpeech: 'kata kerja' },
    { hanzi: '爷爷', pinyin: 'yéye', meaning: 'kakek (dari ayah)', partOfSpeech: 'kata benda' },
    { hanzi: '奶奶', pinyin: 'nǎinai', meaning: 'nenek (dari ayah)', partOfSpeech: 'kata benda' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '你家有几口人？',
      pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?',
      translation: 'Keluargamu ada berapa orang?',
    },
    {
      speaker: 'B',
      hanzi: '我家有五口人：爸爸、妈妈、哥哥、妹妹和我。',
      pinyin: 'Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.',
      translation: 'Keluargaku ada lima orang: ayah, ibu, kakak laki-laki, adik perempuan, dan saya.',
    },
    {
      speaker: 'A',
      hanzi: '你有姐姐吗？',
      pinyin: 'Nǐ yǒu jiějie ma?',
      translation: 'Apakah kamu punya kakak perempuan?',
    },
    {
      speaker: 'B',
      hanzi: '没有，我没有姐姐。你呢？',
      pinyin: 'Méiyǒu, wǒ méiyǒu jiějie. Nǐ ne?',
      translation: 'Tidak ada, saya tidak punya kakak perempuan. Kamu bagaimana?',
    },
    {
      speaker: 'A',
      hanzi: '我家有四口人。我有一个弟弟。',
      pinyin: 'Wǒ jiā yǒu sì kǒu rén. Wǒ yǒu yī gè dìdi.',
      translation: 'Keluargaku ada empat orang. Saya punya satu adik laki-laki.',
    },
    {
      speaker: 'B',
      hanzi: '哦！你爷爷奶奶住在你家吗？',
      pinyin: 'Ó! Nǐ yéye nǎinai zhù zài nǐ jiā ma?',
      translation: 'Oh! Apakah kakek nenekmu tinggal di rumahmu?',
    },
  ],
  grammar: [
    {
      pattern: 'Subject + 有 + Number + 量词 + Noun',
      explanation:
        '"有" (yǒu) berarti "mempunyai" atau "ada". Kata bantu bilangan (量词) seperti "个" (gè) digunakan sebelum kata benda. Untuk anggota keluarga, "口" (kǒu) dipakai sebagai satuan penghitung.',
      examples: [
        { hanzi: '我有一个哥哥。', pinyin: 'Wǒ yǒu yī gè gēge.', translation: 'Saya punya satu kakak laki-laki.' },
        { hanzi: '我家有三口人。', pinyin: 'Wǒ jiā yǒu sān kǒu rén.', translation: 'Keluargaku ada tiga orang.' },
        { hanzi: '他没有妹妹。', pinyin: 'Tā méiyǒu mèimei.', translation: 'Dia tidak punya adik perempuan.' },
      ],
    },
    {
      pattern: '…，你呢？',
      explanation:
        '"你呢？" (nǐ ne?) digunakan untuk menanyakan balik ke lawan bicara dengan makna "Kalau kamu?". "呢" adalah partikel tanya yang meminta penjelasan lebih lanjut.',
      examples: [
        { hanzi: '我很好，你呢？', pinyin: 'Wǒ hěn hǎo, nǐ ne?', translation: 'Saya baik-baik saja, kalau kamu?' },
        { hanzi: '我有弟弟，你呢？', pinyin: 'Wǒ yǒu dìdi, nǐ ne?', translation: 'Saya punya adik laki-laki, kalau kamu?' },
        { hanzi: '他是学生，你呢？', pinyin: 'Tā shì xuésheng, nǐ ne?', translation: 'Dia pelajar, kalau kamu?' },
      ],
    },
  ],
  practicePrompt: '你好！请帮我用这节课的词汇练习"家庭"话题。问我有几口人，我的家庭成员是谁。请用HSK1的简单词汇。',
};

const lesson_hsk1_angkawaktu: Lesson = {
  id: 'hsk1_angkawaktu',
  title: 'Angka & Waktu',
  titleChinese: '数字和时间',
  description: 'Kuasai angka dasar Mandarin dan ekspresi waktu seperti hari ini, besok, dan jam berapa.',
  hskLevel: 1,
  category: 'time',
  emoji: '🕐',
  estimatedMinutes: 20,
  vocab: [
    { hanzi: '一', pinyin: 'yī', meaning: 'satu', partOfSpeech: 'kata benda' },
    { hanzi: '二', pinyin: 'èr', meaning: 'dua', partOfSpeech: 'kata benda' },
    { hanzi: '三', pinyin: 'sān', meaning: 'tiga', partOfSpeech: 'kata benda' },
    { hanzi: '四', pinyin: 'sì', meaning: 'empat', partOfSpeech: 'kata benda' },
    { hanzi: '五', pinyin: 'wǔ', meaning: 'lima', partOfSpeech: 'kata benda' },
    { hanzi: '六', pinyin: 'liù', meaning: 'enam', partOfSpeech: 'kata benda' },
    { hanzi: '七', pinyin: 'qī', meaning: 'tujuh', partOfSpeech: 'kata benda' },
    { hanzi: '八', pinyin: 'bā', meaning: 'delapan', partOfSpeech: 'kata benda' },
    { hanzi: '九', pinyin: 'jiǔ', meaning: 'sembilan', partOfSpeech: 'kata benda' },
    { hanzi: '十', pinyin: 'shí', meaning: 'sepuluh', partOfSpeech: 'kata benda' },
    { hanzi: '今天', pinyin: 'jīntiān', meaning: 'hari ini', partOfSpeech: 'kata keterangan' },
    { hanzi: '明天', pinyin: 'míngtiān', meaning: 'besok', partOfSpeech: 'kata keterangan' },
    { hanzi: '昨天', pinyin: 'zuótiān', meaning: 'kemarin', partOfSpeech: 'kata keterangan' },
    { hanzi: '几点', pinyin: 'jǐ diǎn', meaning: 'jam berapa', partOfSpeech: 'kata ganti' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '今天几号？',
      pinyin: 'Jīntiān jǐ hào?',
      translation: 'Hari ini tanggal berapa?',
    },
    {
      speaker: 'B',
      hanzi: '今天是十五号。明天是十六号。',
      pinyin: 'Jīntiān shì shíwǔ hào. Míngtiān shì shíliù hào.',
      translation: 'Hari ini tanggal 15. Besok tanggal 16.',
    },
    {
      speaker: 'A',
      hanzi: '现在几点？',
      pinyin: 'Xiànzài jǐ diǎn?',
      translation: 'Sekarang jam berapa?',
    },
    {
      speaker: 'B',
      hanzi: '现在三点半。',
      pinyin: 'Xiànzài sān diǎn bàn.',
      translation: 'Sekarang jam setengah empat (jam tiga lebih tiga puluh).',
    },
    {
      speaker: 'A',
      hanzi: '你明天几点上课？',
      pinyin: 'Nǐ míngtiān jǐ diǎn shàngkè?',
      translation: 'Besok kamu mulai belajar jam berapa?',
    },
    {
      speaker: 'B',
      hanzi: '明天早上八点上课。',
      pinyin: 'Míngtiān zǎoshang bā diǎn shàngkè.',
      translation: 'Besok belajar mulai jam delapan pagi.',
    },
  ],
  grammar: [
    {
      pattern: 'Number + 点 (+ 分)',
      explanation:
        'Untuk menyatakan jam, gunakan angka + "点" (diǎn). Untuk menyatakan menit, tambahkan angka + "分" (fēn). "半" (bàn) berarti "setengah" (30 menit).',
      examples: [
        { hanzi: '现在两点。', pinyin: 'Xiànzài liǎng diǎn.', translation: 'Sekarang jam dua.' },
        { hanzi: '五点十分。', pinyin: 'Wǔ diǎn shí fēn.', translation: 'Jam lima lewat sepuluh menit.' },
        { hanzi: '七点半。', pinyin: 'Qī diǎn bàn.', translation: 'Jam setengah delapan.' },
      ],
    },
    {
      pattern: '今天 / 明天 / 昨天 + Time Expression',
      explanation:
        'Ekspresi waktu "今天" (hari ini), "明天" (besok), dan "昨天" (kemarin) diletakkan di awal kalimat atau sebelum kata kerja. Urutan waktu selalu dari yang besar ke kecil: hari → jam → menit.',
      examples: [
        { hanzi: '今天是星期一。', pinyin: 'Jīntiān shì xīngqī yī.', translation: 'Hari ini adalah hari Senin.' },
        { hanzi: '明天我有课。', pinyin: 'Míngtiān wǒ yǒu kè.', translation: 'Besok saya ada kelas.' },
        { hanzi: '昨天我很忙。', pinyin: 'Zuótiān wǒ hěn máng.', translation: 'Kemarin saya sangat sibuk.' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习数字和时间。问我现在几点、今天几号，然后告诉我一些时间相关的句子。请用HSK1词汇。',
};

const lesson_hsk1_makanminum: Lesson = {
  id: 'hsk1_makanminum',
  title: 'Makan & Minum',
  titleChinese: '吃喝',
  description: 'Pelajari kosakata makanan dan minuman, serta cara memesan di restoran.',
  hskLevel: 1,
  category: 'food',
  emoji: '🍜',
  estimatedMinutes: 15,
  vocab: [
    { hanzi: '吃', pinyin: 'chī', meaning: 'makan', partOfSpeech: 'kata kerja' },
    { hanzi: '喝', pinyin: 'hē', meaning: 'minum', partOfSpeech: 'kata kerja' },
    { hanzi: '好吃', pinyin: 'hǎochī', meaning: 'enak / lezat', partOfSpeech: 'kata sifat' },
    { hanzi: '水', pinyin: 'shuǐ', meaning: 'air', partOfSpeech: 'kata benda' },
    { hanzi: '茶', pinyin: 'chá', meaning: 'teh', partOfSpeech: 'kata benda' },
    { hanzi: '咖啡', pinyin: 'kāfēi', meaning: 'kopi', partOfSpeech: 'kata benda' },
    { hanzi: '米饭', pinyin: 'mǐfàn', meaning: 'nasi', partOfSpeech: 'kata benda' },
    { hanzi: '面条', pinyin: 'miàntiáo', meaning: 'mie', partOfSpeech: 'kata benda' },
    { hanzi: '想', pinyin: 'xiǎng', meaning: 'ingin / mau', partOfSpeech: 'kata kerja' },
    { hanzi: '饿', pinyin: 'è', meaning: 'lapar', partOfSpeech: 'kata sifat' },
    { hanzi: '渴', pinyin: 'kě', meaning: 'haus', partOfSpeech: 'kata sifat' },
    { hanzi: '请', pinyin: 'qǐng', meaning: 'tolong / silakan', partOfSpeech: 'kata kerja' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '你饿了吗？我们去吃饭吧！',
      pinyin: 'Nǐ è le ma? Wǒmen qù chīfàn ba!',
      translation: 'Kamu sudah lapar? Ayo kita makan!',
    },
    {
      speaker: 'B',
      hanzi: '好的，我很饿！你想吃什么？',
      pinyin: 'Hǎo de, wǒ hěn è! Nǐ xiǎng chī shénme?',
      translation: 'Baik, saya sangat lapar! Kamu mau makan apa?',
    },
    {
      speaker: 'A',
      hanzi: '我想吃米饭。你呢？',
      pinyin: 'Wǒ xiǎng chī mǐfàn. Nǐ ne?',
      translation: 'Saya mau makan nasi. Kamu?',
    },
    {
      speaker: 'B',
      hanzi: '我想吃面条。你想喝什么？',
      pinyin: 'Wǒ xiǎng chī miàntiáo. Nǐ xiǎng hē shénme?',
      translation: 'Saya mau makan mie. Kamu mau minum apa?',
    },
    {
      speaker: 'A',
      hanzi: '请给我一杯茶，谢谢。',
      pinyin: 'Qǐng gěi wǒ yī bēi chá, xièxiè.',
      translation: 'Tolong beri saya satu cangkir teh, terima kasih.',
    },
    {
      speaker: 'B',
      hanzi: '这里的米饭很好吃！',
      pinyin: 'Zhèlǐ de mǐfàn hěn hǎochī!',
      translation: 'Nasi di sini sangat enak!',
    },
  ],
  grammar: [
    {
      pattern: 'Subject + 想 + Verb + Object',
      explanation:
        '"想" (xiǎng) digunakan sebagai kata kerja modal yang berarti "ingin" atau "mau". Letakkan "想" sebelum kata kerja utama untuk mengungkapkan keinginan.',
      examples: [
        { hanzi: '我想吃米饭。', pinyin: 'Wǒ xiǎng chī mǐfàn.', translation: 'Saya ingin makan nasi.' },
        { hanzi: '他想喝咖啡。', pinyin: 'Tā xiǎng hē kāfēi.', translation: 'Dia ingin minum kopi.' },
        { hanzi: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', translation: 'Kamu mau makan apa?' },
      ],
    },
    {
      pattern: 'Verb + 什么？',
      explanation:
        '"什么" (shénme) berarti "apa". Dalam pertanyaan, letakkan "什么" di posisi yang sama dengan jawaban yang diharapkan — tidak perlu memindahkan kata tanya ke awal kalimat seperti dalam bahasa Indonesia.',
      examples: [
        { hanzi: '你喝什么？', pinyin: 'Nǐ hē shénme?', translation: 'Kamu minum apa?' },
        { hanzi: '你吃什么？', pinyin: 'Nǐ chī shénme?', translation: 'Kamu makan apa?' },
        { hanzi: '这是什么？', pinyin: 'Zhè shì shénme?', translation: 'Ini apa?' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习吃喝话题。问我想吃什么、想喝什么，然后模拟一个简单的点餐对话。请用HSK1词汇。',
};

// ─────────────────────────────────────────────────────────────
// HSK 2 Lessons
// ─────────────────────────────────────────────────────────────

const lesson_hsk2_transportasi: Lesson = {
  id: 'hsk2_transportasi',
  title: 'Transportasi',
  titleChinese: '交通',
  description: 'Pelajari cara bertanya dan menjelaskan rute perjalanan menggunakan berbagai moda transportasi.',
  hskLevel: 2,
  category: 'travel',
  emoji: '🚌',
  estimatedMinutes: 20,
  vocab: [
    { hanzi: '公共汽车', pinyin: 'gōnggòng qìchē', meaning: 'bis umum', partOfSpeech: 'kata benda' },
    { hanzi: '地铁', pinyin: 'dìtiě', meaning: 'kereta bawah tanah / MRT', partOfSpeech: 'kata benda' },
    { hanzi: '出租车', pinyin: 'chūzūchē', meaning: 'taksi', partOfSpeech: 'kata benda' },
    { hanzi: '飞机', pinyin: 'fēijī', meaning: 'pesawat terbang', partOfSpeech: 'kata benda' },
    { hanzi: '火车', pinyin: 'huǒchē', meaning: 'kereta api', partOfSpeech: 'kata benda' },
    { hanzi: '骑自行车', pinyin: 'qí zìxíngchē', meaning: 'naik sepeda', partOfSpeech: 'kata kerja' },
    { hanzi: '走路', pinyin: 'zǒu lù', meaning: 'berjalan kaki', partOfSpeech: 'kata kerja' },
    { hanzi: '坐', pinyin: 'zuò', meaning: 'naik (kendaraan) / duduk', partOfSpeech: 'kata kerja' },
    { hanzi: '怎么去', pinyin: 'zěnme qù', meaning: 'bagaimana cara pergi', partOfSpeech: 'kata keterangan' },
    { hanzi: '多长时间', pinyin: 'duō cháng shíjiān', meaning: 'berapa lama', partOfSpeech: 'kata keterangan' },
    { hanzi: '换乘', pinyin: 'huànchéng', meaning: 'transit / ganti kendaraan', partOfSpeech: 'kata kerja' },
    { hanzi: '站', pinyin: 'zhàn', meaning: 'halte / stasiun', partOfSpeech: 'kata benda' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '你好，请问去北京站怎么走？',
      pinyin: 'Nǐ hǎo, qǐngwèn qù Běijīng zhàn zěnme zǒu?',
      translation: 'Halo, permisi, bagaimana cara ke Stasiun Beijing?',
    },
    {
      speaker: 'B',
      hanzi: '你可以坐地铁，坐到三号线。',
      pinyin: 'Nǐ kěyǐ zuò dìtiě, zuò dào sān hào xiàn.',
      translation: 'Kamu bisa naik kereta bawah tanah, naik jalur nomor 3.',
    },
    {
      speaker: 'A',
      hanzi: '坐地铁要多长时间？',
      pinyin: 'Zuò dìtiě yào duō cháng shíjiān?',
      translation: 'Naik kereta bawah tanah butuh berapa lama?',
    },
    {
      speaker: 'B',
      hanzi: '大概二十分钟。你也可以坐出租车。',
      pinyin: 'Dàgài èrshí fēnzhōng. Nǐ yě kěyǐ zuò chūzūchē.',
      translation: 'Kira-kira dua puluh menit. Kamu juga bisa naik taksi.',
    },
    {
      speaker: 'A',
      hanzi: '坐公共汽车呢？',
      pinyin: 'Zuò gōnggòng qìchē ne?',
      translation: 'Kalau naik bus umum?',
    },
    {
      speaker: 'B',
      hanzi: '公共汽车要换乘一次，比较麻烦。',
      pinyin: 'Gōnggòng qìchē yào huànchéng yī cì, bǐjiào máfán.',
      translation: 'Bus umum perlu transit sekali, agak merepotkan.',
    },
  ],
  grammar: [
    {
      pattern: 'Subject + 可以 + Verb',
      explanation:
        '"可以" (kěyǐ) adalah kata kerja modal yang berarti "bisa" atau "boleh". Digunakan untuk menyatakan kemampuan atau izin melakukan sesuatu.',
      examples: [
        { hanzi: '你可以坐地铁。', pinyin: 'Nǐ kěyǐ zuò dìtiě.', translation: 'Kamu bisa naik kereta.' },
        { hanzi: '这里可以拍照吗？', pinyin: 'Zhèlǐ kěyǐ pāizhào ma?', translation: 'Boleh foto di sini?' },
        { hanzi: '我可以帮你。', pinyin: 'Wǒ kěyǐ bāng nǐ.', translation: 'Saya bisa membantumu.' },
      ],
    },
    {
      pattern: '怎么 + Verb？',
      explanation:
        '"怎么" (zěnme) berarti "bagaimana" atau "dengan cara apa". Digunakan untuk menanyakan cara atau metode melakukan sesuatu.',
      examples: [
        { hanzi: '去机场怎么走？', pinyin: 'Qù jīchǎng zěnme zǒu?', translation: 'Bagaimana cara ke bandara?' },
        { hanzi: '这个字怎么写？', pinyin: 'Zhège zì zěnme xiě?', translation: 'Karakter ini bagaimana cara menulisnya?' },
        { hanzi: '你怎么去学校？', pinyin: 'Nǐ zěnme qù xuéxiào?', translation: 'Kamu naik apa ke sekolah?' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习交通话题。帮我模拟一个问路的对话，询问如何从一个地方去另一个地方，包括交通方式和时间。请用HSK2词汇。',
};

const lesson_hsk2_belanja: Lesson = {
  id: 'hsk2_belanja',
  title: 'Belanja',
  titleChinese: '购物',
  description: 'Belajar cara berbelanja, menanyakan harga, dan menawar di pasar atau toko.',
  hskLevel: 2,
  category: 'shopping',
  emoji: '🛍️',
  estimatedMinutes: 20,
  vocab: [
    { hanzi: '多少钱', pinyin: 'duōshǎo qián', meaning: 'berapa harganya', partOfSpeech: 'kata ganti' },
    { hanzi: '便宜', pinyin: 'piányí', meaning: 'murah', partOfSpeech: 'kata sifat' },
    { hanzi: '贵', pinyin: 'guì', meaning: 'mahal', partOfSpeech: 'kata sifat' },
    { hanzi: '买', pinyin: 'mǎi', meaning: 'membeli', partOfSpeech: 'kata kerja' },
    { hanzi: '卖', pinyin: 'mài', meaning: 'menjual', partOfSpeech: 'kata kerja' },
    { hanzi: '超市', pinyin: 'chāoshì', meaning: 'supermarket', partOfSpeech: 'kata benda' },
    { hanzi: '商场', pinyin: 'shāngchǎng', meaning: 'pusat perbelanjaan / mall', partOfSpeech: 'kata benda' },
    { hanzi: '打折', pinyin: 'dǎzhé', meaning: 'diskon', partOfSpeech: 'kata kerja' },
    { hanzi: '付钱', pinyin: 'fù qián', meaning: 'membayar', partOfSpeech: 'kata kerja' },
    { hanzi: '找钱', pinyin: 'zhǎo qián', meaning: 'kembalian', partOfSpeech: 'kata benda' },
    { hanzi: '块', pinyin: 'kuài', meaning: 'yuan (satuan uang China)', partOfSpeech: 'kata benda' },
    { hanzi: '换', pinyin: 'huàn', meaning: 'menukar / mengganti', partOfSpeech: 'kata kerja' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '这件衣服多少钱？',
      pinyin: 'Zhè jiàn yīfú duōshǎo qián?',
      translation: 'Baju ini harganya berapa?',
    },
    {
      speaker: 'B',
      hanzi: '这件一百八十块。',
      pinyin: 'Zhè jiàn yībǎi bāshí kuài.',
      translation: 'Yang ini seratus delapan puluh yuan.',
    },
    {
      speaker: 'A',
      hanzi: '有点儿贵，可以便宜一点吗？',
      pinyin: 'Yǒudiǎnr guì, kěyǐ piányí yīdiǎn ma?',
      translation: 'Agak mahal, bisa lebih murah sedikit?',
    },
    {
      speaker: 'B',
      hanzi: '现在打折，八折，一百四十四块。',
      pinyin: 'Xiànzài dǎzhé, bā zhé, yībǎi sìshísì kuài.',
      translation: 'Sekarang diskon, diskon 20%, jadi seratus empat puluh empat yuan.',
    },
    {
      speaker: 'A',
      hanzi: '好，我买了。我用微信付钱可以吗？',
      pinyin: 'Hǎo, wǒ mǎi le. Wǒ yòng wēixìn fù qián kěyǐ ma?',
      translation: 'Baik, saya beli. Boleh bayar pakai WeChat?',
    },
    {
      speaker: 'B',
      hanzi: '当然可以！谢谢惠顾！',
      pinyin: 'Dāngrán kěyǐ! Xièxiè huìgù!',
      translation: 'Tentu saja bisa! Terima kasih atas kunjungannya!',
    },
  ],
  grammar: [
    {
      pattern: 'Price + 块 (钱)',
      explanation:
        '"块" (kuài) adalah satuan uang informal untuk yuan China (RMB). Dalam percakapan sehari-hari, "块" lebih sering digunakan dibanding "元" (yuán). Nilai desimal menggunakan "毛" (máo) = 0.1 yuan.',
      examples: [
        { hanzi: '这个五块钱。', pinyin: 'Zhège wǔ kuài qián.', translation: 'Ini harganya lima yuan.' },
        { hanzi: '一共二十块。', pinyin: 'Yīgòng èrshí kuài.', translation: 'Total dua puluh yuan.' },
        { hanzi: '三块五。', pinyin: 'Sān kuài wǔ.', translation: 'Tiga yuan lima mao.' },
      ],
    },
    {
      pattern: 'Adj + 一点 / 有点儿 + Adj',
      explanation:
        '"一点" (yīdiǎn) setelah kata sifat berarti "sedikit lebih..." dan biasanya untuk permintaan. "有点儿" (yǒudiǎnr) sebelum kata sifat berarti "agak..." dan biasanya mengandung nuansa negatif.',
      examples: [
        { hanzi: '可以便宜一点吗？', pinyin: 'Kěyǐ piányí yīdiǎn ma?', translation: 'Bisa lebih murah sedikit?' },
        { hanzi: '有点儿贵。', pinyin: 'Yǒudiǎnr guì.', translation: 'Agak mahal.' },
        { hanzi: '有点儿远。', pinyin: 'Yǒudiǎnr yuǎn.', translation: 'Agak jauh.' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习购物话题。模拟一个买东西的对话，包括问价格、讨价还价和付款。请用HSK2词汇。',
};

const lesson_hsk2_cuaca: Lesson = {
  id: 'hsk2_cuaca',
  title: 'Cuaca',
  titleChinese: '天气',
  description: 'Pelajari cara mendeskripsikan cuaca dan bertanya tentang ramalan cuaca.',
  hskLevel: 2,
  category: 'weather',
  emoji: '⛅',
  estimatedMinutes: 15,
  vocab: [
    { hanzi: '天气', pinyin: 'tiānqì', meaning: 'cuaca', partOfSpeech: 'kata benda' },
    { hanzi: '晴天', pinyin: 'qíngtiān', meaning: 'hari yang cerah', partOfSpeech: 'kata benda' },
    { hanzi: '下雨', pinyin: 'xià yǔ', meaning: 'hujan', partOfSpeech: 'kata kerja' },
    { hanzi: '下雪', pinyin: 'xià xuě', meaning: 'turun salju', partOfSpeech: 'kata kerja' },
    { hanzi: '热', pinyin: 'rè', meaning: 'panas', partOfSpeech: 'kata sifat' },
    { hanzi: '冷', pinyin: 'lěng', meaning: 'dingin', partOfSpeech: 'kata sifat' },
    { hanzi: '刮风', pinyin: 'guā fēng', meaning: 'berangin', partOfSpeech: 'kata kerja' },
    { hanzi: '阴天', pinyin: 'yīntiān', meaning: 'mendung', partOfSpeech: 'kata benda' },
    { hanzi: '度', pinyin: 'dù', meaning: 'derajat (suhu)', partOfSpeech: 'kata benda' },
    { hanzi: '穿', pinyin: 'chuān', meaning: 'memakai (pakaian)', partOfSpeech: 'kata kerja' },
    { hanzi: '带', pinyin: 'dài', meaning: 'membawa', partOfSpeech: 'kata kerja' },
    { hanzi: '预报', pinyin: 'yùbào', meaning: 'ramalan / prakiraan', partOfSpeech: 'kata benda' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '今天天气怎么样？',
      pinyin: 'Jīntiān tiānqì zěnmeyàng?',
      translation: 'Cuaca hari ini bagaimana?',
    },
    {
      speaker: 'B',
      hanzi: '今天晴天，不冷也不热，很舒服。',
      pinyin: 'Jīntiān qíngtiān, bù lěng yě bù rè, hěn shūfú.',
      translation: 'Hari ini cerah, tidak dingin juga tidak panas, sangat nyaman.',
    },
    {
      speaker: 'A',
      hanzi: '明天呢？天气预报说什么？',
      pinyin: 'Míngtiān ne? Tiānqì yùbào shuō shénme?',
      translation: 'Kalau besok? Prakiraan cuaca bilang apa?',
    },
    {
      speaker: 'B',
      hanzi: '明天会下雨，气温只有十度。',
      pinyin: 'Míngtiān huì xià yǔ, qìwēn zhǐyǒu shí dù.',
      translation: 'Besok akan hujan, suhunya hanya sepuluh derajat.',
    },
    {
      speaker: 'A',
      hanzi: '那明天要穿厚衣服，带雨伞。',
      pinyin: 'Nà míngtiān yào chuān hòu yīfú, dài yǔsǎn.',
      translation: 'Kalau begitu besok harus pakai baju tebal, bawa payung.',
    },
    {
      speaker: 'B',
      hanzi: '对，北京的冬天很冷，要小心。',
      pinyin: 'Duì, Běijīng de dōngtiān hěn lěng, yào xiǎoxīn.',
      translation: 'Betul, musim dingin di Beijing sangat dingin, harus hati-hati.',
    },
  ],
  grammar: [
    {
      pattern: 'Subject + 会 + Verb',
      explanation:
        '"会" (huì) sebagai kata kerja modal dapat berarti "akan" (prediksi di masa depan) atau "bisa" (kemampuan yang dipelajari). Dalam konteks cuaca, "会" digunakan untuk prakiraan.',
      examples: [
        { hanzi: '明天会下雨。', pinyin: 'Míngtiān huì xià yǔ.', translation: 'Besok akan hujan.' },
        { hanzi: '今晚会刮风。', pinyin: 'Jīn wǎn huì guā fēng.', translation: 'Malam ini akan ada angin.' },
        { hanzi: '他会说中文。', pinyin: 'Tā huì shuō zhōngwén.', translation: 'Dia bisa berbicara bahasa Mandarin.' },
      ],
    },
    {
      pattern: '不…也不… (tidak … juga tidak …)',
      explanation:
        'Pola "不A也不B" digunakan untuk menyatakan bahwa sesuatu tidak memiliki sifat A dan juga tidak memiliki sifat B. Setara dengan "tidak A dan juga tidak B" dalam bahasa Indonesia.',
      examples: [
        { hanzi: '不冷也不热。', pinyin: 'Bù lěng yě bù rè.', translation: 'Tidak dingin juga tidak panas.' },
        { hanzi: '不大也不小。', pinyin: 'Bù dà yě bù xiǎo.', translation: 'Tidak besar juga tidak kecil.' },
        { hanzi: '不快也不慢。', pinyin: 'Bù kuài yě bù màn.', translation: 'Tidak cepat juga tidak lambat.' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习天气话题。问我今天天气怎么样，告诉我明天的天气预报，并给出穿衣建议。请用HSK2词汇。',
};

const lesson_hsk2_pekerjaan: Lesson = {
  id: 'hsk2_pekerjaan',
  title: 'Pekerjaan',
  titleChinese: '工作',
  description: 'Pelajari kosakata dunia kerja dan cara berbicara tentang pekerjaan dan tempat kerja.',
  hskLevel: 2,
  category: 'work',
  emoji: '💼',
  estimatedMinutes: 20,
  vocab: [
    { hanzi: '工作', pinyin: 'gōngzuò', meaning: 'bekerja / pekerjaan', partOfSpeech: 'kata kerja' },
    { hanzi: '公司', pinyin: 'gōngsī', meaning: 'perusahaan', partOfSpeech: 'kata benda' },
    { hanzi: '办公室', pinyin: 'bàngōngshì', meaning: 'kantor', partOfSpeech: 'kata benda' },
    { hanzi: '经理', pinyin: 'jīnglǐ', meaning: 'manajer', partOfSpeech: 'kata benda' },
    { hanzi: '同事', pinyin: 'tóngshì', meaning: 'rekan kerja / kolega', partOfSpeech: 'kata benda' },
    { hanzi: '上班', pinyin: 'shàngbān', meaning: 'mulai bekerja / pergi kerja', partOfSpeech: 'kata kerja' },
    { hanzi: '下班', pinyin: 'xiàbān', meaning: 'selesai bekerja / pulang kerja', partOfSpeech: 'kata kerja' },
    { hanzi: '开会', pinyin: 'kāihuì', meaning: 'rapat', partOfSpeech: 'kata kerja' },
    { hanzi: '忙', pinyin: 'máng', meaning: 'sibuk', partOfSpeech: 'kata sifat' },
    { hanzi: '累', pinyin: 'lèi', meaning: 'lelah / capek', partOfSpeech: 'kata sifat' },
    { hanzi: '薪水', pinyin: 'xīnshuǐ', meaning: 'gaji', partOfSpeech: 'kata benda' },
    { hanzi: '出差', pinyin: 'chūchāi', meaning: 'perjalanan dinas', partOfSpeech: 'kata kerja' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '你在哪里工作？',
      pinyin: 'Nǐ zài nǎlǐ gōngzuò?',
      translation: 'Kamu bekerja di mana?',
    },
    {
      speaker: 'B',
      hanzi: '我在一家科技公司工作，你呢？',
      pinyin: 'Wǒ zài yī jiā kējì gōngsī gōngzuò, nǐ ne?',
      translation: 'Saya bekerja di sebuah perusahaan teknologi, kamu?',
    },
    {
      speaker: 'A',
      hanzi: '我是一名经理，在办公室工作。今天开了三个会，很累！',
      pinyin: 'Wǒ shì yī míng jīnglǐ, zài bàngōngshì gōngzuò. Jīntiān kāi le sān gè huì, hěn lèi!',
      translation: 'Saya seorang manajer, bekerja di kantor. Hari ini rapat tiga kali, sangat lelah!',
    },
    {
      speaker: 'B',
      hanzi: '你几点下班？',
      pinyin: 'Nǐ jǐ diǎn xiàbān?',
      translation: 'Kamu pulang kerja jam berapa?',
    },
    {
      speaker: 'A',
      hanzi: '一般六点下班，但是今天要加班到八点。',
      pinyin: 'Yībān liù diǎn xiàbān, dànshì jīntiān yào jiābān dào bā diǎn.',
      translation: 'Biasanya pulang jam enam, tapi hari ini harus lembur sampai jam delapan.',
    },
    {
      speaker: 'B',
      hanzi: '辛苦了！下班后我们去吃饭吧！',
      pinyin: 'Xīnkǔ le! Xiàbān hòu wǒmen qù chīfàn ba!',
      translation: 'Kerja keras sekali! Setelah pulang kerja ayo kita makan!',
    },
  ],
  grammar: [
    {
      pattern: 'Subject + 在 + Place + Verb',
      explanation:
        '"在" (zài) digunakan sebagai preposisi yang berarti "di" untuk menunjukkan tempat terjadinya suatu tindakan. Letakkan "在 + tempat" sebelum kata kerja utama.',
      examples: [
        { hanzi: '我在公司工作。', pinyin: 'Wǒ zài gōngsī gōngzuò.', translation: 'Saya bekerja di perusahaan.' },
        { hanzi: '他在办公室开会。', pinyin: 'Tā zài bàngōngshì kāihuì.', translation: 'Dia rapat di kantor.' },
        { hanzi: '我们在家吃饭。', pinyin: 'Wǒmen zài jiā chīfàn.', translation: 'Kami makan di rumah.' },
      ],
    },
    {
      pattern: '一般…，但是…',
      explanation:
        '"一般" (yībān) berarti "biasanya" atau "pada umumnya". "但是" (dànshì) berarti "tetapi" atau "namun". Keduanya sering dipakai bersamaan untuk menyatakan pengecualian dari kebiasaan.',
      examples: [
        { hanzi: '一般八点上班，但是今天九点。', pinyin: 'Yībān bā diǎn shàngbān, dànshì jīntiān jiǔ diǎn.', translation: 'Biasanya mulai kerja jam delapan, tapi hari ini jam sembilan.' },
        { hanzi: '一般不加班，但是这周很忙。', pinyin: 'Yībān bù jiābān, dànshì zhè zhōu hěn máng.', translation: 'Biasanya tidak lembur, tapi minggu ini sangat sibuk.' },
        { hanzi: '我一般坐地铁，但是今天开车。', pinyin: 'Wǒ yībān zuò dìtiě, dànshì jīntiān kāichē.', translation: 'Biasanya saya naik kereta, tapi hari ini berkendara.' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习工作话题。问我在哪里工作，几点上下班，工作忙不忙。请用HSK2词汇帮我练习。',
};

// ─────────────────────────────────────────────────────────────
// HSK 3 Lessons
// ─────────────────────────────────────────────────────────────

const lesson_hsk3_hobi: Lesson = {
  id: 'hsk3_hobi',
  title: 'Hobi & Waktu Luang',
  titleChinese: '爱好与休闲',
  description: 'Pelajari cara membicarakan hobi, kegiatan waktu luang, dan minat dalam bahasa Mandarin.',
  hskLevel: 3,
  category: 'hobbies',
  emoji: '🎨',
  estimatedMinutes: 25,
  vocab: [
    { hanzi: '爱好', pinyin: 'àihào', meaning: 'hobi / kegemaran', partOfSpeech: 'kata benda' },
    { hanzi: '喜欢', pinyin: 'xǐhuān', meaning: 'menyukai / suka', partOfSpeech: 'kata kerja' },
    { hanzi: '音乐', pinyin: 'yīnyuè', meaning: 'musik', partOfSpeech: 'kata benda' },
    { hanzi: '画画', pinyin: 'huà huà', meaning: 'melukis / menggambar', partOfSpeech: 'kata kerja' },
    { hanzi: '运动', pinyin: 'yùndòng', meaning: 'olahraga', partOfSpeech: 'kata benda' },
    { hanzi: '旅游', pinyin: 'lǚyóu', meaning: 'wisata / perjalanan', partOfSpeech: 'kata kerja' },
    { hanzi: '看书', pinyin: 'kàn shū', meaning: 'membaca buku', partOfSpeech: 'kata kerja' },
    { hanzi: '看电影', pinyin: 'kàn diànyǐng', meaning: 'menonton film', partOfSpeech: 'kata kerja' },
    { hanzi: '打球', pinyin: 'dǎ qiú', meaning: 'bermain bola', partOfSpeech: 'kata kerja' },
    { hanzi: '有空', pinyin: 'yǒu kòng', meaning: 'ada waktu luang', partOfSpeech: 'kata kerja' },
    { hanzi: '兴趣', pinyin: 'xìngqù', meaning: 'minat', partOfSpeech: 'kata benda' },
    { hanzi: '业余时间', pinyin: 'yèyú shíjiān', meaning: 'waktu senggang', partOfSpeech: 'kata benda' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '你平时有什么爱好？',
      pinyin: 'Nǐ píngshí yǒu shénme àihào?',
      translation: 'Sehari-hari kamu punya hobi apa?',
    },
    {
      speaker: 'B',
      hanzi: '我喜欢画画和听音乐，有时候也会去旅游。你呢？',
      pinyin: 'Wǒ xǐhuān huà huà hé tīng yīnyuè, yǒu shíhòu yě huì qù lǚyóu. Nǐ ne?',
      translation: 'Saya suka melukis dan mendengarkan musik, kadang-kadang juga pergi wisata. Kamu?',
    },
    {
      speaker: 'A',
      hanzi: '我对运动很感兴趣，特别是打篮球。',
      pinyin: 'Wǒ duì yùndòng hěn gǎn xìngqù, tèbié shì dǎ lánqiú.',
      translation: 'Saya sangat tertarik dengan olahraga, terutama bermain basket.',
    },
    {
      speaker: 'B',
      hanzi: '真的吗？我也喜欢打球！我们周末一起打球怎么样？',
      pinyin: 'Zhēn de ma? Wǒ yě xǐhuān dǎ qiú! Wǒmen zhōumò yīqǐ dǎ qiú zěnmeyàng?',
      translation: 'Benarkah? Saya juga suka bermain bola! Bagaimana kalau akhir pekan kita bermain bola bersama?',
    },
    {
      speaker: 'A',
      hanzi: '好主意！你有空的时候还喜欢做什么？',
      pinyin: 'Hǎo zhǔyì! Nǐ yǒu kòng de shíhòu hái xǐhuān zuò shénme?',
      translation: 'Ide bagus! Kalau kamu punya waktu luang, suka melakukan apa lagi?',
    },
    {
      speaker: 'B',
      hanzi: '我喜欢在家看书或者看电影，放松一下。',
      pinyin: 'Wǒ xǐhuān zài jiā kàn shū huòzhě kàn diànyǐng, fàngsōng yīxià.',
      translation: 'Saya suka di rumah membaca buku atau menonton film, untuk bersantai.',
    },
  ],
  grammar: [
    {
      pattern: '对…感兴趣 (tertarik dengan…)',
      explanation:
        '"对…感兴趣" adalah pola tetap yang berarti "tertarik dengan..." atau "berminat dalam...". "对" berfungsi sebagai preposisi yang menunjukkan objek dari rasa tertarik.',
      examples: [
        { hanzi: '我对音乐很感兴趣。', pinyin: 'Wǒ duì yīnyuè hěn gǎn xìngqù.', translation: 'Saya sangat tertarik dengan musik.' },
        { hanzi: '她对中国历史感兴趣。', pinyin: 'Tā duì zhōngguó lìshǐ gǎn xìngqù.', translation: 'Dia tertarik dengan sejarah China.' },
        { hanzi: '你对什么感兴趣？', pinyin: 'Nǐ duì shénme gǎn xìngqù?', translation: 'Kamu tertarik dengan apa?' },
      ],
    },
    {
      pattern: '…或者… (…atau…) vs …还是… (…atau…)',
      explanation:
        '"或者" (huòzhě) digunakan dalam kalimat pernyataan dengan arti "atau". "还是" (háishì) digunakan khusus dalam kalimat tanya pilihan. Keduanya bermakna "atau" tetapi konteks penggunaannya berbeda.',
      examples: [
        { hanzi: '我喜欢看书或者看电影。', pinyin: 'Wǒ xǐhuān kàn shū huòzhě kàn diànyǐng.', translation: 'Saya suka membaca buku atau menonton film.' },
        { hanzi: '你喜欢音乐还是运动？', pinyin: 'Nǐ xǐhuān yīnyuè háishì yùndòng?', translation: 'Kamu suka musik atau olahraga?' },
        { hanzi: '坐火车还是坐飞机？', pinyin: 'Zuò huǒchē háishì zuò fēijī?', translation: 'Naik kereta atau naik pesawat?' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习爱好话题。问我平时有什么爱好，对什么感兴趣，然后分享你的"爱好"，让我们一起用HSK3词汇自然地对话。',
};

const lesson_hsk3_arah: Lesson = {
  id: 'hsk3_arah',
  title: 'Arah & Lokasi',
  titleChinese: '方向与位置',
  description: 'Pelajari cara memberikan dan memahami petunjuk arah serta mendeskripsikan lokasi suatu tempat.',
  hskLevel: 3,
  category: 'directions',
  emoji: '🗺️',
  estimatedMinutes: 25,
  vocab: [
    { hanzi: '左边', pinyin: 'zuǒbiān', meaning: 'sebelah kiri', partOfSpeech: 'kata benda' },
    { hanzi: '右边', pinyin: 'yòubiān', meaning: 'sebelah kanan', partOfSpeech: 'kata benda' },
    { hanzi: '前面', pinyin: 'qiánmiàn', meaning: 'bagian depan / ke depan', partOfSpeech: 'kata benda' },
    { hanzi: '后面', pinyin: 'hòumiàn', meaning: 'bagian belakang', partOfSpeech: 'kata benda' },
    { hanzi: '旁边', pinyin: 'pángbiān', meaning: 'di samping', partOfSpeech: 'kata benda' },
    { hanzi: '对面', pinyin: 'duìmiàn', meaning: 'di seberang', partOfSpeech: 'kata benda' },
    { hanzi: '附近', pinyin: 'fùjìn', meaning: 'di sekitar / dekat', partOfSpeech: 'kata benda' },
    { hanzi: '拐', pinyin: 'guǎi', meaning: 'belok', partOfSpeech: 'kata kerja' },
    { hanzi: '直走', pinyin: 'zhí zǒu', meaning: 'jalan lurus / terus', partOfSpeech: 'kata kerja' },
    { hanzi: '路口', pinyin: 'lùkǒu', meaning: 'persimpangan jalan', partOfSpeech: 'kata benda' },
    { hanzi: '红绿灯', pinyin: 'hónglǜdēng', meaning: 'lampu lalu lintas', partOfSpeech: 'kata benda' },
    { hanzi: '迷路', pinyin: 'mí lù', meaning: 'tersesat', partOfSpeech: 'kata kerja' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '不好意思，我迷路了。请问附近有医院吗？',
      pinyin: 'Bù hǎoyìsi, wǒ mí lù le. Qǐngwèn fùjìn yǒu yīyuàn ma?',
      translation: 'Permisi, saya tersesat. Apakah di sekitar sini ada rumah sakit?',
    },
    {
      speaker: 'B',
      hanzi: '有，离这里不远。你一直向前走，过了红绿灯往左拐。',
      pinyin: 'Yǒu, lí zhèlǐ bù yuǎn. Nǐ yīzhí xiàng qián zǒu, guò le hónglǜdēng wǎng zuǒ guǎi.',
      translation: 'Ada, tidak jauh dari sini. Kamu jalan lurus terus, setelah lampu merah belok ke kiri.',
    },
    {
      speaker: 'A',
      hanzi: '过了红绿灯往左拐，然后呢？',
      pinyin: 'Guò le hónglǜdēng wǎng zuǒ guǎi, rán hòu ne?',
      translation: 'Setelah lampu merah belok kiri, lalu?',
    },
    {
      speaker: 'B',
      hanzi: '在第二个路口再右拐，医院就在你右边。',
      pinyin: 'Zài dì èr gè lùkǒu zài yòu guǎi, yīyuàn jiù zài nǐ yòubiān.',
      translation: 'Di persimpangan kedua belok kanan lagi, rumah sakit ada di sebelah kananmu.',
    },
    {
      speaker: 'A',
      hanzi: '好的，谢谢！大概要走多久？',
      pinyin: 'Hǎo de, xièxiè! Dàgài yào zǒu duō jiǔ?',
      translation: 'Baik, terima kasih! Kira-kira butuh berapa lama jalan kaki?',
    },
    {
      speaker: 'B',
      hanzi: '走路大概五分钟，不远的。祝你顺利！',
      pinyin: 'Zǒulù dàgài wǔ fēnzhōng, bù yuǎn de. Zhù nǐ shùnlì!',
      translation: 'Jalan kaki sekitar lima menit, tidak jauh. Semoga lancar!',
    },
  ],
  grammar: [
    {
      pattern: '离…(不)远 / 离…近',
      explanation:
        '"离" (lí) digunakan sebagai preposisi yang berarti "dari" atau "jauh dari" dalam konteks jarak. Pola "离 A 很远" berarti "sangat jauh dari A", sedangkan "离 A 不远" berarti "tidak jauh dari A".',
      examples: [
        { hanzi: '医院离这里不远。', pinyin: 'Yīyuàn lí zhèlǐ bù yuǎn.', translation: 'Rumah sakit tidak jauh dari sini.' },
        { hanzi: '学校离我家很近。', pinyin: 'Xuéxiào lí wǒ jiā hěn jìn.', translation: 'Sekolah sangat dekat dari rumah saya.' },
        { hanzi: '火车站离这里有多远？', pinyin: 'Huǒchēzhàn lí zhèlǐ yǒu duō yuǎn?', translation: 'Seberapa jauh stasiun kereta dari sini?' },
      ],
    },
    {
      pattern: '向/往 + Direction + Verb',
      explanation:
        '"向" (xiàng) dan "往" (wǎng) keduanya berarti "menuju" atau "ke arah". Diletakkan sebelum kata arah dan kata kerja gerakan untuk menunjukkan arah pergerakan.',
      examples: [
        { hanzi: '往左拐。', pinyin: 'Wǎng zuǒ guǎi.', translation: 'Belok ke kiri.' },
        { hanzi: '向前走五分钟。', pinyin: 'Xiàng qián zǒu wǔ fēnzhōng.', translation: 'Jalan lurus ke depan selama lima menit.' },
        { hanzi: '往右走就到了。', pinyin: 'Wǎng yòu zǒu jiù dào le.', translation: 'Jalan ke kanan sudah sampai.' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习问路和指路。假设我迷路了，帮我用方向词汇找到一个目的地，练习自然的问路对话。请用HSK3词汇。',
};

const lesson_hsk3_kesehatan: Lesson = {
  id: 'hsk3_kesehatan',
  title: 'Kesehatan & Tubuh',
  titleChinese: '健康与身体',
  description: 'Pelajari kosakata seputar tubuh manusia, kondisi kesehatan, dan cara berkomunikasi dengan dokter.',
  hskLevel: 3,
  category: 'hobbies',
  emoji: '🏥',
  estimatedMinutes: 25,
  vocab: [
    { hanzi: '头', pinyin: 'tóu', meaning: 'kepala', partOfSpeech: 'kata benda' },
    { hanzi: '肚子', pinyin: 'dùzi', meaning: 'perut', partOfSpeech: 'kata benda' },
    { hanzi: '发烧', pinyin: 'fāshāo', meaning: 'demam', partOfSpeech: 'kata kerja' },
    { hanzi: '头疼', pinyin: 'tóuténg', meaning: 'sakit kepala', partOfSpeech: 'kata kerja' },
    { hanzi: '咳嗽', pinyin: 'késou', meaning: 'batuk', partOfSpeech: 'kata kerja' },
    { hanzi: '医生', pinyin: 'yīshēng', meaning: 'dokter', partOfSpeech: 'kata benda' },
    { hanzi: '药', pinyin: 'yào', meaning: 'obat', partOfSpeech: 'kata benda' },
    { hanzi: '休息', pinyin: 'xiūxi', meaning: 'beristirahat', partOfSpeech: 'kata kerja' },
    { hanzi: '检查', pinyin: 'jiǎnchá', meaning: 'memeriksa', partOfSpeech: 'kata kerja' },
    { hanzi: '严重', pinyin: 'yánzhòng', meaning: 'serius / parah', partOfSpeech: 'kata sifat' },
    { hanzi: '过敏', pinyin: 'guòmǐn', meaning: 'alergi', partOfSpeech: 'kata kerja' },
    { hanzi: '手术', pinyin: 'shǒushù', meaning: 'operasi (bedah)', partOfSpeech: 'kata benda' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '医生，我头疼，肚子也不舒服。',
      pinyin: 'Yīshēng, wǒ tóuténg, dùzi yě bù shūfú.',
      translation: 'Dokter, kepala saya sakit, perut saya juga tidak nyaman.',
    },
    {
      speaker: 'B',
      hanzi: '你发烧了吗？症状从什么时候开始的？',
      pinyin: 'Nǐ fāshāo le ma? Zhèngzhuàng cóng shénme shíhòu kāishǐ de?',
      translation: 'Apakah kamu demam? Gejalanya mulai dari kapan?',
    },
    {
      speaker: 'A',
      hanzi: '昨天晚上开始的，而且还在咳嗽。',
      pinyin: 'Zuótiān wǎnshang kāishǐ de, érqiě hái zài késou.',
      translation: 'Mulai dari semalam, dan juga masih batuk.',
    },
    {
      speaker: 'B',
      hanzi: '我来给你检查一下。体温三十八度半，有点儿发烧。',
      pinyin: 'Wǒ lái gěi nǐ jiǎnchá yīxià. Tǐwēn sānshíbā dù bàn, yǒudiǎnr fāshāo.',
      translation: 'Saya periksa dulu. Suhu tubuh tiga puluh delapan setengah, agak demam.',
    },
    {
      speaker: 'A',
      hanzi: '严重吗？需要吃药吗？',
      pinyin: 'Yánzhòng ma? Xūyào chī yào ma?',
      translation: 'Apakah serius? Perlu minum obat?',
    },
    {
      speaker: 'B',
      hanzi: '不太严重。我开一些药，回家多休息，多喝水。',
      pinyin: 'Bù tài yánzhòng. Wǒ kāi yīxiē yào, huí jiā duō xiūxi, duō hē shuǐ.',
      translation: 'Tidak terlalu serius. Saya resepkan beberapa obat, pulang ke rumah banyak istirahat, banyak minum air.',
    },
  ],
  grammar: [
    {
      pattern: '从…开始 (mulai dari…)',
      explanation:
        '"从" (cóng) berarti "dari" (titik awal). "开始" (kāishǐ) berarti "mulai". Bersama-sama, "从…开始" menyatakan titik awal dari suatu kejadian dalam waktu atau ruang.',
      examples: [
        { hanzi: '从昨天开始发烧。', pinyin: 'Cóng zuótiān kāishǐ fāshāo.', translation: 'Mulai demam sejak kemarin.' },
        { hanzi: '从明天开始学中文。', pinyin: 'Cóng míngtiān kāishǐ xué zhōngwén.', translation: 'Mulai belajar bahasa Mandarin dari besok.' },
        { hanzi: '从这里开始往右走。', pinyin: 'Cóng zhèlǐ kāishǐ wǎng yòu zǒu.', translation: 'Dari sini mulai jalan ke kanan.' },
      ],
    },
    {
      pattern: '多 + Verb (lebih banyak melakukan…)',
      explanation:
        '"多" (duō) sebelum kata kerja berarti "lebih banyak" melakukan suatu tindakan. Biasanya digunakan dalam saran atau anjuran. Kebalikannya adalah "少" (shǎo) yang berarti "kurang" atau "lebih sedikit".',
      examples: [
        { hanzi: '多休息，多喝水。', pinyin: 'Duō xiūxi, duō hē shuǐ.', translation: 'Banyak istirahat, banyak minum air.' },
        { hanzi: '多吃蔬菜，少吃肉。', pinyin: 'Duō chī shūcài, shǎo chī ròu.', translation: 'Banyak makan sayur, sedikit makan daging.' },
        { hanzi: '你要多锻炼身体。', pinyin: 'Nǐ yào duō duànliàn shēntǐ.', translation: 'Kamu harus lebih banyak berolahraga.' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习看病话题。扮演一个医生，问我身体哪里不舒服，然后给出建议。请用HSK3词汇进行自然的医患对话。',
};

const lesson_hsk3_perasaan: Lesson = {
  id: 'hsk3_perasaan',
  title: 'Perasaan & Emosi',
  titleChinese: '感情与情绪',
  description: 'Pelajari cara mengungkapkan berbagai perasaan dan emosi secara lebih mendalam dalam bahasa Mandarin.',
  hskLevel: 3,
  category: 'hobbies',
  emoji: '😊',
  estimatedMinutes: 25,
  vocab: [
    { hanzi: '感情', pinyin: 'gǎnqíng', meaning: 'perasaan / emosi', partOfSpeech: 'kata benda' },
    { hanzi: '开心', pinyin: 'kāixīn', meaning: 'senang / bahagia', partOfSpeech: 'kata sifat' },
    { hanzi: '难过', pinyin: 'nánguò', meaning: 'sedih / susah', partOfSpeech: 'kata sifat' },
    { hanzi: '担心', pinyin: 'dānxīn', meaning: 'khawatir / cemas', partOfSpeech: 'kata kerja' },
    { hanzi: '生气', pinyin: 'shēngqì', meaning: 'marah', partOfSpeech: 'kata kerja' },
    { hanzi: '害怕', pinyin: 'hàipà', meaning: 'takut', partOfSpeech: 'kata kerja' },
    { hanzi: '激动', pinyin: 'jīdòng', meaning: 'bersemangat / terharu', partOfSpeech: 'kata sifat' },
    { hanzi: '后悔', pinyin: 'hòuhuǐ', meaning: 'menyesal', partOfSpeech: 'kata kerja' },
    { hanzi: '满意', pinyin: 'mǎnyì', meaning: 'puas / memuaskan', partOfSpeech: 'kata kerja' },
    { hanzi: '奇怪', pinyin: 'qíguài', meaning: 'aneh / ganjil', partOfSpeech: 'kata sifat' },
    { hanzi: '伤心', pinyin: 'shāngxīn', meaning: 'patah hati / sangat sedih', partOfSpeech: 'kata sifat' },
    { hanzi: '放松', pinyin: 'fàngsōng', meaning: 'bersantai / rileks', partOfSpeech: 'kata kerja' },
  ],
  dialogue: [
    {
      speaker: 'A',
      hanzi: '你今天看起来不开心，怎么了？',
      pinyin: 'Nǐ jīntiān kàn qǐlái bù kāixīn, zěnme le?',
      translation: 'Kamu hari ini kelihatan tidak senang, ada apa?',
    },
    {
      speaker: 'B',
      hanzi: '我很担心考试，万一考不好怎么办？',
      pinyin: 'Wǒ hěn dānxīn kǎoshì, wànrú kǎo bù hǎo zěnme bàn?',
      translation: 'Saya sangat khawatir dengan ujian, bagaimana kalau tidak lulus?',
    },
    {
      speaker: 'A',
      hanzi: '别担心！你平时学习那么努力，一定没问题的。',
      pinyin: 'Bié dānxīn! Nǐ píngshí xuéxí nàme nǔlì, yīdìng méi wèntí de.',
      translation: 'Jangan khawatir! Kamu biasanya belajar sangat rajin, pasti tidak ada masalah.',
    },
    {
      speaker: 'B',
      hanzi: '谢谢你的鼓励，我感觉好多了。',
      pinyin: 'Xièxiè nǐ de gǔlì, wǒ gǎnjué hǎo duō le.',
      translation: 'Terima kasih atas semangatmu, saya merasa jauh lebih baik.',
    },
    {
      speaker: 'A',
      hanzi: '考完试之后，我们一起去庆祝吧！你最近有什么开心的事吗？',
      pinyin: 'Kǎo wán shì zhīhòu, wǒmen yīqǐ qù qìngzhù ba! Nǐ zuìjìn yǒu shénme kāixīn de shì ma?',
      translation: 'Setelah ujian selesai, ayo kita rayakan bersama! Belakangan ini ada hal yang membuatmu senang?',
    },
    {
      speaker: 'B',
      hanzi: '有！我被公司录用了，下个月就要开始工作了，很激动！',
      pinyin: 'Yǒu! Wǒ bèi gōngsī lùyòng le, xià gè yuè jiù yào kāishǐ gōngzuò le, hěn jīdòng!',
      translation: 'Ada! Saya diterima kerja di perusahaan, bulan depan sudah mulai bekerja, sangat bersemangat!',
    },
  ],
  grammar: [
    {
      pattern: '看起来 + Adj (terlihat / kelihatan)',
      explanation:
        '"看起来" (kàn qǐlái) berarti "terlihat..." atau "kelihatan...". Digunakan untuk mendeskripsikan kesan visual tentang keadaan seseorang atau sesuatu berdasarkan penampilan luar.',
      examples: [
        { hanzi: '你看起来很开心。', pinyin: 'Nǐ kàn qǐlái hěn kāixīn.', translation: 'Kamu kelihatan sangat senang.' },
        { hanzi: '他看起来很累。', pinyin: 'Tā kàn qǐlái hěn lèi.', translation: 'Dia terlihat sangat lelah.' },
        { hanzi: '这道菜看起来很好吃。', pinyin: 'Zhè dào cài kàn qǐlái hěn hǎochī.', translation: 'Masakan ini kelihatan sangat enak.' },
      ],
    },
    {
      pattern: '被 + Agent + Verb (kalimat pasif)',
      explanation:
        'Kalimat pasif dengan "被" (bèi) digunakan ketika subjek menjadi penerima tindakan. Polanya: Subjek + 被 + (pelaku) + Kata Kerja. Biasanya digunakan untuk kejadian yang tidak menyenangkan, meskipun tidak selalu.',
      examples: [
        { hanzi: '我被公司录用了。', pinyin: 'Wǒ bèi gōngsī lùyòng le.', translation: 'Saya diterima kerja oleh perusahaan.' },
        { hanzi: '他被老师表扬了。', pinyin: 'Tā bèi lǎoshī biǎoyáng le.', translation: 'Dia dipuji oleh guru.' },
        { hanzi: '我的钱包被偷了。', pinyin: 'Wǒ de qiánbāo bèi tōu le.', translation: 'Dompet saya dicuri.' },
      ],
    },
  ],
  practicePrompt: '你好！请用这节课的词汇练习表达感情和情绪。问我最近心情怎么样，帮我用各种情绪词汇进行自然的对话，包括开心的事和担心的事。请用HSK3词汇。',
};

// ─────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────

export const LESSONS: Lesson[] = [
  lesson_hsk1_perkenalan,
  lesson_hsk1_keluarga,
  lesson_hsk1_angkawaktu,
  lesson_hsk1_makanminum,
  lesson_hsk2_transportasi,
  lesson_hsk2_belanja,
  lesson_hsk2_cuaca,
  lesson_hsk2_pekerjaan,
  lesson_hsk3_hobi,
  lesson_hsk3_arah,
  lesson_hsk3_kesehatan,
  lesson_hsk3_perasaan,
];

export const LESSONS_BY_HSK: { 1: Lesson[]; 2: Lesson[]; 3: Lesson[] } = {
  1: LESSONS.filter((l) => l.hskLevel === 1),
  2: LESSONS.filter((l) => l.hskLevel === 2),
  3: LESSONS.filter((l) => l.hskLevel === 3),
};

export const LESSON_CATEGORIES: Record<string, { label: string; emoji: string }> = {
  greetings:  { label: 'Salam',          emoji: '👋' },
  family:     { label: 'Keluarga',       emoji: '👨‍👩‍👧‍👦' },
  food:       { label: 'Makanan',        emoji: '🍜' },
  travel:     { label: 'Perjalanan',     emoji: '✈️' },
  shopping:   { label: 'Belanja',        emoji: '🛍️' },
  work:       { label: 'Pekerjaan',      emoji: '💼' },
  hobbies:    { label: 'Hobi',           emoji: '🎨' },
  weather:    { label: 'Cuaca',          emoji: '⛅' },
  time:       { label: 'Waktu',          emoji: '🕐' },
  directions: { label: 'Arah',           emoji: '🗺️' },
};
