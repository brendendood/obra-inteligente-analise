
export interface ReportFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  userPlan: string;
  projectType: string;
  aiUsage: boolean;
}

export interface ReportData {
  totalRevenue: number;
  revenueGrowth: number;
  activeUsers: number;
  userGrowth: number;
  aiCostMonth: number;
  aiCostTrend: 'up' | 'down' | 'stable';
  aiUsageCount: number;
  conversionRate: number;
  revenueChart: any[];
  engagementChart: any[];
  aiUsageChart: any[];
  predictiveData: any;
}

export interface ChartDataItem {
  date: string;
  value: number;
}

export interface EngagementDataItem {
  date: string;
  activeUsers: number;
  newUsers: number;
}

export interface AIUsageDataItem {
  feature: string;
  usage: number;
  cost: number;
}
