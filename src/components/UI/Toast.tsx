// ============================================================
// Toast — Notification system
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => React.useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToasts(prev => {
      // Deduplicate: skip if same message exists already
      if (prev.some(t => t.message === message)) return prev;
      const id = Date.now().toString();
      const duration = message.includes('Level Up') || message.includes('Pencapaian') ? 5000 : 3000;
      const next = [...prev, { id, message, type, duration }];
      // Keep only the last 4 toasts
      return next.slice(-4);
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: <Check size={16} />,
    error: <AlertCircle size={16} />,
    info: <Info size={16} />,
    warning: <AlertCircle size={16} />,
  };

  return (
    <div className={`toast toast-${toast.type}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>
        <X size={14} />
      </button>
      <div className="toast-progress">
        <div
          className="toast-progress-bar"
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      </div>
    </div>
  );
}
