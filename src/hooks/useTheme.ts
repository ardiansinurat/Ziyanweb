// ============================================================
// useTheme — Theme management hook
// ============================================================

import { useState, useEffect } from 'react';
import type { ThemeId } from '../types';
import { getItem, setItem } from '../utils/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(
    () => getItem<ThemeId>('profile_theme', 'light-pastel')
  );

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    setItem('profile_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
  };

  const isDark = theme.startsWith('dark-');

  return { theme, setTheme, isDark };
}
