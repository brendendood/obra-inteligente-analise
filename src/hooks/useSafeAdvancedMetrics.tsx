import { useMemo } from 'react';

interface Project {
  id: string;
  name: string;
  created_at: string;
  total_area?: number;
  project_type?: string;
  analysis_data?: any;
}

interface SafeAdvancedMetrics {
  financial: {
    totalInvestment: number;
    avgCostPerSqm: number | null;
  };
  projectMetrics: {
    totalArea: number;
    avgCostPerProject: number | null;
    projectCount: number;
  };
  projectStatus: {
    projectsWithBudget: number;
    lastSubmissionDate: string | null;
    totalProjects: number;
  };
  monthlyTrends: Array<{
    month: string;
    started: number;
    completed: number;
    investment: number;
  }>;
}

// Safe calculation with error handling
export const useSafeAdvancedMetrics = (projects: Project[]): SafeAdvancedMetrics => {
  return useMemo(() => {
    console.log('🔒 SAFE METRICS: Calculating for', projects.length, 'projects');
    
    if (!projects || projects.length === 0) {
      return {
        financial: {
          totalInvestment: 0,
          avgCostPerSqm: null,
        },
        projectMetrics: {
          totalArea: 0,
          avgCostPerProject: null,
          projectCount: 0,
        },
        projectStatus: {
          projectsWithBudget: 0,
          lastSubmissionDate: null,
          totalProjects: 0,
        },
        monthlyTrends: [],
      };
    }

    // Financial metrics
    let totalInvestment = 0;
    let totalArea = 0;
    let budgetCount = 0;
    let costSum = 0;
    let lastSubmissionDate: string | null = null;
    
    // Monthly trends tracking
    const monthlyData: Record<string, { started: number; completed: number; investment: number }> = {};

    projects.forEach((project) => {
      try {
        // Area calculation
        const area = project.total_area || 0;
        totalArea += area;

        // Date processing
        const createdAt = new Date(project.created_at);
        const monthKey = createdAt.toISOString().slice(0, 7); // YYYY-MM format
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { started: 0, completed: 0, investment: 0 };
        }
        monthlyData[monthKey].started++;

        // Last submission tracking
        if (!lastSubmissionDate || createdAt.toISOString() > lastSubmissionDate) {
          lastSubmissionDate = createdAt.toISOString();
        }

        // Budget analysis with error handling
        const budgetData = project.analysis_data?.budget_data;
        if (budgetData?.total_com_bdi && typeof budgetData.total_com_bdi === 'number' && budgetData.total_com_bdi > 0) {
          budgetCount++;
          const investment = budgetData.total_com_bdi;
          totalInvestment += investment;
          monthlyData[monthKey].investment += investment;
          
          if (area > 0) {
            costSum += investment / area;
          }
        }

        // Schedule completion tracking
        const scheduleData = project.analysis_data?.schedule_data;
        if (scheduleData?.total_duration && scheduleData.total_duration > 0) {
          monthlyData[monthKey].completed++;
        }
      } catch (error) {
        console.warn('🔒 SAFE METRICS: Error processing project', project.id, error);
      }
    });

    // Convert monthly data to array and sort
    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    const result: SafeAdvancedMetrics = {
      financial: {
        totalInvestment: Math.round(totalInvestment),
        avgCostPerSqm: budgetCount > 0 ? Math.round(costSum / budgetCount) : null,
      },
      projectMetrics: {
        totalArea: Math.round(totalArea),
        avgCostPerProject: budgetCount > 0 ? Math.round(totalInvestment / budgetCount) : null,
        projectCount: projects.length,
      },
      projectStatus: {
        projectsWithBudget: budgetCount,
        lastSubmissionDate,
        totalProjects: projects.length,
      },
      monthlyTrends,
    };

    console.log('🔒 SAFE METRICS: Calculated successfully');
    return result;
  }, [projects]); // Only recalculate when projects array changes
};