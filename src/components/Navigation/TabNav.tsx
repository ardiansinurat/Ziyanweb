// ============================================================
// TabNav — Bottom/top tab navigation bar
// ============================================================

import { MessageSquare, BookOpen, CreditCard, BarChart2 } from 'lucide-react';

export type Tab = 'chat' | 'lessons' | 'flashcards' | 'progress';

interface TabItem {
  id: Tab;
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
}

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: TabItem[] = [
  { id: 'chat',       icon: MessageSquare, label: 'Chat'     },
  { id: 'lessons',    icon: BookOpen,      label: 'Belajar'  },
  { id: 'flashcards', icon: CreditCard,    label: 'Kartu'    },
  { id: 'progress',   icon: BarChart2,     label: 'Progress' },
];

export function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <div className="tab-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
        >
          <tab.icon size={20} />
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
