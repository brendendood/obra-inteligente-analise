
import { useMemo } from 'react';
import { Project } from '@/types/project';

interface AdvancedMetrics {
  avgCostPerSqm: number | null;
  avgProjectDuration: number | null;
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  monthlyProductivity: {
    month: string;
    started: number;
    completed: number;
  }[];
}

export const useAdvancedDashboardMetrics = (projects: Project[]): AdvancedMetrics => {
  return useMemo(() => {
    // Calcular custo médio por m²
    const avgCostPerSqm = calculateAvgCostPerSqm(projects);
    
    // Calcular duração média da obra
    const avgProjectDuration = calculateAvgProjectDuration(projects);
    
    // Calcular nível de risco agregado
    const riskLevel = calculateRiskLevel(projects);
    
    // Calcular produtividade mensal
    const monthlyProductivity = calculateMonthlyProductivity(projects);

    return {
      avgCostPerSqm,
      avgProjectDuration,
      riskLevel,
      monthlyProductivity
    };
  }, [projects]);
};

const calculateAvgCostPerSqm = (projects: Project[]): number | null => {
  const projectsWithBudget = projects.filter(project => 
    project.analysis_data && 
    project.analysis_data.budget && 
    project.analysis_data.budget.total_cost &&
    project.total_area && 
    project.total_area > 0
  );

  if (projectsWithBudget.length === 0) return null;

  const totalCostPerSqm = projectsWithBudget.reduce((sum, project) => {
    const totalCost = project.analysis_data.budget.total_cost;
    const area = project.total_area;
    return sum + (totalCost / area);
  }, 0);

  return Math.round(totalCostPerSqm / projectsWithBudget.length);
};

const calculateAvgProjectDuration = (projects: Project[]): number | null => {
  const projectsWithSchedule = projects.filter(project => 
    project.analysis_data && 
    project.analysis_data.schedule && 
    project.analysis_data.schedule.total_duration
  );

  if (projectsWithSchedule.length === 0) return null;

  const totalDuration = projectsWithSchedule.reduce((sum, project) => {
    return sum + project.analysis_data.schedule.total_duration;
  }, 0);

  return Math.round(totalDuration / projectsWithSchedule.length);
};

const calculateRiskLevel = (projects: Project[]): 'Baixo' | 'Médio' | 'Alto' => {
  if (projects.length === 0) return 'Baixo';

  let riskScore = 0;
  
  // Projetos não analisados há muito tempo (alto risco)
  const oldPendingProjects = projects.filter(project => {
    if (project.analysis_data) return false;
    const createdAt = new Date(project.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt < weekAgo;
  });
  
  riskScore += oldPendingProjects.length * 2;
  
  // Projetos com orçamento alto (médio risco)
  const highBudgetProjects = projects.filter(project => 
    project.analysis_data && 
    project.analysis_data.budget && 
    project.analysis_data.budget.total_cost > 500000
  );
  
  riskScore += highBudgetProjects.length * 1;
  
  // Projetos com cronograma apertado (alto risco)
  const tightScheduleProjects = projects.filter(project => 
    project.analysis_data && 
    project.analysis_data.schedule && 
    project.analysis_data.schedule.total_duration < 90
  );
  
  riskScore += tightScheduleProjects.length * 2;

  const riskPercentage = (riskScore / (projects.length * 2)) * 100;
  
  if (riskPercentage >= 60) return 'Alto';
  if (riskPercentage >= 30) return 'Médio';
  return 'Baixo';
};

const calculateMonthlyProductivity = (projects: Project[]) => {
  const last6Months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    
    const started = projects.filter(project => {
      const createdDate = new Date(project.created_at);
      return createdDate.getMonth() === date.getMonth() && 
             createdDate.getFullYear() === date.getFullYear();
    }).length;
    
    // Simular projetos finalizados baseado nos que têm análise completa
    const completed = projects.filter(project => {
      const createdDate = new Date(project.created_at);
      const isFromThisMonth = createdDate.getMonth() === date.getMonth() && 
                             createdDate.getFullYear() === date.getFullYear();
      return isFromThisMonth && project.analysis_data;
    }).length;
    
    last6Months.push({
      month: monthName,
      started,
      completed
    });
  }
  
  return last6Months;
};
