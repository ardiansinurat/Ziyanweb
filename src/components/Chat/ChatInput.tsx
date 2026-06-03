// ============================================================
// ChatInput — Message input area with mic and send buttons
// ============================================================

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: Props) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [listenLabel, setListenLabel] = useState('');
  const recognitionRef = useRef<any>(null);
  const dotTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

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

  const toggleMic = useCallback(() => {
    if (!isSupported) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognitionCls =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCls();
    recognition.lang = 'zh-CN'; // Mandarin Chinese (primary)
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [isRecording, isSupported]);

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
        {isSupported && (
          <button
            type="button"
            className={`chat-mic-btn${isRecording ? ' recording' : ''}`}
            onClick={toggleMic}
            title={isRecording ? 'Hentikan rekaman' : 'Bicara dalam bahasa Mandarin'}
            disabled={isLoading}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
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
