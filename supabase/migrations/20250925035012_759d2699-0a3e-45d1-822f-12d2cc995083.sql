-- Garantir que brendendood2014@gmail.com sempre seja Enterprise
UPDATE public.users 
SET plan_code = 'ENTERPRISE' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'brendendood2014@gmail.com'
);

-- Criar função para proteger usuário supremo
CREATE OR REPLACE FUNCTION public.protect_supreme_user()
RETURNS TRIGGER AS $$
DECLARE
    supreme_user_id UUID;
    admin_user_id UUID;
BEGIN
    -- Identificar o usuário supremo
    SELECT id INTO supreme_user_id 
    FROM auth.users 
    WHERE email = 'brendendood2014@gmail.com';
    
    -- Se é uma tentativa de alterar o usuário supremo
    IF NEW.id = supreme_user_id AND OLD.plan_code != NEW.plan_code THEN
        -- Pegar o usuário atual (se autenticado)
        admin_user_id := auth.uid();
        
        -- Logar a tentativa bloqueada
        INSERT INTO public.admin_actions (
            admin_user_id,
            target_user_id,
            action,
            payload
        ) VALUES (
            admin_user_id,
            supreme_user_id,
            'SUPREME_PROTECTION_TRIGGERED',
            jsonb_build_object(
                'attempted_change', 'plan_code',
                'old_value', OLD.plan_code,
                'attempted_value', NEW.plan_code,
                'blocked_at', NOW(),
                'reason', 'Supreme user protection active'
            )
        );
        
        -- Forçar manter Enterprise
        NEW.plan_code = 'ENTERPRISE';
        
        RAISE LOG 'Supreme user protection triggered: plan change blocked for %', supreme_user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para proteger alterações
DROP TRIGGER IF EXISTS protect_supreme_user_trigger ON public.users;
CREATE TRIGGER protect_supreme_user_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_supreme_user();

-- Garantir que o usuário existe na tabela users (caso não exista)
INSERT INTO public.users (id, plan_code, lifetime_base_consumed)
SELECT au.id, 'ENTERPRISE', 0
FROM auth.users au
WHERE au.email = 'brendendood2014@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = au.id
);