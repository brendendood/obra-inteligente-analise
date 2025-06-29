
import { useMemo } from 'react';
import { Project } from '@/types/project';

export const useAdvancedDashboardMetrics = (projects: Project[]) => {
  return useMemo(() => {
    console.log('📊 ADVANCED METRICS: Calculando métricas para', projects.length, 'projetos');

    // MÉTRICAS FINANCEIRAS - Dados Persistidos
    const projectsWithBudget = projects.filter(p => 
      p.analysis_data?.budget_data?.total_cost && 
      p.analysis_data.budget_data.total_cost > 0
    );

    console.log('💰 Projetos com orçamento persistido:', projectsWithBudget.length);

    const totalInvestment = projectsWithBudget.reduce((sum, project) => {
      const cost = project.analysis_data?.budget_data?.total_cost || 0;
      return sum + cost;
    }, 0);

    const avgCostPerSqm = projectsWithBudget.length > 0 
      ? projectsWithBudget.reduce((sum, project) => {
          const unitCost = project.analysis_data?.budget_data?.unit_cost_per_sqm || 0;
          return sum + unitCost;
        }, 0) / projectsWithBudget.length
      : null;

    const budgetCosts = projectsWithBudget.map(p => p.analysis_data.budget_data.total_cost);
    const highestCostProject = budgetCosts.length > 0 
      ? projectsWithBudget[budgetCosts.indexOf(Math.max(...budgetCosts))]
      : null;
    const lowestCostProject = budgetCosts.length > 0 
      ? projectsWithBudget[budgetCosts.indexOf(Math.min(...budgetCosts))]
      : null;

    // MÉTRICAS DE PERFORMANCE - Dados Persistidos
    const projectsWithSchedule = projects.filter(p => 
      p.analysis_data?.schedule_data?.total_duration && 
      p.analysis_data.schedule_data.total_duration > 0
    );

    console.log('📅 Projetos com cronograma persistido:', projectsWithSchedule.length);

    const avgProjectDuration = projectsWithSchedule.length > 0
      ? projectsWithSchedule.reduce((sum, project) => {
          const duration = project.analysis_data.schedule_data.total_duration;
          return sum + duration;
        }, 0) / projectsWithSchedule.length
      : null;

    const processingEfficiency = projects.length > 0 
      ? (projectsWithBudget.length / projects.length) * 100 
      : 0;

    // ANÁLISE PREDITIVA
    const upcomingDeadlines = projectsWithSchedule.filter(p => {
      const endDate = p.analysis_data?.schedule_data?.end_date;
      if (!endDate) return false;
      const deadline = new Date(endDate);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 30;
    }).length;

    const budgetAlerts = projectsWithBudget.filter(p => {
      const cost = p.analysis_data.budget_data.total_cost;
      const area = p.total_area || 100;
      const costPerSqm = cost / area;
      return costPerSqm > 2000; // Alerta para custos acima de R$ 2000/m²
    }).length;

    const riskLevel = budgetAlerts > projects.length * 0.3 ? 'Alto' : 
                     budgetAlerts > projects.length * 0.1 ? 'Médio' : 'Baixo';

    // MÉTRICAS DE QUALIDADE
    const completionRate = projects.length > 0 
      ? ((projectsWithBudget.length + projectsWithSchedule.length) / (projects.length * 2)) * 100
      : 0;

    const dataQualityScore = projects.length > 0
      ? (projects.filter(p => p.analysis_data?.isRealProject).length / projects.length) * 100
      : 0;

    // TENDÊNCIAS MENSAIS
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
        sum + (p.analysis_data?.budget_data?.total_cost || 0), 0
      );

      return {
        name: monthName,
        projetos: monthProjects.length,
        investimento: Math.round(monthBudget / 1000), // Em milhares
        area: monthProjects.reduce((sum, p) => sum + (p.total_area || 0), 0)
      };
    });

    const result = {
      financial: {
        totalInvestment: Math.round(totalInvestment),
        avgCostPerSqm,
        costVariation: budgetCosts.length > 1 
          ? Math.round(((Math.max(...budgetCosts) - Math.min(...budgetCosts)) / Math.min(...budgetCosts)) * 100)
          : null,
        budgetEfficiency: processingEfficiency,
        highestCostProject: highestCostProject ? {
          name: highestCostProject.name,
          cost: highestCostProject.analysis_data.budget_data.total_cost
        } : null,
        lowestCostProject: lowestCostProject ? {
          name: lowestCostProject.name,
          cost: lowestCostProject.analysis_data.budget_data.total_cost
        } : null
      },
      performance: {
        avgProcessingTime: 2.5, // Simulado
        processingEfficiency: Math.round(processingEfficiency),
        avgProjectDuration,
        onTimeDeliveryRate: 85, // Simulado
        bottleneckPhase: projectsWithSchedule.length > 0 ? 'Instalações' : null
      },
      predictive: {
        riskLevel: riskLevel as 'Baixo' | 'Médio' | 'Alto',
        riskFactors: budgetAlerts > 0 ? ['Custos elevados', 'Prazos apertados'] : ['Baixo risco'],
        upcomingDeadlines,
        budgetAlerts,
        qualityScore: Math.round(dataQualityScore)
      },
      quality: {
        completionRate: Math.round(completionRate),
        dataQualityScore: Math.round(dataQualityScore),
        revisionRate: 15, // Simulado
        avgAccuracy: 92 // Simulado
      },
      monthlyTrends
    };

    console.log('✅ ADVANCED METRICS: Métricas calculadas:', {
      projectsTotal: projects.length,
      withBudget: projectsWithBudget.length,
      withSchedule: projectsWithSchedule.length,
      totalInvestment: result.financial.totalInvestment,
      avgDuration: result.performance.avgProjectDuration
    });

    return result;
  }, [projects]);
};
