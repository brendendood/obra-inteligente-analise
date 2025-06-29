
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
  // NOVOS CAMPOS BASEADOS EM DADOS PERSISTIDOS
  totalInvestment: number;
  projectsWithBudget: number;
  projectsWithSchedule: number;
  avgCostPerSqm: number | null;
  avgProjectDuration: number | null;
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
    projectsByType: {},
    totalInvestment: 0,
    projectsWithBudget: 0,
    projectsWithSchedule: 0,
    avgCostPerSqm: null,
    avgProjectDuration: null
  });

  // Recalcula stats com dados persistidos
  useEffect(() => {
    if (!projects || !mountedRef.current) return;

    console.log('📊 DASHBOARD: Recalculando estatísticas COMPLETAS para', projects.length, 'projetos');

    // Stats básicas
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

    // NOVAS MÉTRICAS BASEADAS EM DADOS PERSISTIDOS - CORRIGIDO
    const projectsWithBudget = projects.filter((project: any) => 
      project.analysis_data?.budget_data?.total_com_bdi && 
      project.analysis_data.budget_data.total_com_bdi > 0
    );

    const projectsWithSchedule = projects.filter((project: any) => 
      project.analysis_data?.schedule_data?.total_duration && 
      project.analysis_data.schedule_data.total_duration > 0
    );

    const totalInvestment = projectsWithBudget.reduce((sum: number, project: any) => {
      return sum + (project.analysis_data.budget_data.total_com_bdi || 0);
    }, 0);

    const avgCostPerSqm = projectsWithBudget.length > 0 
      ? projectsWithBudget.reduce((sum: number, project: any) => {
          const totalCost = project.analysis_data.budget_data.total_com_bdi || 0;
          const area = project.total_area || 100;
          return sum + (totalCost / area);
        }, 0) / projectsWithBudget.length
      : null;

    const avgProjectDuration = projectsWithSchedule.length > 0
      ? projectsWithSchedule.reduce((sum: number, project: any) => {
          return sum + (project.analysis_data.schedule_data.total_duration || 0);
        }, 0) / projectsWithSchedule.length
      : null;

    const newStats = {
      totalProjects: projects.length,
      totalArea,
      recentProjects,
      processedProjects,
      monthlyProjects,
      averageArea,
      projectsByType,
      totalInvestment: Math.round(totalInvestment),
      projectsWithBudget: projectsWithBudget.length,
      projectsWithSchedule: projectsWithSchedule.length,
      avgCostPerSqm: avgCostPerSqm ? Math.round(avgCostPerSqm) : null,
      avgProjectDuration: avgProjectDuration ? Math.round(avgProjectDuration) : null
    };

    setStats(newStats);
    
    console.log('✅ DASHBOARD: Estatísticas COMPLETAS recalculadas:', {
      projetos: newStats.totalProjects,
      comOrcamento: newStats.projectsWithBudget,
      comCronograma: newStats.projectsWithSchedule,
      investimentoTotal: newStats.totalInvestment,
      custoMedioM2: newStats.avgCostPerSqm,
      duracaoMedia: newStats.avgProjectDuration
    });
  }, [projects]);

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
