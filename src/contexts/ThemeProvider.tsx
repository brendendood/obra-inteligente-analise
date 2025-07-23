
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreferences } = useUserPreferences();
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  const getSystemTheme = (): 'light' | 'dark' => {
    const hour = new Date().getHours();
    // Sistema: 6h-18h = light, 18h-6h = dark
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  };

  const calculateActualTheme = (themePreference: Theme): 'light' | 'dark' => {
    if (themePreference === 'system') {
      return getSystemTheme();
    }
    return themePreference;
  };

  useEffect(() => {
    const theme = preferences.theme;
    const newActualTheme = calculateActualTheme(theme);
    setActualTheme(newActualTheme);
    
    // Aplicar tema no document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newActualTheme);
  }, [preferences.theme]);

  // Atualizar tema sistema a cada minuto
  useEffect(() => {
    if (preferences.theme === 'system') {
      const interval = setInterval(() => {
        const newSystemTheme = getSystemTheme();
        if (newSystemTheme !== actualTheme) {
          setActualTheme(newSystemTheme);
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(newSystemTheme);
        }
      }, 60000); // Verificar a cada minuto

      return () => clearInterval(interval);
    }
  }, [preferences.theme, actualTheme]);

  const setTheme = (theme: Theme) => {
    updatePreferences({ theme });
  };

  const value = {
    theme: preferences.theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
