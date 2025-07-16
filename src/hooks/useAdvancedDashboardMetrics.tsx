
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

    // MÉTRICAS DE PROJETOS - Dados Objetivos
    const totalArea = projects.reduce((sum, project) => {
      return sum + (project.total_area || 0);
    }, 0);

    const avgCostPerProject = projects.length > 0 && totalInvestment > 0
      ? Math.round(totalInvestment / projects.length)
      : null;

    // STATUS DOS PROJETOS
    const lastSubmissionDate = projects.length > 0 
      ? projects.reduce((latest, project) => {
          const projectDate = new Date(project.created_at);
          return projectDate > latest ? projectDate : latest;
        }, new Date(projects[0].created_at)).toISOString()
      : null;

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
      projectMetrics: {
        totalArea: Math.round(totalArea),
        avgCostPerProject,
        projectCount: projects.length
      },
      projectStatus: {
        projectsWithBudget: projectsWithBudget.length,
        lastSubmissionDate,
        totalProjects: projects.length
      },
      monthlyTrends
    };

    return result;
  }, [projects]);
};
