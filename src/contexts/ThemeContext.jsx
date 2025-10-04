import { createContext, useContext, useState, useEffect } from 'react';
import { THEME, STORAGE_KEYS } from '../utils/constants';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME.DARK;
    }

    return THEME.LIGHT;
  });

  useEffect(() => {
    // Apply theme class to html element
    const root = window.document.documentElement;
    root.classList.remove(THEME.LIGHT, THEME.DARK);
    root.classList.add(theme);

    // Store preference
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
