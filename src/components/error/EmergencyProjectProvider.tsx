import React from 'react';

interface Project {
  id: string;
  name: string;
  status: string;
  area?: number;
  created_at: string;
}

interface ProjectContextType {
  currentProject: Project | null;
  isLoading: boolean;
  uploadProject: () => Promise<any>;
  setCurrentProject: (project: Project | null) => void;
  loadUserProjects: () => Project[];
  clearAllProjects: () => void;
  requiresAuth: boolean;
}

// Emergency project state using localStorage only
const getEmergencyProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem('emergency_projects');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Emergency projects read failed:', error);
    return [];
  }
};

const getEmergencyCurrentProject = (): Project | null => {
  try {
    const stored = localStorage.getItem('emergency_current_project');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Emergency current project read failed:', error);
    return null;
  }
};

export const EmergencyProjectContext = React.createContext<ProjectContextType>({
  currentProject: null,
  isLoading: false,
  uploadProject: async () => ({}),
  setCurrentProject: () => {},
  loadUserProjects: () => [],
  clearAllProjects: () => {},
  requiresAuth: false,
});

interface EmergencyProjectProviderProps {
  children: React.ReactNode;
}

export const EmergencyProjectProvider: React.FC<EmergencyProjectProviderProps> = ({ children }) => {
  const [currentProject, setCurrentProjectState] = React.useState<Project | null>(getEmergencyCurrentProject());
  const [isLoading] = React.useState(false);

  const setCurrentProject = React.useCallback((project: Project | null) => {
    setCurrentProjectState(project);
    try {
      if (project) {
        localStorage.setItem('emergency_current_project', JSON.stringify(project));
      } else {
        localStorage.removeItem('emergency_current_project');
      }
    } catch (error) {
      console.warn('Emergency current project save failed:', error);
    }
  }, []);

  const loadUserProjects = React.useCallback(() => {
    return getEmergencyProjects();
  }, []);

  const clearAllProjects = React.useCallback(() => {
    setCurrentProjectState(null);
    try {
      localStorage.removeItem('emergency_projects');
      localStorage.removeItem('emergency_current_project');
    } catch (error) {
      console.warn('Emergency projects clear failed:', error);
    }
  }, []);

  const uploadProject = React.useCallback(async () => {
    console.log('🚨 EMERGENCY: Upload disabled in emergency mode');
    return {};
  }, []);

  const contextValue = React.useMemo(() => ({
    currentProject,
    isLoading,
    uploadProject,
    setCurrentProject,
    loadUserProjects,
    clearAllProjects,
    requiresAuth: false,
  }), [currentProject, isLoading, uploadProject, setCurrentProject, loadUserProjects, clearAllProjects]);

  return (
    <EmergencyProjectContext.Provider value={contextValue}>
      {children}
    </EmergencyProjectContext.Provider>
  );
};