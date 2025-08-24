
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserPreferences {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  projectViewMode: 'grid' | 'list';
  projectSortBy: 'name' | 'date' | 'area';
  recentProjects: string[];
  favoriteProjects: string[];
  dashboardLayout: string[];
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  sidebarCollapsed: false,
  projectViewMode: 'grid',
  projectSortBy: 'date',
  recentProjects: [],
  favoriteProjects: [],
  dashboardLayout: ['stats', 'recent-projects', 'quick-actions']
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const storageKey = user ? `user-preferences-${user.id}` : 'user-preferences-guest';

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
      }
    } catch (error) {
      console.warn('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(newPreferences));
    } catch (error) {
      console.warn('Erro ao salvar preferências:', error);
    }
  };

  const addRecentProject = (projectId: string) => {
    const recent = preferences.recentProjects.filter(id => id !== projectId);
    recent.unshift(projectId);
    updatePreferences({ 
      recentProjects: recent.slice(0, 10) // Manter apenas os 10 mais recentes
    });
  };

  const toggleFavoriteProject = (projectId: string) => {
    const favorites = preferences.favoriteProjects.includes(projectId)
      ? preferences.favoriteProjects.filter(id => id !== projectId)
      : [...preferences.favoriteProjects, projectId];
    
    updatePreferences({ favoriteProjects: favorites });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Erro ao resetar preferências:', error);
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    addRecentProject,
    toggleFavoriteProject,
    resetPreferences
  };
};
