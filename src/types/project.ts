
export interface Project {
  id: string;
  user_id: string; // Adicionando user_id que estava faltando
  name: string;
  file_path: string;
  file_size?: number;
  extracted_text?: string;
  analysis_data?: any;
  project_type?: string;
  total_area?: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectContextType {
  currentProject: Project | null;
  isLoading: boolean;
  uploadProject: (file: File, projectName: string) => Promise<boolean>;
  setCurrentProject: (project: Project | null) => void;
  loadUserProjects: () => Promise<Project[]>;
  clearAllProjects: () => void;
  requiresAuth: boolean;
}

export interface ScheduleTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  cost: number;
  status: 'planned' | 'in_progress' | 'completed';
  category: string;
  color: string;
  dependencies: string[];
  assignee?: {
    name: string;
    email: string;
  };
}

export interface ScheduleData {
  projectId: string;
  projectName: string;
  totalArea: number;
  totalDuration: number;
  totalCost: number;
  tasks: ScheduleTask[];
  criticalPath: string[];
}
