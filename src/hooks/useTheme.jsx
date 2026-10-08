import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#090D17' : '#F8FAFC');
  }, [theme]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystem = () => {
      try {
        if (!localStorage.getItem('portfolio-theme')) setTheme(media.matches ? 'dark' : 'light');
      } catch {
        setTheme(media.matches ? 'dark' : 'light');
      }
    };
    const syncStorage = (event) => {
      if (event.key === 'portfolio-theme')
        setTheme(
          event.newValue === 'dark' || event.newValue === 'light'
            ? event.newValue
            : media.matches
              ? 'dark'
              : 'light',
        );
    };
    media.addEventListener('change', syncSystem);
    window.addEventListener('storage', syncStorage);
    return () => {
      media.removeEventListener('change', syncSystem);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);
  function toggleTheme() {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('portfolio-theme', next);
      } catch {
        /* Theme still works without storage. */
      }
      return next;
    });
  }
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
