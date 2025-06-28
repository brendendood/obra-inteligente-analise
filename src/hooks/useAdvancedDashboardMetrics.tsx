
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
    console.log('📊 METRICS: Recalculando métricas do dashboard com', projects.length, 'projetos');
    
    // Recalcular custo médio por m² (exclui projetos deletados)
    const avgCostPerSqm = calculateAvgCostPerSqm(projects);
    
    // Recalcular duração média da obra (exclui projetos deletados)
    const avgProjectDuration = calculateAvgProjectDuration(projects);
    
    // Recalcular nível de risco agregado (baseado apenas em projetos ativos)
    const riskLevel = calculateRiskLevel(projects);
    
    // Recalcular produtividade mensal (apenas projetos existentes)
    const monthlyProductivity = calculateMonthlyProductivity(projects);

    console.log('✅ METRICS: Métricas recalculadas:', {
      projetos: projects.length,
      custoMedio: avgCostPerSqm,
      duracaoMedia: avgProjectDuration,
      nivelRisco: riskLevel
    });

    return {
      avgCostPerSqm,
      avgProjectDuration,
      riskLevel,
      monthlyProductivity
    };
  }, [projects]); // Dependência direta dos projetos para recálculo automático
};

const calculateAvgCostPerSqm = (projects: Project[]): number | null => {
  const projectsWithBudget = projects.filter(project => 
    project.analysis_data && 
    project.analysis_data.budget && 
    project.analysis_data.budget.total_cost &&
    project.total_area && 
    project.total_area > 0
  );

  if (projectsWithBudget.length === 0) {
    console.log('💰 METRICS: Nenhum projeto com orçamento válido para cálculo de custo/m²');
    return null;
  }

  const totalCostPerSqm = projectsWithBudget.reduce((sum, project) => {
    const totalCost = project.analysis_data.budget.total_cost;
    const area = project.total_area;
    return sum + (totalCost / area);
  }, 0);

  const result = Math.round(totalCostPerSqm / projectsWithBudget.length);
  console.log('💰 METRICS: Custo médio por m² recalculado:', result, 'com', projectsWithBudget.length, 'projetos');
  return result;
};

const calculateAvgProjectDuration = (projects: Project[]): number | null => {
  const projectsWithSchedule = projects.filter(project => 
    project.analysis_data && 
    project.analysis_data.schedule && 
    project.analysis_data.schedule.total_duration
  );

  if (projectsWithSchedule.length === 0) {
    console.log('⏱️ METRICS: Nenhum projeto com cronograma válido para cálculo de duração');
    return null;
  }

  const totalDuration = projectsWithSchedule.reduce((sum, project) => {
    return sum + project.analysis_data.schedule.total_duration;
  }, 0);

  const result = Math.round(totalDuration / projectsWithSchedule.length);
  console.log('⏱️ METRICS: Duração média recalculada:', result, 'dias com', projectsWithSchedule.length, 'projetos');
  return result;
};

const calculateRiskLevel = (projects: Project[]): 'Baixo' | 'Médio' | 'Alto' => {
  if (projects.length === 0) {
    console.log('⚠️ METRICS: Nenhum projeto para análise de risco - definindo como Baixo');
    return 'Baixo';
  }

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
  
  let level: 'Baixo' | 'Médio' | 'Alto' = 'Baixo';
  if (riskPercentage >= 60) level = 'Alto';
  else if (riskPercentage >= 30) level = 'Médio';
  
  console.log('⚠️ METRICS: Nível de risco recalculado:', level, 'com score', riskScore, 'para', projects.length, 'projetos');
  return level;
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
  
  console.log('📈 METRICS: Produtividade mensal recalculada para últimos 6 meses');
  return last6Months;
};
