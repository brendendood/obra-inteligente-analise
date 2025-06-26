
import { useState, useEffect, useCallback } from 'react';
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

  // Calcular estatísticas sempre que os projetos mudarem
  const calculateStats = useCallback(() => {
    if (!projects || projects.length === 0) {
      setStats({
        totalProjects: 0,
        totalArea: 0,
        recentProjects: 0,
        processedProjects: 0,
        monthlyProjects: 0,
        averageArea: 0,
        projectsByType: {}
      });
      return;
    }

    console.log('📊 DASHBOARD: Calculando estatísticas para', projects.length, 'projetos');

    const totalArea = projects.reduce((sum, project) => {
      return sum + (project.total_area || 0);
    }, 0);

    const processedProjects = projects.filter(project => 
      project.analysis_data && Object.keys(project.analysis_data).length > 0
    ).length;

    const recentProjects = projects.filter(project => {
      const createdAt = new Date(project.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt >= weekAgo;
    }).length;

    const monthlyProjects = projects.filter(project => {
      const createdAt = new Date(project.created_at);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return createdAt >= monthAgo;
    }).length;

    const averageArea = projects.length > 0 ? Math.round(totalArea / projects.length) : 0;

    const projectsByType = projects.reduce((acc, project) => {
      const type = project.project_type || 'Não definido';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const newStats = {
      totalProjects: projects.length,
      totalArea,
      recentProjects,
      processedProjects,
      monthlyProjects,
      averageArea,
      projectsByType
    };

    console.log('✅ DASHBOARD: Estatísticas atualizadas:', newStats);
    setStats(newStats);
  }, [projects]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return {
    projects,
    stats,
    isLoadingProjects,
    forceRefresh
  };
};
