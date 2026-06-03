// ============================================================
// ChatPanel — Main chat area orchestrator
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { Message } from '../../types';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { QuickPhrases } from './QuickPhrases';

// ---- Suggested Replies ----

function getSuggestions(msg: Message): string[] {
  const hasTip = !!(msg.tip && msg.tip.trim());
  const hasCorrection = !!(msg.correction && msg.correction.trim());

  const always = ['Beri saya contoh kalimat lain', 'Ajarkan kata baru'];
  const tips: string[] = [];

  if (hasCorrection) tips.push('Jelaskan lebih detail koreksinya');
  if (hasTip) tips.push('Jelaskan lebih lanjut tipsnya');
  if (!hasCorrection && !hasTip) tips.push('Koreksi kalimat saya');

  // Return 3 distinct suggestions
  return [...tips, ...always].slice(0, 3);
}

interface SuggestedRepliesProps {
  message: Message;
  onSelect: (text: string) => void;
  disabled: boolean;
}

function SuggestedReplies({ message, onSelect, disabled }: SuggestedRepliesProps) {
  const suggestions = getSuggestions(message);
  return (
    <div className="suggested-replies">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="suggested-reply-chip"
          onClick={() => onSelect(s)}
          disabled={disabled}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

interface Props {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSend: (text: string) => void;
  onClearChat: () => void;
  playAudio: (text: string) => void;
  isWordSaved: (hanzi: string) => boolean;
  onSaveWord: (hanzi: string) => void;
  onToggleSidebar?: () => void;
  onShowCharacter?: (char: string) => void;
}

export function ChatPanel({
  messages,
  isLoading,
  messagesEndRef,
  onSend,
  onClearChat,
  playAudio,
  isWordSaved,
  onSaveWord,
  onToggleSidebar,
  onShowCharacter,
}: Props) {
  const [showTranslations, setShowTranslations] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const hasMessages = messages.length > 1; // More than just greeting
  const lastAiMsg = [...messages].reverse().find(m => m.sender === 'ai');

  const filteredMessages = searchQuery
    ? messages.filter(msg =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.pinyin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.translation?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchActive(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExport = useCallback(() => {
    const lines = messages.map(m => {
      const who = m.sender === 'ai' ? 'Ziyan' : 'Kamu';
      const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
      let out = `[${time}] ${who}: ${m.text}`;
      if (m.pinyin) out += `\n  Pinyin: ${m.pinyin}`;
      if (m.translation) out += `\n  Terjemahan: ${m.translation}`;
      if (m.correction) out += `\n  Koreksi: ${m.correction}`;
      return out;
    });
    const content = `Percakapan dengan Ziyan\n${'='.repeat(40)}\n${new Date().toLocaleString('id-ID')}\n${'='.repeat(40)}\n\n${lines.join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ziyan-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  return (
    <div className="chat-section glass-panel">
      <ChatHeader
        showTranslations={showTranslations}
        onToggleTranslations={() => setShowTranslations(!showTranslations)}
        onClearChat={onClearChat}
        onToggleSidebar={onToggleSidebar}
        onExportChat={hasMessages ? handleExport : undefined}
        onToggleSearch={() => setSearchActive(prev => !prev)}
        searchActive={searchActive}
      />

      {searchActive && (
        <div className="chat-search-bar">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            className="chat-search-input"
            placeholder="Cari pesan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <span className="chat-search-count">
              {filteredMessages.length} hasil
            </span>
          )}
          <button className="btn-icon" onClick={() => { setSearchActive(false); setSearchQuery(''); }} style={{ padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="chat-messages">
        {!hasMessages && (
          <div className="empty-state">
            <div className="empty-state-emoji">🐉</div>
            <h3>你好！Selamat Datang!</h3>
            <p>Mulai percakapan dengan Ziyan untuk berlatih bahasa Mandarin.</p>
            <div className="empty-state-features">
              <div className="feature-hint">
                <span>📚</span>
                <span>Tab <strong>Belajar</strong> — Kurikulum HSK 1-3</span>
              </div>
              <div className="feature-hint">
                <span>🃏</span>
                <span>Tab <strong>Kartu</strong> — Hafal kosakata</span>
              </div>
              <div className="feature-hint">
                <span>📊</span>
                <span>Tab <strong>Progress</strong> — Pantau kemajuanmu</span>
              </div>
            </div>
          </div>
        )}

        {filteredMessages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showTranslation={showTranslations}
            playAudio={playAudio}
            isWordSaved={isWordSaved}
            onSaveWord={onSaveWord}
            onShowCharacter={onShowCharacter}
          />
        ))}

        {lastAiMsg && !isLoading && hasMessages && (
          <SuggestedReplies
            message={lastAiMsg}
            onSelect={onSend}
            disabled={isLoading}
          />
        )}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {!hasMessages && (
        <QuickPhrases onSelect={onSend} disabled={isLoading} />
      )}

      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}
