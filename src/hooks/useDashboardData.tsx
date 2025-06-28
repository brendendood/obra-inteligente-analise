
import { useState, useEffect, useRef } from 'react';
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
  const { projects, isLoading: isLoadingProjects } = useProjectStore();
  const mountedRef = useRef(true);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    processedProjects: 0,
    monthlyProjects: 0,
    averageArea: 0,
    projectsByType: {}
  });

  // Recalcula stats apenas quando projetos mudam (sem loops)
  useEffect(() => {
    if (!projects || !mountedRef.current) return;

    console.log('📊 DASHBOARD: Recalculando estatísticas para', projects.length, 'projetos');

    const totalArea = projects.reduce((sum: number, project: any) => {
      return sum + (project.total_area || 0);
    }, 0);

    const processedProjects = projects.filter((project: any) => 
      project.analysis_data && Object.keys(project.analysis_data).length > 0
    ).length;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentProjects = projects.filter((project: any) => {
      const createdAt = new Date(project.created_at);
      return createdAt >= weekAgo;
    }).length;

    const monthlyProjects = projects.filter((project: any) => {
      const createdAt = new Date(project.created_at);
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
    console.log('✅ DASHBOARD: Estatísticas recalculadas com sucesso');
  }, [projects]); // Depende apenas de projects

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    projects,
    stats,
    isLoadingProjects
  };
};
