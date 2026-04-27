// ============================================================
// ProfileCard — User profile display in sidebar
// ============================================================

import { Settings } from 'lucide-react';

interface Props {
  name: string;
  avatar: string;
  hskLevel: number;
  onOpenSettings: () => void;
}

export function ProfileCard({ name, avatar, hskLevel, onOpenSettings }: Props) {
  return (
    <div className="profile-card">
      {avatar ? (
        <img src={avatar} alt="Profile" className="avatar" style={{ objectFit: 'cover' }} />
      ) : (
        <div className="avatar">{name.substring(0, 2).toUpperCase()}</div>
      )}
      <div className="profile-info" style={{ flex: 1 }}>
        <h2>{name}</h2>
        <p>HSK Level {hskLevel}</p>
      </div>
      <button className="btn-icon" onClick={onOpenSettings} title="Pengaturan">
        <Settings size={20} />
      </button>
    </div>
  );
}
