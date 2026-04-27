// ============================================================
// MessageBubble — Individual chat message component
// ============================================================

import { Volume2, Info, Copy, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import type { Message } from '../../types';
import { useToast } from '../UI/Toast';

interface Props {
  message: Message;
  showTranslation: boolean;
  playAudio: (text: string) => void;
  isWordSaved?: (hanzi: string) => boolean;
  onSaveWord?: (hanzi: string) => void;
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes}m lalu`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function MessageBubble({ message, showTranslation, playAudio, isWordSaved, onSaveWord }: Props) {
  const { showToast } = useToast();
  const isAi = message.sender === 'ai';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      showToast('Teks disalin!', 'success');
    });
  };

  const handleSaveWord = () => {
    if (onSaveWord && message.text) {
      onSaveWord(message.text);
    }
  };

  return (
    <div className={`message ${message.sender}`}>
      <div className="message-bubble">
        {/* Pinyin line */}
        {isAi && message.pinyin && (
          <span className="pinyin">{message.pinyin}</span>
        )}

        {/* Main text */}
        <div className="text-content">
          <span>{message.text}</span>
          {isAi && (
            <div className="message-actions">
              <button
                className="msg-action-btn"
                onClick={() => playAudio(message.text)}
                title="Dengarkan"
              >
                <Volume2 size={14} />
              </button>
              <button
                className="msg-action-btn"
                onClick={handleCopy}
                title="Salin"
              >
                <Copy size={14} />
              </button>
              {onSaveWord && (
                <button
                  className={`msg-action-btn ${isWordSaved?.(message.text) ? 'saved' : ''}`}
                  onClick={handleSaveWord}
                  title={isWordSaved?.(message.text) ? 'Sudah disimpan' : 'Simpan ke kosakata'}
                >
                  {isWordSaved?.(message.text) ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Translation */}
        {isAi && message.translation && showTranslation && (
          <div className="translation">{message.translation}</div>
        )}

        {/* Correction */}
        {isAi && message.correction && (
          <div className="correction">
            <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{message.correction}</span>
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <span className="message-time">{formatTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
}
