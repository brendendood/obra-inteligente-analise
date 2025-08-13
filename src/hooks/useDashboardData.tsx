
import { useState, useEffect, useRef, useMemo } from 'react';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';

interface DashboardStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  processedProjects: number;
  monthlyProjects: number;
  averageArea: number;
  projectsByType: Record<string, number>;
  totalInvestment: number;
  projectsWithBudget: number;
  projectsWithSchedule: number;
  avgCostPerSqm: number | null;
  avgProjectDuration: number | null;
}

export const useDashboardData = () => {
  const { projects, isLoading: isLoadingProjects, forceRefresh } = useUnifiedProjectStore();
  const mountedRef = useRef(true);
  
  // Memoize expensive calculations
  const stats = useMemo<DashboardStats>(() => {
    if (!projects || projects.length === 0) {
      return {
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
      };
    }

    // Calculate all stats in one pass for better performance
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let totalArea = 0;
    let processedCount = 0;
    let recentCount = 0;
    let monthlyCount = 0;
    let totalInvestment = 0;
    let budgetCount = 0;
    let scheduleCount = 0;
    let costSum = 0;
    let durationSum = 0;
    const projectsByType: Record<string, number> = {};

    projects.forEach((project: any) => {
      // Area calculation
      totalArea += project.total_area || 0;

      // Processed projects
      if (project.analysis_data && Object.keys(project.analysis_data).length > 0) {
        processedCount++;
      }

      // Time-based filtering
      const createdAt = new Date(project.created_at);
      if (createdAt >= weekAgo) recentCount++;
      if (createdAt >= monthAgo) monthlyCount++;

      // Project type distribution
      const type = project.project_type || 'Não definido';
      projectsByType[type] = (projectsByType[type] || 0) + 1;

      // Budget analysis
      const budgetData = project.analysis_data?.budget_data;
      if (budgetData?.total_com_bdi && budgetData.total_com_bdi > 0) {
        budgetCount++;
        totalInvestment += budgetData.total_com_bdi;
        
        const area = project.total_area || 100;
        costSum += budgetData.total_com_bdi / area;
      }

      // Schedule analysis
      const scheduleData = project.analysis_data?.schedule_data;
      if (scheduleData?.total_duration && scheduleData.total_duration > 0) {
        scheduleCount++;
        durationSum += scheduleData.total_duration;
      }
    });

    return {
      totalProjects: projects.length,
      totalArea: Math.round(totalArea),
      recentProjects: recentCount,
      processedProjects: processedCount,
      monthlyProjects: monthlyCount,
      averageArea: projects.length > 0 ? Math.round(totalArea / projects.length) : 0,
      projectsByType,
      totalInvestment: Math.round(totalInvestment),
      projectsWithBudget: budgetCount,
      projectsWithSchedule: scheduleCount,
      avgCostPerSqm: budgetCount > 0 ? Math.round(costSum / budgetCount) : null,
      avgProjectDuration: scheduleCount > 0 ? Math.round(durationSum / scheduleCount) : null
    };
  }, [projects]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    projects,
    stats,
    isDataLoading: isLoadingProjects,
    forceRefresh
  };
};
