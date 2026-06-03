// ============================================================
// useChat — Token-efficient chat logic
//
// Token-saving strategies:
//  1. SLIDING WINDOW — only last CONTEXT_WINDOW messages sent to API
//  2. COMPRESSED HISTORY — AI messages sent as text-only (no pinyin/
//     translation/correction, those are UI-only fields)
//  3. LEAN SYSTEM PROMPT — concise instructions, no padding
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { getItem, setItem } from '../utils/storage';
import { DEFAULT_GREETING } from '../types';

// Maximum number of past messages to send as context.
// Each exchange (user + AI) = 2 messages, so 8 = last 4 exchanges.
const CONTEXT_WINDOW = 8;

// Lean system prompt — concise but precise instructions
const SYSTEM_PROMPT = `Kamu adalah Ziyan, tutor Mandarin AI untuk penutur bahasa Indonesia. Balas SELALU dengan JSON murni tanpa markdown atau teks lain:
{"text":"<Hanzi>","pinyin":"<pinyin dengan tanda nada>","translation":"<terjemahan Indonesia>","correction":"<koreksi jika ada kesalahan, kosong jika tidak>","tip":"<tip grammar atau budaya singkat, kosong jika tidak perlu>"}

Panduan respons:
- text: SELALU dalam karakter Hanzi. Salam/basa-basi: 1-2 kalimat. Penjelasan grammar: 2-3 kalimat + contoh.
- pinyin: tanda nada wajib (ā á ǎ à), pisah tiap kata dengan spasi.
- correction: gunakan format "❌ <kalimat salah> → ✅ <kalimat benar>" HANYA jika ada kesalahan nyata. Kosong jika tidak ada kesalahan.
- tip: berikan catatan grammar/budaya HANYA jika benar-benar membantu. Contoh: pola kalimat, perbedaan kata, konteks budaya. Kosong untuk percakapan biasa.
- Akhiri setiap respons dengan satu pertanyaan singkat untuk mendorong percakapan berlanjut.`;

export function useChat(hskLevel: number = 1, accuracy?: number) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = getItem<Message[]>('current_messages', []);
    return saved.length > 0 ? saved : [DEFAULT_GREETING];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItem('current_messages', messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const playAudio = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  /**
   * Build a token-efficient history for the API.
   *
   * - Takes only the last CONTEXT_WINDOW messages (sliding window).
   * - For AI messages, only sends `text` (Hanzi) — NOT pinyin/translation/
   *   correction, which are UI-only and waste tokens.
   * - Ensures the sequence always starts with a user turn (Gemini requirement).
   */
  const buildHistory = useCallback((allMessages: Message[]) => {
    // Slice to window, always include the latest user message (last item)
    const windowed = allMessages.slice(-CONTEXT_WINDOW);

    const contents = windowed.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      // For AI: only the Chinese text — pinyin/translation are for the UI only
      parts: [{ text: msg.text }],
    }));

    // Gemini requires the conversation to start with a user turn
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.unshift({
        role: 'user',
        parts: [{ text: '开始' }], // "Begin" — minimal bootstrap token cost
      });
    }

    return contents;
  }, []);

  const buildSystemPrompt = useCallback(() => {
    const hskGuide: Record<number, string> = {
      1: ' Level HSK 1: gunakan kosakata 150 kata dasar, kalimat sangat sederhana, banyak dorongan.',
      2: ' Level HSK 2: kosakata ~300 kata, struktur kalimat dasar, boleh pakai partikel 了/过/着.',
      3: ' Level HSK 3: kosakata ~600 kata, boleh kalimat majemuk sederhana, gunakan 因为/所以/虽然.',
      4: ' Level HSK 4+: kosakata luas, ungkapan idiomatik, struktur kalimat kompleks.',
    };
    const levelNote = hskGuide[hskLevel] ?? hskGuide[4];

    let difficultyNote = '';
    if (accuracy !== undefined) {
      if (accuracy < 50) {
        difficultyNote = ' Pengguna sering salah — gunakan kalimat pendek, sederhana, dan beri banyak semangat.';
      } else if (accuracy > 85) {
        difficultyNote = ' Pengguna sangat akurat — tingkatkan kompleksitas kosakata dan variasi struktur kalimat.';
      }
    }

    return SYSTEM_PROMPT + levelNote + difficultyNote;
  }, [hskLevel, accuracy]);

  const sendMessage = useCallback(async (
    text: string,
    onUserSent?: () => void,
    onAiResponse?: (msg: Message) => void,
  ) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    onUserSent?.();
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt() }],
          },
          contents: buildHistory(newMessages),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'API Request failed');
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) throw new Error('No response from AI');

      // Strip any markdown fences the model may add despite instructions
      const cleanText = aiText.trim()
        .replace(/^```json\n?/, '')
        .replace(/^```\n?/, '')
        .replace(/\n?```$/, '')
        .trim();

      try {
        const parsed = JSON.parse(cleanText);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: parsed.text || '抱歉，我没听懂。',
          pinyin: parsed.pinyin || '',
          translation: parsed.translation || '',
          correction: parsed.correction || '',
          tip: parsed.tip || '',
          sender: 'ai',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
        playAudio(aiMessage.text);
        onAiResponse?.(aiMessage);
      } catch {
        // Try to extract text field via regex as fallback
        const textMatch = cleanText.match(/"text"\s*:\s*"([^"]+)"/);
        const pinyinMatch = cleanText.match(/"pinyin"\s*:\s*"([^"]+)"/);
        const translationMatch = cleanText.match(/"translation"\s*:\s*"([^"]+)"/);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: textMatch?.[1] || cleanText,
          pinyin: pinyinMatch?.[1] || '',
          translation: translationMatch?.[1] || '',
          sender: 'ai',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
        playAudio(aiMessage.text);
        onAiResponse?.(aiMessage);
      }
    } catch (error) {
      console.error('API Error:', error);
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: isNetworkError ? '网络连接出现问题。' : '抱歉，请稍后再试。',
        pinyin: isNetworkError ? 'Wǎngluò liánjīe chūxiàn wèntí.' : 'Bàoqiàn, qǐng shāohòu zài shì.',
        translation: isNetworkError
          ? 'Koneksi jaringan bermasalah. Periksa internet Anda.'
          : 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        sender: 'ai',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, playAudio, buildSystemPrompt, buildHistory]);

  const clearChat = useCallback(() => {
    setMessages([DEFAULT_GREETING]);
  }, []);

  return {
    messages,
    isLoading,
    messagesEndRef,
    sendMessage,
    clearChat,
    playAudio,
  };
}
