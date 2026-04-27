// ============================================================
// ChatInput — Message input area with mic and send buttons
// ============================================================

import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: Props) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter to send
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend(input.trim());
        setInput('');
      }
    }
  };

  return (
    <div className="chat-input-area">
      <form onSubmit={handleSubmit} className="input-wrapper">
        <button
          type="button"
          className={`btn-icon ${isRecording ? 'recording' : ''}`}
          onClick={() => setIsRecording(!isRecording)}
          disabled={isLoading}
          title="Rekam Suara"
        >
          <Mic size={20} />
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Ketik dalam Pinyin, Indonesia, atau Hanzi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          id="chat-input-field"
        />
        <button
          type="submit"
          className="btn-icon btn-send"
          disabled={!input.trim() || isLoading}
          title="Kirim (Ctrl+Enter)"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
