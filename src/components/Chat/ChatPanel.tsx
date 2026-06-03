// ============================================================
// ChatPanel — Main chat area orchestrator
// ============================================================

import { useState } from 'react';
import type { Message } from '../../types';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { QuickPhrases } from './QuickPhrases';

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

  const hasMessages = messages.length > 1; // More than just greeting

  return (
    <div className="chat-section glass-panel">
      <ChatHeader
        showTranslations={showTranslations}
        onToggleTranslations={() => setShowTranslations(!showTranslations)}
        onClearChat={onClearChat}
        onToggleSidebar={onToggleSidebar}
      />

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

        {messages.map(msg => (
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
