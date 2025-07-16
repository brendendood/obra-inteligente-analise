
import { useMemo } from 'react';
import { Project } from '@/types/project';

export const useAdvancedDashboardMetrics = (projects: Project[]) => {
  return useMemo(() => {

    // MÉTRICAS FINANCEIRAS - Dados Persistidos
    const projectsWithBudget = projects.filter(p => {
      const hasBudgetData = (p.analysis_data as any)?.budget_data?.total_com_bdi && 
                           (p.analysis_data as any).budget_data.total_com_bdi > 0;
      return hasBudgetData;
    });

    const totalInvestment = projectsWithBudget.reduce((sum, project) => {
      const cost = (project.analysis_data as any)?.budget_data?.total_com_bdi || 0;
      return sum + cost;
    }, 0);

    const avgCostPerSqm = projectsWithBudget.length > 0 
      ? projectsWithBudget.reduce((sum, project) => {
          const totalCost = (project.analysis_data as any)?.budget_data?.total_com_bdi || 0;
          const area = project.total_area || 100;
          const costPerSqm = totalCost / area;
          return sum + costPerSqm;
        }, 0) / projectsWithBudget.length
      : null;

    const budgetCosts = projectsWithBudget.map(p => (p.analysis_data as any).budget_data.total_com_bdi);
    const highestCostProject = budgetCosts.length > 0 
      ? projectsWithBudget[budgetCosts.indexOf(Math.max(...budgetCosts))]
      : null;
    const lowestCostProject = budgetCosts.length > 0 
      ? projectsWithBudget[budgetCosts.indexOf(Math.min(...budgetCosts))]
      : null;

    // MÉTRICAS DE PERFORMANCE - Dados Persistidos
    const projectsWithSchedule = projects.filter(p => {
      const hasScheduleData = (p.analysis_data as any)?.schedule_data?.total_duration && 
                             (p.analysis_data as any).schedule_data.total_duration > 0;
      return hasScheduleData;
    });

    const avgProjectDuration = projectsWithSchedule.length > 0
      ? projectsWithSchedule.reduce((sum, project) => {
          const duration = (project.analysis_data as any).schedule_data.total_duration;
          return sum + duration;
        }, 0) / projectsWithSchedule.length
      : null;

    const processingEfficiency = projects.length > 0 
      ? (projectsWithBudget.length / projects.length) * 100 
      : 0;


    // MÉTRICAS DE QUALIDADE
    const completionRate = projects.length > 0 
      ? ((projectsWithBudget.length + projectsWithSchedule.length) / (projects.length * 2)) * 100
      : 0;

    const dataQualityScore = projects.length > 0
      ? (projects.filter(p => p.analysis_data && Object.keys(p.analysis_data).length > 0).length / projects.length) * 100
      : 0;

    // TENDÊNCIAS MENSAIS - CORRIGIDO para match com MonthlyProductivityChart
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthProjects = projects.filter(p => {
        const createdAt = new Date(p.created_at);
        return createdAt.getMonth() === date.getMonth() && 
               createdAt.getFullYear() === date.getFullYear();
      });

      const monthBudget = monthProjects.reduce((sum, p) => 
        sum + ((p.analysis_data as any)?.budget_data?.total_com_bdi || 0), 0
      );

      // Simulando completed baseado em projetos processados
      const completedProjects = monthProjects.filter(p => 
        (p.analysis_data as any)?.budget_data || (p.analysis_data as any)?.schedule_data
      ).length;

      return {
        month: monthName,
        started: monthProjects.length,
        completed: completedProjects,
        investment: Math.round(monthBudget) // Valor real, não dividido por 1000
      };
    });

    const result = {
      financial: {
        totalInvestment: Math.round(totalInvestment),
        avgCostPerSqm: avgCostPerSqm ? Math.round(avgCostPerSqm) : null
      },
      performance: {
        avgProcessingTime: 2.5, // Simulado
        processingEfficiency: Math.round(processingEfficiency),
        avgProjectDuration: avgProjectDuration ? Math.round(avgProjectDuration) : null
      },
      quality: {
        completionRate: Math.round(completionRate),
        dataQualityScore: Math.round(dataQualityScore),
        avgAccuracy: 92 // Simulado
      },
      monthlyTrends
    };

    return result;
  }, [projects]);
};
