import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  name: string;
  created_at: string;
  total_area?: number;
  project_type?: string;
  analysis_data?: any;
  user_id: string;
}

interface SafeDashboardStats {
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

// Safe projects query with proper error handling and caching
const useProjectsQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['dashboard-projects', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching dashboard projects:', error);
        throw error;
      }
      
      return (data || []) as Project[];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - renamed from cacheTime
    retry: 2,
    retryDelay: 1000,
  });
};

// Memoized stats calculation - no re-renders unless projects change
const calculateStats = (projects: Project[]): SafeDashboardStats => {
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

  // Time calculations
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Initialize counters
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

  // Single pass through projects for efficiency
  projects.forEach((project) => {
    // Area calculation
    const area = project.total_area || 0;
    totalArea += area;

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
    try {
      const budgetData = project.analysis_data?.budget_data;
      if (budgetData?.total_com_bdi && budgetData.total_com_bdi > 0) {
        budgetCount++;
        totalInvestment += budgetData.total_com_bdi;
        
        if (area > 0) {
          costSum += budgetData.total_com_bdi / area;
        }
      }
    } catch (error) {
      console.warn('Error processing budget data for project:', project.id, error);
    }

    // Schedule analysis
    try {
      const scheduleData = project.analysis_data?.schedule_data;
      if (scheduleData?.total_duration && scheduleData.total_duration > 0) {
        scheduleCount++;
        durationSum += scheduleData.total_duration;
      }
    } catch (error) {
      console.warn('Error processing schedule data for project:', project.id, error);
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
};

// Main hook with proper memoization
export const useSafeDashboardData = (userId?: string) => {
  const { 
    data: projects = [], 
    isLoading, 
    error,
    refetch 
  } = useProjectsQuery(userId);

  // Memoized stats calculation - only recalculates when projects array changes
  const stats = useMemo(() => {
    console.log('🔒 SAFE DASHBOARD DATA: Calculating stats for', projects.length, 'projects');
    return calculateStats(projects);
  }, [projects]);

  console.log('🔒 SAFE DASHBOARD DATA: Hook called, loading:', isLoading, 'projects:', projects.length);

  return {
    projects,
    stats,
    isLoading,
    error,
    refetch
  };
};