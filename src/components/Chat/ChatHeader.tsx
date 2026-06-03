// ============================================================
// ChatHeader — Top bar of the chat panel
// ============================================================

import { Eye, EyeOff, Trash2, Menu, Download, Search } from 'lucide-react';

interface Props {
  showTranslations: boolean;
  onToggleTranslations: () => void;
  onClearChat: () => void;
  onToggleSidebar?: () => void;
  onExportChat?: () => void;
  onToggleSearch?: () => void;
  searchActive?: boolean;
}

export function ChatHeader({ showTranslations, onToggleTranslations, onClearChat, onToggleSidebar, onExportChat, onToggleSearch, searchActive }: Props) {
  return (
    <div className="chat-header">
      <div className="tutor-info">
        {onToggleSidebar && (
          <button className="btn-icon sidebar-toggle" onClick={onToggleSidebar} title="Menu">
            <Menu size={20} />
          </button>
        )}
        <div className="tutor-avatar-wrapper">
          <img src="https://i.pravatar.cc/150?img=32" alt="Ziyan Tutor" className="tutor-avatar" />
          <span className="status-dot" />
        </div>
        <div className="tutor-details">
          <h2>紫燕 Ziyan</h2>
          <p>Native Speaker • Online</p>
        </div>
      </div>
      <div className="header-actions">
        <button
          className="btn-icon"
          onClick={onToggleTranslations}
          title={showTranslations ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan'}
        >
          {showTranslations ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
        {onExportChat && (
          <button
            className="btn-icon"
            onClick={onExportChat}
            title="Ekspor Percakapan"
          >
            <Download size={20} />
          </button>
        )}
        <button
          className="btn-icon"
          onClick={onToggleSearch}
          title="Cari Pesan"
          style={searchActive ? { color: 'var(--primary)' } : undefined}
        >
          <Search size={20} />
        </button>
        <button
          className="btn-icon"
          onClick={onClearChat}
          title="Percakapan Baru"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
