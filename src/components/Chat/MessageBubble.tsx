// ============================================================
// MessageBubble — Individual chat message component
// ============================================================

import { useState } from 'react';
import { Volume2, AlertCircle, Lightbulb, Copy, BookmarkPlus, BookmarkCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Message } from '../../types';
import { useToast } from '../UI/Toast';
import { getItem, setItem } from '../../utils/storage';
import { ColorizePinyin } from '../../utils/toneColor';

interface Props {
  message: Message;
  showTranslation: boolean;
  playAudio: (text: string) => void;
  isWordSaved?: (hanzi: string) => boolean;
  onSaveWord?: (hanzi: string) => void;
  onShowCharacter?: (char: string) => void;
}

type Reaction = 'up' | 'down' | null;

const EMOJI_REACTIONS = ['👍', '💡', '⭐'] as const;

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes}m lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;

  // More than 1 day — show full date + time
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: diff > 365 * 24 * 3600 * 1000 ? 'numeric' : undefined,
  }) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function getStoredReactions(): Record<string, Reaction> {
  return getItem<Record<string, Reaction>>('msg_reactions', {});
}

export function MessageBubble({ message, showTranslation, playAudio, isWordSaved, onSaveWord, onShowCharacter }: Props) {
  const { showToast } = useToast();
  const isAi = message.sender === 'ai';

  const [reaction, setReaction] = useState<Reaction>(() => {
    if (!isAi || !message.id) return null;
    return getStoredReactions()[message.id] ?? null;
  });

  const [reactions, setReactions] = useState<Record<string, string[]>>(() =>
    getItem<Record<string, string[]>>('msg_reactions', {})
  );

  const toggleReaction = (msgId: string, emoji: string) => {
    setReactions(prev => {
      const existing = prev[msgId] ?? [];
      const next = existing.includes(emoji)
        ? existing.filter(e => e !== emoji)
        : [...existing, emoji];
      const updated = { ...prev, [msgId]: next };
      setItem('msg_reactions', updated);
      return updated;
    });
  };

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

  const handleReaction = (r: 'up' | 'down') => {
    if (!message.id) return;
    const next: Reaction = reaction === r ? null : r;
    setReaction(next);
    const stored = getStoredReactions();
    if (next === null) {
      delete stored[message.id];
    } else {
      stored[message.id] = next;
    }
    setItem('msg_reactions', stored);
  };

  return (
    <div className={`message ${message.sender}`} style={{ animation: 'slideIn 0.25s ease' }}>
      <div className="message-bubble">
        {/* Pinyin line */}
        {isAi && message.pinyin && (
          <span className="pinyin">
            <ColorizePinyin pinyin={message.pinyin} />
          </span>
        )}

        {/* Main text */}
        <div className="text-content">
          <span className="msg-text">
            {message.text.split('').map((char, i) => {
              const isHanzi = /[一-龥]/.test(char);
              return isHanzi ? (
                <span
                  key={i}
                  className="clickable-hanzi"
                  onClick={() => onShowCharacter?.(char)}
                  title="Lihat urutan guratan"
                >
                  {char}
                </span>
              ) : (
                <span key={i}>{char}</span>
              );
            })}
          </span>
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
              {/* Reaction buttons */}
              <button
                className={`msg-action-btn${reaction === 'up' ? ' saved' : ''}`}
                onClick={() => handleReaction('up')}
                title="Respons bagus"
                style={reaction === 'up' ? { color: 'var(--success)' } : {}}
              >
                <ThumbsUp size={14} />
              </button>
              <button
                className={`msg-action-btn${reaction === 'down' ? ' saved' : ''}`}
                onClick={() => handleReaction('down')}
                title="Respons kurang tepat"
                style={reaction === 'down' ? { color: 'var(--warning)' } : {}}
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Translation */}
        {isAi && message.translation && showTranslation && (
          <div className="translation">{message.translation}</div>
        )}

        {/* Correction — improved icon & color */}
        {isAi && message.correction && (
          <div className="correction" style={{ borderLeft: '3px solid var(--warning)', background: 'rgba(255,193,7,0.08)', borderRadius: '0 6px 6px 0', padding: '6px 10px', marginTop: '6px', gap: '6px' }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--warning)' }} />
            <span style={{ color: 'var(--text-main)' }}>{message.correction}</span>
          </div>
        )}

        {/* Learning tip */}
        {isAi && message.tip && (
          <div className="msg-tip">
            <Lightbulb size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{message.tip}</span>
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <span className="message-time">{formatTime(message.timestamp)}</span>
        )}
      </div>

      {/* Emoji reaction bar — AI messages only */}
      {isAi && (
        <div className="message-reactions">
          {EMOJI_REACTIONS.map(emoji => (
            <button
              key={emoji}
              className={`reaction-btn${(reactions[message.id] ?? []).includes(emoji) ? ' active' : ''}`}
              onClick={() => toggleReaction(message.id, emoji)}
              title={emoji === '👍' ? 'Berguna' : emoji === '💡' ? 'Menarik' : 'Favorit'}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
