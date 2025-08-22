import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Recuperar tema salvo ou usar 'system' como padrão
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remover classes anteriores
    root.classList.remove('dark-mode', 'system-mode');
    body.classList.remove('dark-mode', 'system-mode');

    if (theme === 'dark') {
      root.classList.add('dark-mode');
      body.classList.add('dark-mode');
    } else if (theme === 'system') {
      // Detectar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('system-mode', 'dark-mode');
        body.classList.add('system-mode', 'dark-mode');
      } else {
        root.classList.add('system-mode');
        body.classList.add('system-mode');
      }
    }
    
    // Salvar tema no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        const body = document.body;
        
        if (mediaQuery.matches) {
          root.classList.add('dark-mode');
          body.classList.add('dark-mode');
        } else {
          root.classList.remove('dark-mode');
          body.classList.remove('dark-mode');
        }
      }
    };

    if (theme === 'system') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return { theme, setTheme, toggleTheme };
};