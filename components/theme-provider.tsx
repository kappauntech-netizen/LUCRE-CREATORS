'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    (onChange) => {
      window.addEventListener('lucre-theme-change', onChange);
      return () => window.removeEventListener('lucre-theme-change', onChange);
    },
    (): Theme => {
      const saved = window.localStorage.getItem('lucre-creators-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    (): Theme => 'dark',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('lucre-creators-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('lucre-creators-theme', next);
    window.dispatchEvent(new Event('lucre-theme-change'));
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  return context;
}
