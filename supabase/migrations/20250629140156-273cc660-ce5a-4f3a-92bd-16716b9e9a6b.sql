
-- Analytics de Comportamento - Extensão da tabela user_analytics existente
ALTER TABLE public.user_analytics 
ADD COLUMN IF NOT EXISTS session_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]'::jsonb;

-- Índices para performance das consultas de analytics
CREATE INDEX IF NOT EXISTS idx_user_analytics_last_active ON public.user_analytics(last_active);
CREATE INDEX IF NOT EXISTS idx_user_analytics_session_duration ON public.user_analytics(session_duration);

-- Função para calcular engajamento de usuários
CREATE OR REPLACE FUNCTION public.calculate_user_engagement()
RETURNS TABLE(
  user_id UUID,
  total_sessions BIGINT,
  avg_session_duration FLOAT,
  total_events BIGINT,
  last_activity TIMESTAMPTZ,
  engagement_score FLOAT
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    ua.user_id,
    COUNT(DISTINCT ua.session_id) as total_sessions,
    AVG(ua.session_duration) as avg_session_duration,
    COUNT(*) as total_events,
    MAX(ua.last_active) as last_activity,
    -- Score de engajamento (0-100)
    LEAST(100, 
      (COUNT(*) * 2) + 
      (AVG(ua.session_duration) / 60) + 
      (COUNT(DISTINCT ua.session_id) * 5)
    ) as engagement_score
  FROM public.user_analytics ua
  WHERE ua.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY ua.user_id
  ORDER BY engagement_score DESC;
$$;

-- Sistema de Tags Automáticas
CREATE TABLE IF NOT EXISTS public.user_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  segment_name TEXT NOT NULL,
  segment_data JSONB DEFAULT '{}',
  auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, segment_name)
);

-- Função para atualizar tags automáticas
CREATE OR REPLACE FUNCTION public.update_user_segments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Usuários ativos semanalmente
  INSERT INTO public.user_segments (user_id, segment_name, segment_data)
  SELECT DISTINCT 
    ua.user_id,
    'active_weekly',
    jsonb_build_object('last_activity', MAX(ua.last_active))
  FROM public.user_analytics ua
  WHERE ua.last_active >= NOW() - INTERVAL '7 days'
  GROUP BY ua.user_id
  ON CONFLICT (user_id, segment_name) 
  DO UPDATE SET 
    segment_data = EXCLUDED.segment_data,
    updated_at = NOW();

  -- Usuários com potencial (IA + Upload)
  INSERT INTO public.user_segments (user_id, segment_name, segment_data)
  SELECT DISTINCT 
    ua.user_id,
    'high_potential',
    jsonb_build_object(
      'ai_usage', COUNT(CASE WHEN ua.event_type = 'ai_used' THEN 1 END),
      'uploads', COUNT(CASE WHEN ua.event_type = 'file_uploaded' THEN 1 END)
    )
  FROM public.user_analytics ua
  WHERE ua.event_type IN ('ai_used', 'file_uploaded')
    AND ua.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY ua.user_id
  HAVING 
    COUNT(CASE WHEN ua.event_type = 'ai_used' THEN 1 END) > 0 
    AND COUNT(CASE WHEN ua.event_type = 'file_uploaded' THEN 1 END) > 0
  ON CONFLICT (user_id, segment_name) 
  DO UPDATE SET 
    segment_data = EXCLUDED.segment_data,
    updated_at = NOW();

  -- Usuários estagnados
  INSERT INTO public.user_segments (user_id, segment_name, segment_data)
  SELECT DISTINCT 
    up.user_id,
    'stagnant',
    jsonb_build_object('days_inactive', EXTRACT(DAYS FROM (NOW() - MAX(ua.last_active))))
  FROM public.user_profiles up
  LEFT JOIN public.user_analytics ua ON up.user_id = ua.user_id
  WHERE ua.last_active < NOW() - INTERVAL '7 days'
    OR ua.last_active IS NULL
  GROUP BY up.user_id
  ON CONFLICT (user_id, segment_name) 
  DO UPDATE SET 
    segment_data = EXCLUDED.segment_data,
    updated_at = NOW();
END;
$$;

-- Webhooks para automações
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  response_body TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Função para analytics avançado do admin
CREATE OR REPLACE FUNCTION public.get_advanced_admin_analytics()
RETURNS TABLE(
  total_users BIGINT,
  active_users_week BIGINT,
  active_users_month BIGINT,
  avg_session_duration FLOAT,
  total_ai_calls BIGINT,
  ai_cost_month NUMERIC,
  conversion_rate FLOAT,
  top_features JSONB
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM auth.users),
    (SELECT COUNT(DISTINCT user_id) FROM public.user_analytics WHERE last_active >= NOW() - INTERVAL '7 days'),
    (SELECT COUNT(DISTINCT user_id) FROM public.user_analytics WHERE last_active >= NOW() - INTERVAL '30 days'),
    (SELECT AVG(session_duration) FROM public.user_analytics WHERE created_at >= NOW() - INTERVAL '30 days'),
    (SELECT COUNT(*) FROM public.ai_usage_metrics WHERE created_at >= NOW() - INTERVAL '30 days'),
    (SELECT COALESCE(SUM(cost_usd), 0) FROM public.ai_usage_metrics WHERE created_at >= date_trunc('month', now())),
    (SELECT 
      CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) > 0 
        THEN (SELECT COUNT(*) FROM public.user_subscriptions WHERE plan != 'free')::FLOAT / (SELECT COUNT(*) FROM auth.users)::FLOAT * 100
        ELSE 0 
      END),
    (SELECT jsonb_agg(
      jsonb_build_object(
        'feature', event_type,
        'count', count
      ) ORDER BY count DESC
    ) FROM (
      SELECT event_type, COUNT(*) as count 
      FROM public.user_analytics 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY event_type 
      LIMIT 5
    ) top_events)
  WHERE public.is_admin_user() = true;
$$;

-- RLS para novas tabelas
ALTER TABLE public.user_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all segments" ON public.user_segments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = auth.uid() AND active = true)
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view webhook logs" ON public.webhook_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = auth.uid() AND active = true)
);

-- Trigger para executar segmentação automática
CREATE OR REPLACE FUNCTION public.trigger_segment_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Executar em background para não bloquear
  PERFORM public.update_user_segments();
  RETURN NEW;
END;
$$;

-- Trigger após inserção de analytics
CREATE OR REPLACE TRIGGER on_analytics_insert
  AFTER INSERT ON public.user_analytics
  FOR EACH STATEMENT EXECUTE FUNCTION public.trigger_segment_update();
