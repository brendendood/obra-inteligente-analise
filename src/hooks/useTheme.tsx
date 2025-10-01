import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  // Inicialização síncrona do tema para evitar flash
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme') as Theme;
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remover classes anteriores
    root.classList.remove('dark');

    if (theme === 'dark') {
      root.classList.add('dark');
    }
    
    // Salvar tema no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return { theme, setTheme, toggleTheme };
};