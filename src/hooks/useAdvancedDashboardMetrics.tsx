
import { useMemo } from 'react';
import { Project } from '@/types/project';

interface FinancialMetrics {
  totalInvestment: number;
  avgCostPerSqm: number | null;
  costVariation: number | null;
  budgetEfficiency: number | null;
  highestCostProject: { name: string; cost: number } | null;
  lowestCostProject: { name: string; cost: number } | null;
}

interface PerformanceMetrics {
  avgProcessingTime: number | null;
  processingEfficiency: number;
  avgProjectDuration: number | null;
  onTimeDeliveryRate: number;
  bottleneckPhase: string | null;
}

interface PredictiveMetrics {
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  riskFactors: string[];
  upcomingDeadlines: number;
  budgetAlerts: number;
  qualityScore: number;
}

interface QualityMetrics {
  completionRate: number;
  dataQualityScore: number;
  revisionRate: number;
  avgAccuracy: number;
}

interface AdvancedMetrics {
  financial: FinancialMetrics;
  performance: PerformanceMetrics;
  predictive: PredictiveMetrics;
  quality: QualityMetrics;
  monthlyTrends: {
    month: string;
    started: number;
    completed: number;
    investment: number;
  }[];
}

export const useAdvancedDashboardMetrics = (projects: Project[]): AdvancedMetrics => {
  return useMemo(() => {
    console.log('📊 ADVANCED METRICS: Calculando métricas avançadas para', projects.length, 'projetos');
    
    // Métricas Financeiras
    const financial = calculateFinancialMetrics(projects);
    
    // Métricas de Performance
    const performance = calculatePerformanceMetrics(projects);
    
    // Métricas Preditivas
    const predictive = calculatePredictiveMetrics(projects);
    
    // Métricas de Qualidade
    const quality = calculateQualityMetrics(projects);
    
    // Tendências Mensais
    const monthlyTrends = calculateMonthlyTrends(projects);

    const metrics = {
      financial,
      performance,
      predictive,
      quality,
      monthlyTrends
    };

    console.log('✅ ADVANCED METRICS: Métricas calculadas:', {
      totalInvestment: financial.totalInvestment,
      riskLevel: predictive.riskLevel,
      qualityScore: predictive.qualityScore,
      processingEfficiency: performance.processingEfficiency
    });

    return metrics;
  }, [projects]);
};

const calculateFinancialMetrics = (projects: Project[]): FinancialMetrics => {
  const projectsWithBudget = projects.filter(project => 
    project.analysis_data?.budget?.total_cost && project.total_area
  );

  if (projectsWithBudget.length === 0) {
    return {
      totalInvestment: 0,
      avgCostPerSqm: null,
      costVariation: null,
      budgetEfficiency: null,
      highestCostProject: null,
      lowestCostProject: null
    };
  }

  const costs = projectsWithBudget.map(p => p.analysis_data.budget.total_cost);
  const totalInvestment = costs.reduce((sum, cost) => sum + cost, 0);
  
  const costsPerSqm = projectsWithBudget.map(p => 
    p.analysis_data.budget.total_cost / p.total_area
  );
  const avgCostPerSqm = Math.round(costsPerSqm.reduce((sum, cost) => sum + cost, 0) / costsPerSqm.length);
  
  const costVariationPercent = costsPerSqm.length > 1 ? 
    Math.round(((Math.max(...costsPerSqm) - Math.min(...costsPerSqm)) / avgCostPerSqm) * 100) : 0;

  const highestCost = Math.max(...costs);
  const lowestCost = Math.min(...costs);
  
  const highestCostProject = projectsWithBudget.find(p => p.analysis_data.budget.total_cost === highestCost);
  const lowestCostProject = projectsWithBudget.find(p => p.analysis_data.budget.total_cost === lowestCost);

  const budgetEfficiency = projectsWithBudget.filter(p => 
    p.analysis_data.budget.total_cost <= (p.total_area * avgCostPerSqm * 1.1)
  ).length / projectsWithBudget.length * 100;

  return {
    totalInvestment: Math.round(totalInvestment),
    avgCostPerSqm,
    costVariation: costVariationPercent,
    budgetEfficiency: Math.round(budgetEfficiency),
    highestCostProject: highestCostProject ? { 
      name: highestCostProject.name, 
      cost: highestCost 
    } : null,
    lowestCostProject: lowestCostProject ? { 
      name: lowestCostProject.name, 
      cost: lowestCost 
    } : null
  };
};

const calculatePerformanceMetrics = (projects: Project[]): PerformanceMetrics => {
  const processedProjects = projects.filter(p => p.analysis_data);
  const totalProjects = projects.length;
  
  if (totalProjects === 0) {
    return {
      avgProcessingTime: null,
      processingEfficiency: 0,
      avgProjectDuration: null,
      onTimeDeliveryRate: 0,
      bottleneckPhase: null
    };
  }

  const processingEfficiency = Math.round((processedProjects.length / totalProjects) * 100);
  
  const projectsWithSchedule = processedProjects.filter(p => 
    p.analysis_data.schedule?.total_duration
  );
  
  const avgProjectDuration = projectsWithSchedule.length > 0 ? 
    Math.round(
      projectsWithSchedule.reduce((sum, p) => sum + p.analysis_data.schedule.total_duration, 0) / 
      projectsWithSchedule.length
    ) : null;

  // Simular tempo de processamento baseado na data de criação vs análise
  const processingTimes = processedProjects.map(p => {
    const created = new Date(p.created_at);
    const updated = new Date(p.updated_at);
    return Math.max(1, Math.round((updated.getTime() - created.getTime()) / (1000 * 60 * 60))); // horas
  });
  
  const avgProcessingTime = processingTimes.length > 0 ? 
    Math.round(processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length) : null;

  // Taxa de entrega no prazo (simulada baseada em projetos processados rapidamente)
  const onTimeProjects = processedProjects.filter(p => {
    const processingTime = new Date(p.updated_at).getTime() - new Date(p.created_at).getTime();
    return processingTime <= (24 * 60 * 60 * 1000); // processados em até 1 dia
  });
  const onTimeDeliveryRate = Math.round((onTimeProjects.length / processedProjects.length) * 100);

  // Identificar gargalo (fase com mais projetos pendentes)
  const pendingProjects = projects.filter(p => !p.analysis_data);
  const bottleneckPhase = pendingProjects.length > processedProjects.length * 0.3 ? 
    'Análise Inicial' : processedProjects.length > 0 ? 'Finalização' : null;

  return {
    avgProcessingTime,
    processingEfficiency,
    avgProjectDuration,
    onTimeDeliveryRate,
    bottleneckPhase
  };
};

const calculatePredictiveMetrics = (projects: Project[]): PredictiveMetrics => {
  const riskFactors: string[] = [];
  let riskScore = 0;

  // Projetos não analisados há muito tempo
  const oldPendingProjects = projects.filter(project => {
    if (project.analysis_data) return false;
    const createdAt = new Date(project.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt < weekAgo;
  });

  if (oldPendingProjects.length > 0) {
    riskFactors.push(`${oldPendingProjects.length} projetos pendentes há mais de 7 dias`);
    riskScore += oldPendingProjects.length * 2;
  }

  // Projetos com orçamento muito alto
  const highBudgetProjects = projects.filter(project => 
    project.analysis_data?.budget?.total_cost > 1000000
  );

  if (highBudgetProjects.length > 0) {
    riskFactors.push(`${highBudgetProjects.length} projetos com orçamento acima de R$ 1M`);
    riskScore += highBudgetProjects.length;
  }

  // Projetos com cronograma apertado
  const tightScheduleProjects = projects.filter(project => 
    project.analysis_data?.schedule?.total_duration && 
    project.analysis_data.schedule.total_duration < 60
  );

  if (tightScheduleProjects.length > 0) {
    riskFactors.push(`${tightScheduleProjects.length} projetos com cronograma < 60 dias`);
    riskScore += tightScheduleProjects.length * 1.5;
  }

  const riskPercentage = projects.length > 0 ? (riskScore / (projects.length * 2)) * 100 : 0;
  
  let riskLevel: 'Baixo' | 'Médio' | 'Alto' = 'Baixo';
  if (riskPercentage >= 60) riskLevel = 'Alto';
  else if (riskPercentage >= 30) riskLevel = 'Médio';

  // Alertas de prazos próximos
  const upcomingDeadlines = projects.filter(p => {
    if (!p.analysis_data?.schedule?.total_duration) return false;
    const startDate = new Date(p.created_at);
    const endDate = new Date(startDate.getTime() + (p.analysis_data.schedule.total_duration * 24 * 60 * 60 * 1000));
    const now = new Date();
    const daysUntilEnd = (endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
    return daysUntilEnd > 0 && daysUntilEnd <= 30;
  }).length;

  // Alertas de orçamento
  const budgetAlerts = projects.filter(p => {
    if (!p.analysis_data?.budget?.total_cost || !p.total_area) return false;
    const costPerSqm = p.analysis_data.budget.total_cost / p.total_area;
    return costPerSqm > 3000; // Alerta para custos acima de R$ 3000/m²
  }).length;

  // Score de qualidade geral
  const qualityFactors = [
    projects.filter(p => p.analysis_data).length / Math.max(1, projects.length), // Taxa de análise
    projects.filter(p => p.project_type).length / Math.max(1, projects.length), // Taxa de tipificação
    projects.filter(p => p.total_area && p.total_area > 0).length / Math.max(1, projects.length), // Taxa com área
    1 - (riskScore / Math.max(1, projects.length * 10)) // Inverso do risco normalizado
  ];
  
  const qualityScore = Math.round(qualityFactors.reduce((sum, factor) => sum + factor, 0) / qualityFactors.length * 100);

  return {
    riskLevel,
    riskFactors,
    upcomingDeadlines,
    budgetAlerts,
    qualityScore
  };
};

const calculateQualityMetrics = (projects: Project[]): QualityMetrics => {
  if (projects.length === 0) {
    return {
      completionRate: 0,
      dataQualityScore: 0,
      revisionRate: 0,
      avgAccuracy: 0
    };
  }

  const completionRate = Math.round((projects.filter(p => p.analysis_data).length / projects.length) * 100);
  
  // Score de qualidade dos dados
  const dataQualityFactors = projects.map(p => {
    let score = 0;
    if (p.name && p.name.trim().length > 0) score += 25;
    if (p.project_type) score += 25;
    if (p.total_area && p.total_area > 0) score += 25;
    if (p.analysis_data && Object.keys(p.analysis_data).length > 0) score += 25;
    return score;
  });
  
  const dataQualityScore = Math.round(
    dataQualityFactors.reduce((sum, score) => sum + score, 0) / (projects.length * 100) * 100
  );

  // Taxa de revisão (simulada baseada em projetos atualizados recentemente)
  const recentlyUpdated = projects.filter(p => {
    const updated = new Date(p.updated_at);
    const created = new Date(p.created_at);
    return updated.getTime() - created.getTime() > (24 * 60 * 60 * 1000); // Atualizado depois de 1 dia da criação
  });
  const revisionRate = Math.round((recentlyUpdated.length / projects.length) * 100);

  // Precisão média (baseada na completude dos dados)
  const avgAccuracy = Math.round((completionRate + dataQualityScore) / 2);

  return {
    completionRate,
    dataQualityScore,
    revisionRate,
    avgAccuracy
  };
};

const calculateMonthlyTrends = (projects: Project[]) => {
  const last6Months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    
    const monthProjects = projects.filter(project => {
      const createdDate = new Date(project.created_at);
      return createdDate.getMonth() === date.getMonth() && 
             createdDate.getFullYear() === date.getFullYear();
    });
    
    const started = monthProjects.length;
    const completed = monthProjects.filter(p => p.analysis_data).length;
    const investment = monthProjects
      .filter(p => p.analysis_data?.budget?.total_cost)
      .reduce((sum, p) => sum + p.analysis_data.budget.total_cost, 0);
    
    last6Months.push({
      month: monthName,
      started,
      completed,
      investment: Math.round(investment)
    });
  }
  
  return last6Months;
};
