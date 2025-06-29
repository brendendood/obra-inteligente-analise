
-- Create alert_configurations table
CREATE TABLE public.alert_configurations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type text NOT NULL,
  name text NOT NULL,
  description text,
  enabled boolean DEFAULT true,
  conditions jsonb DEFAULT '{}',
  actions jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(alert_type)
);

-- Create alert_logs table  
CREATE TABLE public.alert_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resolved boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id),
  project_id uuid REFERENCES public.projects(id),
  triggered_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admin can manage alert configurations" ON public.alert_configurations
  FOR ALL USING (public.is_admin_user() = true);

CREATE POLICY "Admin can manage alert logs" ON public.alert_logs  
  FOR ALL USING (public.is_admin_user() = true);

-- Create indexes for performance
CREATE INDEX idx_alert_logs_alert_type ON public.alert_logs(alert_type);
CREATE INDEX idx_alert_logs_triggered_at ON public.alert_logs(triggered_at);
CREATE INDEX idx_alert_logs_user_id ON public.alert_logs(user_id);
CREATE INDEX idx_alert_configurations_enabled ON public.alert_configurations(enabled);
