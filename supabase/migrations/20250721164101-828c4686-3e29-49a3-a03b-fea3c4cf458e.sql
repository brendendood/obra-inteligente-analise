
-- LIMPEZA COMPLETA DA PLATAFORMA MADENAI
-- Este script remove todos os dados de projetos, conversas, análises e redefine usuários para estado inicial

-- FASE 1: Limpeza de Dados de Projetos
-- Limpar conversas primeiro (devido às foreign keys)
DELETE FROM public.project_conversations WHERE id IS NOT NULL;

-- Limpar análises de projetos
DELETE FROM public.project_analyses WHERE id IS NOT NULL;

-- Limpar documentos de projetos
DELETE FROM public.project_documents WHERE id IS NOT NULL;

-- Limpar projetos (principal)
DELETE FROM public.projects WHERE id IS NOT NULL;

-- FASE 2: Reset de Dados de Usuário
-- Resetar user_profiles para valores padrão (manter apenas full_name)
UPDATE public.user_profiles 
SET 
  company = NULL,
  phone = NULL,
  city = NULL,
  state = NULL,
  country = 'Brasil',
  sector = NULL,
  tags = '{}',
  utm_source = NULL,
  utm_medium = NULL,
  utm_campaign = NULL,
  referrer = NULL,
  last_login = NULL,
  updated_at = now()
WHERE user_id IS NOT NULL;

-- Resetar todas as assinaturas para Free
UPDATE public.user_subscriptions 
SET 
  plan = 'free',
  status = 'active',
  trial_end = NULL,
  current_period_start = NULL,
  current_period_end = NULL,
  stripe_customer_id = NULL,
  stripe_subscription_id = NULL,
  updated_at = now()
WHERE user_id IS NOT NULL;

-- FASE 3: Limpeza de Métricas e Analytics
-- Limpar métricas de uso de IA
DELETE FROM public.ai_usage_metrics WHERE id IS NOT NULL;

-- Limpar analytics de usuário
DELETE FROM public.user_analytics WHERE id IS NOT NULL;

-- Limpar segmentos de usuário
DELETE FROM public.user_segments WHERE id IS NOT NULL;

-- Limpar pagamentos
DELETE FROM public.payments WHERE id IS NOT NULL;

-- Limpar logs de alerta
DELETE FROM public.alert_logs WHERE id IS NOT NULL;

-- Limpar logs de webhook
DELETE FROM public.webhook_logs WHERE id IS NOT NULL;

-- Limpar logs de auditoria admin
DELETE FROM public.admin_audit_logs WHERE id IS NOT NULL;

-- FASE 4: Limpeza de Storage
-- Remover todos os arquivos dos buckets
DELETE FROM storage.objects WHERE bucket_id IN ('project-files', 'project-documents');

-- FASE 5: Comentários informativos
-- Todos os usuários agora estão como "contas novas":
-- - 0 projetos
-- - Plano Free ativo 
-- - Dados pessoais mínimos
-- - Sem histórico de IA/análises
-- - Sistema pronto para produção
