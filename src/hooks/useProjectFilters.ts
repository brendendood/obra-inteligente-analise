/**
 * Project Filters Hook
 * Gerencia filtros, busca e ordenação de projetos
 */

import { useState, useEffect, useMemo } from 'react';
import { Project } from '@/types/project';

export type ProjectSortBy = 'name' | 'date' | 'area';

interface UseProjectFiltersOptions {
  projects: Project[];
}

export const useProjectFilters = ({ projects }: UseProjectFiltersOptions) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<ProjectSortBy>('date');

  // Filtrar e ordenar projetos
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.project_type && project.project_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'area':
          return (b.total_area || 0) - (a.total_area || 0);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [projects, searchTerm, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredProjects,
  };
};
