// ============================================================
// LocalStorage utility helpers
// ============================================================

const PREFIX = 'ziyan_';

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to write to localStorage:', e);
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

// Legacy migration — move old keys to new namespaced keys
export function migrateLegacyStorage(): void {
  const legacyMap: Record<string, string> = {
    chat_history: 'current_messages',
    user_name: 'profile_name',
    user_avatar: 'profile_avatar',
    user_theme: 'profile_theme',
  };

  for (const [oldKey, newKey] of Object.entries(legacyMap)) {
    const val = localStorage.getItem(oldKey);
    if (val !== null && localStorage.getItem(PREFIX + newKey) === null) {
      localStorage.setItem(PREFIX + newKey, val);
      localStorage.removeItem(oldKey);
    }
  }
}
