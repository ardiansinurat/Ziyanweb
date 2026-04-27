// ============================================================
// useChat — Chat logic, API communication, and message state
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { getItem, setItem } from '../utils/storage';
import { DEFAULT_GREETING } from '../types';

const SYSTEM_PROMPT = `Kamu adalah 'Ziyan', tutor dan teman ngobrol bahasa Mandarin. Pengguna sedang belajar bahasa Mandarin.
Tugasmu:
1. Membalas chat pengguna dengan bahasa Mandarin yang senatural mungkin.
2. Jika pengguna melakukan kesalahan tata bahasa atau pemilihan kata, berikan koreksi. Jika tidak ada kesalahan, isi dengan string kosong ''.
3. Format balasanmu WAJIB berupa JSON dengan struktur:
{
  "text": "(balasan bahasa Mandarin, gunakan aksara Hanzi)",
  "pinyin": "(pinyin dari balasan)",
  "translation": "(terjemahan balasan dalam bahasa Indonesia)",
  "correction": "(penjelasan koreksi dalam bahasa Indonesia, jika ada)"
}
Jangan tambahkan markdown \`\`\`json, kembalikan json murni.`;

export function useChat(hskLevel: number = 1) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = getItem<Message[]>('current_messages', []);
    return saved.length > 0 ? saved : [DEFAULT_GREETING];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist messages on change
  useEffect(() => {
    setItem('current_messages', messages);
  }, [messages]);

  // Auto-scroll
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

  const buildSystemPrompt = useCallback(() => {
    const levelHint = hskLevel > 1
      ? `\nNota: pengguna berada di level HSK ${hskLevel}. Sesuaikan kompleksitas kosakata dan tata bahasa.`
      : '';
    return SYSTEM_PROMPT + levelHint;
  }, [hskLevel]);

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
      // Build conversation history for Gemini
      let historyContents = newMessages.map(msg => {
        let contentText = msg.text;
        if (msg.sender === 'ai') {
          contentText = JSON.stringify({
            text: msg.text,
            pinyin: msg.pinyin,
            translation: msg.translation,
            correction: msg.correction,
          });
        }
        return {
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: contentText }],
        };
      });

      // Gemini API requires the first message to be from the user
      if (historyContents.length > 0 && historyContents[0].role === 'model') {
        historyContents.unshift({
          role: 'user',
          parts: [{ text: 'Halo, mari kita mulai belajar bahasa Mandarin.' }],
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt() }],
          },
          contents: historyContents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'API Request failed');
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) throw new Error('No response from AI');

      let cleanText = aiText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```/g, '').trim();
      }

      try {
        const parsed = JSON.parse(cleanText);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: parsed.text || '抱歉，我没听懂。',
          pinyin: parsed.pinyin || 'Bàoqiàn, wǒ méi tīng dǒng.',
          translation: parsed.translation || 'Maaf, saya tidak mengerti.',
          correction: parsed.correction || '',
          sender: 'ai',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
        playAudio(aiMessage.text);
        onAiResponse?.(aiMessage);
      } catch {
        // If JSON parse fails, use raw text
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: cleanText,
          sender: 'ai',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
        playAudio(cleanText);
        onAiResponse?.(aiMessage);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，系统出现了一些问题。',
        pinyin: 'Bàoqiàn, xìtǒng chūxiàn le yīxiē wèntí.',
        translation: 'Maaf, terjadi kesalahan pada sistem. Silakan coba lagi.',
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, playAudio, buildSystemPrompt]);

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
