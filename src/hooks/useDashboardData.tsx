
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useProjectSync } from '@/hooks/useProjectSync';

interface DashboardStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  processedProjects: number;
  monthlyProjects: number;
  averageArea: number;
  projectsByType: Record<string, number>;
}

export const useDashboardData = () => {
  const { 
    projects, 
    isLoading: isLoadingProjects, 
    forceRefresh 
  } = useProjectSync();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    processedProjects: 0,
    monthlyProjects: 0,
    averageArea: 0,
    projectsByType: {}
  });

  // Memoizar cálculos pesados
  const calculatedStats = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        totalArea: 0,
        recentProjects: 0,
        processedProjects: 0,
        monthlyProjects: 0,
        averageArea: 0,
        projectsByType: {}
      };
    }

    console.log('📊 DASHBOARD: Calculando estatísticas para', projects.length, 'projetos');

    const totalArea = projects.reduce((sum, project) => {
      return sum + (project.total_area || 0);
    }, 0);

    const processedProjects = projects.filter(project => 
      project.analysis_data && Object.keys(project.analysis_data).length > 0
    ).length;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentProjects = projects.filter(project => {
      const createdAt = new Date(project.created_at);
      return createdAt >= weekAgo;
    }).length;

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const monthlyProjects = projects.filter(project => {
      const createdAt = new Date(project.created_at);
      return createdAt >= monthAgo;
    }).length;

    const averageArea = projects.length > 0 ? Math.round(totalArea / projects.length) : 0;

    const projectsByType = projects.reduce((acc, project) => {
      const type = project.project_type || 'Não definido';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProjects: projects.length,
      totalArea,
      recentProjects,
      processedProjects,
      monthlyProjects,
      averageArea,
      projectsByType
    };
  }, [projects]);

  // Atualizar stats apenas quando calculatedStats mudarem
  useEffect(() => {
    setStats(calculatedStats);
    console.log('✅ DASHBOARD: Estatísticas atualizadas:', calculatedStats);
  }, [calculatedStats]);

  return {
    projects,
    stats,
    isLoadingProjects,
    forceRefresh
  };
};
