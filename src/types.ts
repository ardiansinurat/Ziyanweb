// ============================================================
// Shared TypeScript types for the Ziyan Mandarin Learning App
// ============================================================

export interface Message {
  id: string;
  text: string;
  pinyin?: string;
  translation?: string;
  correction?: string;
  tip?: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example?: string;
  savedAt: number;
  source: 'chat' | 'daily' | 'manual';
}

export interface UserStats {
  totalMessages: number;
  totalWords: number;
  corrections: number;
  correctMessages: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyMessageCount: number;
  xp: number;    // Experience points
  level: number; // Learning level (1–10)
  longestStreak?: number;
  weeklyXp?: number;
  weekStartDate?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  hskLevel: number; // 1-6
  theme: string;
}

export type ThemeId =
  | 'light-pastel'
  | 'light-vintage'
  | 'light-minimalist'
  | 'dark-astronaut'
  | 'dark-bintang'
  | 'dark-aurora';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  category: 'Light Mode' | 'Dark Mode';
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'light-pastel', label: 'Pastel', category: 'Light Mode' },
  { id: 'light-vintage', label: 'Vintage', category: 'Light Mode' },
  { id: 'light-minimalist', label: 'Minimalist', category: 'Light Mode' },
  { id: 'dark-astronaut', label: 'Astronaut', category: 'Dark Mode' },
  { id: 'dark-bintang', label: 'Bintang', category: 'Dark Mode' },
  { id: 'dark-aurora', label: 'Aurora', category: 'Dark Mode' },
];

export const DEFAULT_GREETING: Message = {
  id: '1',
  text: '你好！今天你想学什么？',
  pinyin: 'Nǐ hǎo! Jīntiān nǐ xiǎng xué shénme?',
  translation: 'Halo! Hari ini kamu ingin belajar apa?',
  sender: 'ai',
  timestamp: Date.now(),
};
