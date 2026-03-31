'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: MouseEvent) => void;
  isDark: boolean;
  isLight: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const saved = getStoredTheme();
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures (private mode / blocked storage).
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  const toggleTheme = useCallback((e?: MouseEvent) => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? 0;
    const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    document.documentElement.style.setProperty('--theme-toggle-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-toggle-y', `${y}px`);
    document.documentElement.style.setProperty('--theme-toggle-radius', `${maxRadius}px`);

    const supportsTransition = typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === 'function';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (supportsTransition && !reducedMotion) {
      const transition = (document as Document & {
        startViewTransition: (callback: () => void) => ViewTransition;
      }).startViewTransition(() => {
        setTheme(newTheme);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            [
              { clipPath: `circle(0px at ${x}px ${y}px)` },
              { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` },
            ],
            {
              duration: 500,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // Theme already applied even if animation fails.
        });
      return;
    }

    setTheme(newTheme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
      mounted,
    }),
    [mounted, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
