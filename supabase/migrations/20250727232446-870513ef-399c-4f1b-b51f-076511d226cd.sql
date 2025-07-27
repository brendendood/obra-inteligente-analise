-- Criar função para processar recompensa quando usuário referenciado cria primeiro projeto
CREATE OR REPLACE FUNCTION public.process_referral_reward()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    referrer_id UUID;
    is_first_project BOOLEAN;
BEGIN
    -- Verificar se é o primeiro projeto do usuário
    SELECT COUNT(*) = 1 INTO is_first_project
    FROM public.projects 
    WHERE user_id = NEW.user_id;
    
    -- Se não é o primeiro projeto, retornar sem fazer nada
    IF NOT is_first_project THEN
        RETURN NEW;
    END IF;
    
    -- Marcar que o usuário criou seu primeiro projeto
    UPDATE public.user_profiles 
    SET has_created_first_project = true 
    WHERE user_id = NEW.user_id;
    
    -- Verificar se o usuário foi referenciado por alguém
    SELECT referrer_user_id INTO referrer_id
    FROM public.user_referrals ur
    WHERE ur.referred_user_id = NEW.user_id
    AND NOT ur.referred_user_first_project; -- Ainda não processado
    
    -- Se foi referenciado, dar +5 projetos extras para quem indicou
    IF referrer_id IS NOT NULL THEN
        -- Adicionar 5 créditos (projetos extras) para o referrer
        UPDATE public.user_profiles 
        SET credits = credits + 5 
        WHERE user_id = referrer_id;
        
        -- Marcar referral como processado
        UPDATE public.user_referrals 
        SET referred_user_first_project = true,
            updated_at = NOW()
        WHERE referrer_user_id = referrer_id 
        AND referred_user_id = NEW.user_id;
        
        -- Log de gamificação para o referrer
        PERFORM public.award_points(referrer_id, 100, 'referral_first_project', 
            jsonb_build_object(
                'referred_user_id', NEW.user_id,
                'extra_projects_awarded', 5
            )
        );
        
        -- Notificar o referrer via edge function
        PERFORM pg_notify('referral_reward_earned', json_build_object(
            'referrer_id', referrer_id,
            'referred_user_id', NEW.user_id,
            'extra_projects', 5,
            'project_name', NEW.name
        )::text);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Criar trigger na tabela projects
CREATE TRIGGER trigger_referral_reward_on_first_project
    AFTER INSERT ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.process_referral_reward();

-- Resetar todos os créditos para 0 (vamos recalcular corretamente)
UPDATE public.user_profiles SET credits = 0;

-- Processar referrals existentes onde o usuário referenciado já criou projetos
UPDATE public.user_profiles 
SET credits = credits + 5
WHERE user_id IN (
    SELECT ur.referrer_user_id
    FROM public.user_referrals ur
    JOIN public.user_profiles up ON ur.referred_user_id = up.user_id
    WHERE up.has_created_first_project = true
    AND NOT ur.referred_user_first_project
);

-- Marcar esses referrals como processados
UPDATE public.user_referrals 
SET referred_user_first_project = true,
    updated_at = NOW()
WHERE referred_user_id IN (
    SELECT user_id 
    FROM public.user_profiles 
    WHERE has_created_first_project = true
)
AND NOT referred_user_first_project;