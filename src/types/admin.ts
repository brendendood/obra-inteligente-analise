// Tipos consolidados para o sistema admin unificado

export interface AdminStats {
  total_users: number;
  total_projects: number;
  active_subscriptions: number;
  monthly_revenue: number;
  new_users_this_month: number;
  ai_usage_this_month: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_sign_in_at?: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  tags?: string[];
  engagement_metrics?: {
    total_sessions: number;
    avg_session_duration: number;
    last_activity: string | null;
  } | null;
}

export interface AdminProject {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'completed' | 'archived';
  type: string;
  user_name: string | null;
  file_size: number | null;
  analysis_data: any;
}

export interface AdminPayment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  payment_method: string;
  subscription_id?: string;
  user_email?: string;
}

export interface PaymentStats {
  total_revenue: number;
  monthly_revenue: number;
  active_subscriptions: number;
  failed_payments: number;
}

// Tipos para relatórios admin
export interface ReportFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  userSegment?: string;
  projectType?: string;
  paymentStatus?: string;
}

export interface ReportData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    avgSessionDuration: number;
  };
  charts: {
    revenue: Array<{ date: string; amount: number }>;
    userGrowth: Array<{ date: string; users: number }>;
    aiUsage: Array<{ date: string; calls: number }>;
  };
  insights: {
    topFeatures: Array<{ feature: string; usage: number }>;
    userSegments: Array<{ segment: string; count: number }>;
    conversionRate: number;
  };
}