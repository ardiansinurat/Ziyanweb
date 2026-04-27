// ============================================================
// TypingIndicator — Animated three-dot indicator
// ============================================================

export function TypingIndicator() {
  return (
    <div className="message ai">
      <div className="message-bubble typing-indicator-bubble">
        <div className="typing-indicator">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
        <span className="typing-label">Ziyan sedang mengetik...</span>
      </div>
    </div>
  );
}
