// ============================================================
// App.tsx — Slim orchestrator for the Ziyan Learning App
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import './index.css';

import type { ThemeId } from './types';
import { useTheme } from './hooks/useTheme';
import { useChat } from './hooks/useChat';
import { useStats } from './hooks/useStats';
import { useVocab } from './hooks/useVocab';
import { getItem, setItem, migrateLegacyStorage } from './utils/storage';

import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatPanel } from './components/Chat/ChatPanel';
import { SettingsModal } from './components/Modals/SettingsModal';
import { useToast } from './components/UI/Toast';

// Run once on first load
migrateLegacyStorage();

function App() {
  // === Profile state ===
  const [userName, setUserName] = useState(() => getItem<string>('profile_name', 'Pelajar'));
  const [userAvatar, setUserAvatar] = useState(() => getItem<string>('profile_avatar', ''));
  const [hskLevel, setHskLevel] = useState(() => getItem<number>('profile_hsk', 1));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // === Hooks ===
  const { theme, setTheme } = useTheme();
  const { stats, accuracy, recordUserMessage, recordAiResponse } = useStats();
  const { words, addWord, removeWord, isWordSaved, totalWords } = useVocab();
  const { showToast } = useToast();

  const { messages, isLoading, messagesEndRef, sendMessage, clearChat, playAudio } = useChat(hskLevel);

  // Persist profile changes
  useEffect(() => {
    setItem('profile_name', userName);
    setItem('profile_avatar', userAvatar);
    setItem('profile_hsk', hskLevel);
  }, [userName, userAvatar, hskLevel]);

  // === Handlers ===
  const handleSend = useCallback((text: string) => {
    sendMessage(
      text,
      () => recordUserMessage(),
      (aiMsg) => {
        const hadCorrection = !!(aiMsg.correction && aiMsg.correction.trim());
        const wordCount = aiMsg.text.length; // Chinese characters
        recordAiResponse(hadCorrection, wordCount);
      }
    );
  }, [sendMessage, recordUserMessage, recordAiResponse]);

  const handleSaveWord = useCallback((hanzi: string) => {
    // Find the message to extract pinyin and translation
    const msg = messages.find(m => m.text === hanzi && m.sender === 'ai');
    addWord({
      hanzi,
      pinyin: msg?.pinyin || '',
      meaning: msg?.translation || '',
      source: 'chat',
    });
    showToast('Kata disimpan ke kosakata!', 'success');
  }, [messages, addWord, showToast]);

  const handleSettingsSave = useCallback((data: { name: string; avatar: string; theme: ThemeId; hskLevel: number }) => {
    setUserName(data.name);
    setUserAvatar(data.avatar);
    setTheme(data.theme);
    setHskLevel(data.hskLevel);
    showToast('Pengaturan disimpan!', 'success');
  }, [setTheme, showToast]);

  const handleClearChat = useCallback(() => {
    clearChat();
    showToast('Percakapan baru dimulai', 'info');
  }, [clearChat, showToast]);

  const handleStartPractice = useCallback(() => {
    handleSend('给我一个练习题');
    setIsSidebarOpen(false);
  }, [handleSend]);

  return (
    <>
      <div className="theme-bg-layer">
        {theme === 'light-vintage' && <div className="vintage-pattern" />}
        {theme === 'light-minimalist' && <div className="minimalist-pattern" />}
        {theme === 'dark-bintang' && <div className="stars-pattern" />}
        {theme === 'dark-astronaut' && <div className="astronaut-pattern" />}
        {theme === 'dark-aurora' && <div className="aurora-pattern" />}
      </div>

      <div className="app-container">
        <Sidebar
          userName={userName}
          userAvatar={userAvatar}
          hskLevel={hskLevel}
          streakDays={stats.streakDays}
          accuracy={accuracy}
          totalWords={totalWords}
          dailyCount={stats.dailyMessageCount}
          vocabWords={words}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRemoveWord={removeWord}
          onStartPractice={handleStartPractice}
          playAudio={playAudio}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          onSend={handleSend}
          onClearChat={handleClearChat}
          playAudio={playAudio}
          isWordSaved={isWordSaved}
          onSaveWord={handleSaveWord}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        userAvatar={userAvatar}
        theme={theme}
        hskLevel={hskLevel}
        onSave={handleSettingsSave}
      />
    </>
  );
}

export default App;
