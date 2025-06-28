
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjectStore } from '@/stores/projectStore';

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
  const { user, isAuthenticated } = useAuth();
  const { projects, isLoading: isLoadingProjects, forceRefresh } = useProjectStore();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    processedProjects: 0,
    monthlyProjects: 0,
    averageArea: 0,
    projectsByType: {}
  });

  // Recalcular estatísticas SEMPRE que os projetos mudarem
  useEffect(() => {
    if (!projects) return;

    console.log('📊 DASHBOARD: Recalculando estatísticas para', projects.length, 'projetos');

    const totalArea = projects.reduce((sum: number, project: any) => {
      return sum + (project.total_area || 0);
    }, 0);

    const processedProjects = projects.filter((project: any) => 
      project.analysis_data && Object.keys(project.analysis_data).length > 0
    ).length;

    const recentProjects = projects.filter((project: any) => {
      const createdAt = new Date(project.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt >= weekAgo;
    }).length;

    const monthlyProjects = projects.filter((project: any) => {
      const createdAt = new Date(project.created_at);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return createdAt >= monthAgo;
    }).length;

    const averageArea = projects.length > 0 ? Math.round(totalArea / projects.length) : 0;

    const projectsByType = projects.reduce((acc: Record<string, number>, project: any) => {
      const type = project.project_type || 'Não definido';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const newStats = {
      totalProjects: projects.length,
      totalArea,
      recentProjects,
      processedProjects,
      monthlyProjects,
      averageArea,
      projectsByType
    };

    setStats(newStats);
    
    console.log('✅ DASHBOARD: Estatísticas recalculadas:', {
      total: newStats.totalProjects,
      processados: newStats.processedProjects,
      area: newStats.totalArea,
      tipos: Object.keys(newStats.projectsByType).length
    });
  }, [projects]);

  return {
    projects,
    stats,
    isLoadingProjects,
    forceRefresh
  };
};
