'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className={compact ? 'icon-button icon-button--compact' : 'icon-button'}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
