// ============================================================
// ChatInput — Message input area with mic and send buttons
// ============================================================

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

// Web Speech API types
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function ChatInput({ onSend, isLoading }: Props) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [listenLabel, setListenLabel] = useState('');
  const recognitionRef = useRef<any>(null);
  const dotTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows/shrinks
  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  // Animate "Dengarkan..." dots while recording
  useEffect(() => {
    if (isRecording) {
      let count = 0;
      const dots = ['Dengarkan.', 'Dengarkan..', 'Dengarkan...'];
      setListenLabel(dots[0]);
      dotTimerRef.current = setInterval(() => {
        count = (count + 1) % dots.length;
        setListenLabel(dots[count]);
      }, 500);
    } else {
      setListenLabel('');
      if (dotTimerRef.current) {
        clearInterval(dotTimerRef.current);
        dotTimerRef.current = null;
      }
    }
    return () => {
      if (dotTimerRef.current) clearInterval(dotTimerRef.current);
    };
  }, [isRecording]);

  const handleMic = () => {
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung pengenalan suara.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + transcript : transcript));
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const doSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSend();
  };

  // Enter sends; Shift+Enter inserts a newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  };

  const charCount = input.length;
  const showCounter = charCount > 20;

  return (
    <div className="chat-input-area">
      {isRecording && (
        <div className="chat-listen-label" style={{
          fontSize: '12px',
          color: 'var(--primary)',
          padding: '2px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'inline-block',
            animation: 'pulse 0.8s ease-in-out infinite',
          }} />
          {listenLabel}
        </div>
      )}
      <form onSubmit={handleSubmit} className="input-wrapper" style={{ position: 'relative', alignItems: 'flex-end' }}>
        <button
          type="button"
          className={`btn-icon ${isRecording ? 'recording' : ''}`}
          onClick={handleMic}
          disabled={isLoading}
          title={isRecording ? 'Berhenti merekam' : 'Rekam Suara (Mandarin)'}
          style={isRecording ? { color: 'var(--primary)', animation: 'pulse 0.8s ease-in-out infinite' } : {}}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <textarea
          ref={textareaRef}
          className={`chat-input chat-textarea${isLoading ? ' chat-input-loading' : ''}`}
          placeholder={isRecording ? '' : 'Ketik dalam Pinyin, Indonesia, atau Hanzi... (Enter kirim, Shift+Enter baris baru)'}
          value={isRecording ? listenLabel : input}
          onChange={(e) => { if (!isRecording) setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isRecording}
          id="chat-input-field"
          rows={1}
          style={{
            resize: 'none',
            overflow: 'hidden',
            ...(isLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
          }}
        />
        {showCounter && !isRecording && (
          <span style={{
            position: 'absolute',
            right: '52px',
            bottom: '12px',
            fontSize: '11px',
            color: charCount > 200 ? 'var(--warning)' : 'var(--text-muted)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {charCount}
          </span>
        )}
        <button
          type="submit"
          className="btn-icon btn-send"
          disabled={!input.trim() || isLoading || isRecording}
          title="Kirim (Enter)"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
