
import { useMemo } from 'react';
import { Project } from '@/types/project';

export const useAdvancedDashboardMetrics = (projects: Project[]) => {
  return useMemo(() => {
    console.log('📊 ADVANCED METRICS: Calculando métricas para', projects.length, 'projetos');
    console.log('📊 ADVANCED METRICS: Projetos recebidos:', projects.map(p => ({ 
      name: p.name, 
      hasAnalysis: !!p.analysis_data,
      hasBudget: !!p.analysis_data?.budget_data,
      hasSchedule: !!p.analysis_data?.schedule_data
    })));

    // MÉTRICAS FINANCEIRAS - Dados Persistidos
    const projectsWithBudget = projects.filter(p => {
      const hasBudgetData = p.analysis_data?.budget_data?.total_com_bdi && 
                           p.analysis_data.budget_data.total_com_bdi > 0;
      console.log(`Projeto ${p.name}: hasBudgetData=${hasBudgetData}, valor=${p.analysis_data?.budget_data?.total_com_bdi}`);
      return hasBudgetData;
    });

    console.log('💰 Projetos com orçamento persistido:', projectsWithBudget.length);

    const totalInvestment = projectsWithBudget.reduce((sum, project) => {
      const cost = project.analysis_data?.budget_data?.total_com_bdi || 0;
      console.log(`Adicionando custo ${cost} do projeto ${project.name}`);
      return sum + cost;
    }, 0);

    const avgCostPerSqm = projectsWithBudget.length > 0 
      ? projectsWithBudget.reduce((sum, project) => {
          const totalCost = project.analysis_data?.budget_data?.total_com_bdi || 0;
          const area = project.total_area || 100;
          const costPerSqm = totalCost / area;
          console.log(`Projeto ${project.name}: custo=${totalCost}, área=${area}, custo/m²=${costPerSqm}`);
          return sum + costPerSqm;
        }, 0) / projectsWithBudget.length
      : null;

    const budgetCosts = projectsWithBudget.map(p => p.analysis_data.budget_data.total_com_bdi);
    const highestCostProject = budgetCosts.length > 0 
      ? projectsWithBudget[budgetCosts.indexOf(Math.max(...budgetCosts))]
      : null;
    const lowestCostProject = budgetCosts.length > 0 
      ? projectsWithBudget[budgetCosts.indexOf(Math.min(...budgetCosts))]
      : null;

    // MÉTRICAS DE PERFORMANCE - Dados Persistidos
    const projectsWithSchedule = projects.filter(p => {
      const hasScheduleData = p.analysis_data?.schedule_data?.total_duration && 
                             p.analysis_data.schedule_data.total_duration > 0;
      console.log(`Projeto ${p.name}: hasScheduleData=${hasScheduleData}, duração=${p.analysis_data?.schedule_data?.total_duration}`);
      return hasScheduleData;
    });

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
      const cost = p.analysis_data.budget_data.total_com_bdi;
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
        sum + (p.analysis_data?.budget_data?.total_com_bdi || 0), 0
      );

      // Simulando completed baseado em projetos processados
      const completedProjects = monthProjects.filter(p => 
        p.analysis_data?.budget_data || p.analysis_data?.schedule_data
      ).length;

      return {
        month: monthName,
        started: monthProjects.length,
        completed: completedProjects,
        investment: Math.round(monthBudget / 1000) // Em milhares
      };
    });

    const result = {
      financial: {
        totalInvestment: Math.round(totalInvestment),
        avgCostPerSqm: avgCostPerSqm ? Math.round(avgCostPerSqm) : null,
        costVariation: budgetCosts.length > 1 
          ? Math.round(((Math.max(...budgetCosts) - Math.min(...budgetCosts)) / Math.min(...budgetCosts)) * 100)
          : null,
        budgetEfficiency: Math.round(processingEfficiency),
        highestCostProject: highestCostProject ? {
          name: highestCostProject.name,
          cost: highestCostProject.analysis_data.budget_data.total_com_bdi
        } : null,
        lowestCostProject: lowestCostProject ? {
          name: lowestCostProject.name,
          cost: lowestCostProject.analysis_data.budget_data.total_com_bdi
        } : null
      },
      performance: {
        avgProcessingTime: 2.5, // Simulado
        processingEfficiency: Math.round(processingEfficiency),
        avgProjectDuration: avgProjectDuration ? Math.round(avgProjectDuration) : null,
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
      avgCostPerSqm: result.financial.avgCostPerSqm,
      avgDuration: result.performance.avgProjectDuration
    });

    return result;
  }, [projects]);
};
