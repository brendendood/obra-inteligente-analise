-- Primeiro, migrar todos usuários Free para Basic na tabela users
UPDATE public.users 
SET plan_code = 'BASIC' 
WHERE plan_code = 'free' OR plan_code = 'FREE' OR plan_code IS NULL;

-- Atualizar user_plans para remover qualquer referência a FREE
UPDATE public.user_plans 
SET plan_tier = 'BASIC', messages_quota = 500
WHERE plan_tier = 'FREE';

-- Criar tabela para rastrear uso mensal de projetos e mensagens
CREATE TABLE IF NOT EXISTS public.monthly_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_ym TEXT NOT NULL, -- formato: "2025-01"
    projects_used INTEGER DEFAULT 0,
    messages_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, period_ym)
);

-- Criar tabela para ações administrativas e auditoria
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES auth.users(id),
    target_user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Função para obter período atual no formato YYYY-MM
CREATE OR REPLACE FUNCTION public.get_current_period()
RETURNS TEXT AS $$
BEGIN
    RETURN TO_CHAR(NOW(), 'YYYY-MM');
END;
$$ LANGUAGE plpgsql STABLE;

-- Função para incrementar uso de mensagens
CREATE OR REPLACE FUNCTION public.increment_message_usage(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_period TEXT;
    current_usage INTEGER;
BEGIN
    current_period := public.get_current_period();
    
    INSERT INTO public.monthly_usage (user_id, period_ym, messages_used)
    VALUES (p_user_id, current_period, 1)
    ON CONFLICT (user_id, period_ym)
    DO UPDATE SET 
        messages_used = monthly_usage.messages_used + 1,
        updated_at = now()
    RETURNING messages_used INTO current_usage;
    
    RETURN current_usage;
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar uso de projetos
CREATE OR REPLACE FUNCTION public.increment_project_usage(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_period TEXT;
    current_usage INTEGER;
BEGIN
    current_period := public.get_current_period();
    
    INSERT INTO public.monthly_usage (user_id, period_ym, projects_used)
    VALUES (p_user_id, current_period, 1)
    ON CONFLICT (user_id, period_ym)
    DO UPDATE SET 
        projects_used = monthly_usage.projects_used + 1,
        updated_at = now()
    RETURNING projects_used INTO current_usage;
    
    RETURN current_usage;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar limites do usuário
CREATE OR REPLACE FUNCTION public.check_user_limits(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    user_plan TEXT;
    current_period TEXT;
    usage_record RECORD;
    total_projects INTEGER;
    result JSONB;
BEGIN
    -- Buscar plano do usuário
    SELECT COALESCE(plan_code, 'BASIC') INTO user_plan
    FROM public.users WHERE id = p_user_id;
    
    current_period := public.get_current_period();
    
    -- Buscar uso atual
    SELECT * INTO usage_record
    FROM public.monthly_usage
    WHERE user_id = p_user_id AND period_ym = current_period;
    
    -- Se não existe registro, criar um vazio
    IF usage_record IS NULL THEN
        INSERT INTO public.monthly_usage (user_id, period_ym, projects_used, messages_used)
        VALUES (p_user_id, current_period, 0, 0);
        usage_record.projects_used := 0;
        usage_record.messages_used := 0;
    END IF;
    
    -- Contar total de projetos do usuário
    SELECT COUNT(*) INTO total_projects
    FROM public.projects WHERE user_id = p_user_id;
    
    -- Definir limites baseados no plano
    result := jsonb_build_object(
        'plan', user_plan,
        'current_period', current_period,
        'projects_used', total_projects,
        'messages_used', usage_record.messages_used
    );
    
    CASE user_plan
        WHEN 'BASIC' THEN
            result := result || jsonb_build_object(
                'project_limit', 5,
                'message_limit', 500,
                'can_create_project', total_projects < 5,
                'can_send_message', usage_record.messages_used < 500
            );
        WHEN 'PRO' THEN
            result := result || jsonb_build_object(
                'project_limit', 20,
                'message_limit', 2000,
                'can_create_project', total_projects < 20,
                'can_send_message', usage_record.messages_used < 2000
            );
        WHEN 'ENTERPRISE' THEN
            result := result || jsonb_build_object(
                'project_limit', -1,
                'message_limit', -1,
                'can_create_project', true,
                'can_send_message', true
            );
        ELSE
            -- Default para BASIC se plano não reconhecido
            result := result || jsonb_build_object(
                'project_limit', 5,
                'message_limit', 500,
                'can_create_project', total_projects < 5,
                'can_send_message', usage_record.messages_used < 500
            );
    END CASE;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS para monthly_usage
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON public.monthly_usage
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.monthly_usage
FOR ALL USING (auth.uid() = user_id);

-- RLS para admin_actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all actions" ON public.admin_actions
FOR SELECT USING (is_admin_user());

CREATE POLICY "Admins can insert actions" ON public.admin_actions
FOR INSERT WITH CHECK (is_admin_user());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_monthly_usage_updated_at
    BEFORE UPDATE ON public.monthly_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para incrementar projetos automaticamente
CREATE OR REPLACE FUNCTION public.auto_increment_project_usage()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.increment_project_usage(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_project_usage_trigger
    AFTER INSERT ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_increment_project_usage();