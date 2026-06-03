// ============================================================
// App.tsx — Orchestrator for the Ziyan Learning App
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import './index.css';

import type { ThemeId } from './types';
import { useTheme } from './hooks/useTheme';
import { useChat } from './hooks/useChat';
import { useStats } from './hooks/useStats';
import { useVocab } from './hooks/useVocab';
import { useActivityHistory } from './hooks/useActivityHistory';
import { getItem, setItem, migrateLegacyStorage } from './utils/storage';

import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatPanel } from './components/Chat/ChatPanel';
import { SettingsModal } from './components/Modals/SettingsModal';
import { CharacterModal } from './components/Modals/CharacterModal';
import { OnboardingModal } from './components/Modals/OnboardingModal';
import { TabNav, type Tab } from './components/Navigation/TabNav';
import FlashcardView from './components/Flashcard/FlashcardView';
import ProgressDashboard from './components/Dashboard/ProgressDashboard';
import { LessonsView } from './components/Lessons/LessonsView';
import { useToast } from './components/UI/Toast';

migrateLegacyStorage();

function App() {
  // === Profile state ===
  const [userName, setUserName] = useState(() => getItem<string>('profile_name', 'Pelajar'));
  const [userAvatar, setUserAvatar] = useState(() => getItem<string>('profile_avatar', ''));
  const [hskLevel, setHskLevel] = useState(() => getItem<number>('profile_hsk', 1));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !getItem<boolean>('onboarded', false));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(() => getItem<Tab>('active_tab', 'chat'));

  // === Hooks ===
  const { theme, setTheme } = useTheme();
  const { stats, accuracy, recordUserMessage, recordAiResponse, resetStats } = useStats();
  const { words, addWord, removeWord, isWordSaved, totalWords } = useVocab();
  const { showToast } = useToast();
  const { updateToday } = useActivityHistory();
  const { messages, isLoading, messagesEndRef, sendMessage, clearChat, playAudio } = useChat(hskLevel);

  // Persist profile
  useEffect(() => {
    setItem('profile_name', userName);
    setItem('profile_avatar', userAvatar);
    setItem('profile_hsk', hskLevel);
  }, [userName, userAvatar, hskLevel]);

  // Persist active tab
  useEffect(() => {
    setItem('active_tab', activeTab);
  }, [activeTab]);

  // Sync activity history with current stats
  useEffect(() => {
    updateToday(stats.totalMessages, totalWords);
  }, [stats.totalMessages, totalWords, updateToday]);

  // === Handlers ===
  const handleSend = useCallback((text: string) => {
    sendMessage(
      text,
      () => recordUserMessage(),
      (aiMsg) => {
        const hadCorrection = !!(aiMsg.correction && aiMsg.correction.trim());
        recordAiResponse(hadCorrection, aiMsg.text.length);
      }
    );
  }, [sendMessage, recordUserMessage, recordAiResponse]);

  // Navigate to chat tab and send a message (used by Lessons/Flashcard)
  const handleSendToChat = useCallback((text: string) => {
    setActiveTab('chat');
    setTimeout(() => handleSend(text), 80);
  }, [handleSend]);

  const handleSaveWord = useCallback((hanzi: string) => {
    const msg = messages.find(m => m.text === hanzi && m.sender === 'ai');
    addWord({ hanzi, pinyin: msg?.pinyin || '', meaning: msg?.translation || '', source: 'chat' });
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

  const handleOnboardingComplete = useCallback((data: { name: string; hskLevel: number; theme: ThemeId }) => {
    setUserName(data.name);
    setHskLevel(data.hskLevel);
    setTheme(data.theme);
    setItem('onboarded', true);
    setShowOnboarding(false);
  }, [setTheme]);

  const handleStartPractice = useCallback(() => {
    setActiveTab('chat');
    setIsSidebarOpen(false);
    setTimeout(() => handleSend('给我一个练习题'), 80);
  }, [handleSend]);

  const handleSaveDailyWord = useCallback((word: { hanzi: string; pinyin: string; meaning: string; example: string }) => {
    addWord({ hanzi: word.hanzi, pinyin: word.pinyin, meaning: word.meaning, example: word.example, source: 'daily' });
    showToast('Kata harian disimpan!', 'success');
  }, [addWord, showToast]);

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
          totalMessages={stats.totalMessages}
          dailyCount={stats.dailyMessageCount}
          xp={stats.xp}
          level={stats.level}
          vocabWords={words}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRemoveWord={removeWord}
          onStartPractice={handleStartPractice}
          onSaveDailyWord={handleSaveDailyWord}
          playAudio={playAudio}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content with tab navigation */}
        <div className="main-content">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="tab-content-area">
            {/* Chat tab — always mounted to preserve chat state */}
            <div style={{ display: activeTab === 'chat' ? 'contents' : 'none' }}>
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
                onShowCharacter={setSelectedChar}
              />
            </div>

            {/* Lessons tab */}
            {activeTab === 'lessons' && (
              <div className="tab-panel glass-panel">
                <LessonsView hskLevel={hskLevel} onSendToChat={handleSendToChat} />
              </div>
            )}

            {/* Flashcards tab */}
            {activeTab === 'flashcards' && (
              <div className="tab-panel glass-panel">
                <FlashcardView
                  vocabWords={words}
                  hskLevel={hskLevel}
                  onSendToChat={handleSendToChat}
                />
              </div>
            )}

            {/* Progress tab */}
            {activeTab === 'progress' && (
              <div className="tab-panel glass-panel">
                <ProgressDashboard
                  stats={stats}
                  accuracy={accuracy}
                  words={words}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        userAvatar={userAvatar}
        theme={theme}
        hskLevel={hskLevel}
        onSave={handleSettingsSave}
        onResetStats={() => { resetStats(); showToast('Statistik direset', 'info'); }}
        onResetChat={handleClearChat}
      />

      <CharacterModal
        character={selectedChar}
        onClose={() => setSelectedChar(null)}
      />

      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
    </>
  );
}

export default App;
