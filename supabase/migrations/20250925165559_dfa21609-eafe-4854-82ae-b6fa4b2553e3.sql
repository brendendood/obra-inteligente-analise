-- Criar função RPC para buscar usuários administrativos diretamente da tabela users
CREATE OR REPLACE FUNCTION public.get_admin_users_unified()
RETURNS TABLE(
    user_id uuid,
    email text,
    full_name text,
    plan_code text,
    status text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email,
        u.full_name,
        COALESCE(u.plan_code, 'BASIC') as plan_code,
        COALESCE(u.status, 'inactive') as status,
        u.created_at,
        u.updated_at
    FROM public.users u
    ORDER BY u.created_at DESC;
END;
$$;

-- Criar função para estatísticas unificadas
CREATE OR REPLACE FUNCTION public.get_admin_stats_unified()
RETURNS TABLE(
    total_users bigint,
    basic_users bigint,
    pro_users bigint,
    enterprise_users bigint,
    active_users bigint,
    inactive_users bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE COALESCE(plan_code, 'BASIC') = 'BASIC') as basic_users,
        COUNT(*) FILTER (WHERE plan_code = 'PRO') as pro_users,
        COUNT(*) FILTER (WHERE plan_code = 'ENTERPRISE') as enterprise_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users
    FROM public.users;
END;
$$;

-- Criar trigger para sincronização automática de novos usuários
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_users()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Inserir ou atualizar na tabela users
    INSERT INTO public.users (
        id, 
        email, 
        full_name, 
        plan_code, 
        status, 
        created_at, 
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'BASIC', -- Plano padrão
        CASE 
            WHEN NEW.email_confirmed_at IS NOT NULL THEN 'active'
            ELSE 'inactive'
        END,
        NEW.created_at,
        now()
    )
    ON CONFLICT (id) 
    DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, users.full_name),
        status = EXCLUDED.status,
        updated_at = now();
    
    RETURN NEW;
END;
$$;

-- Criar trigger para sincronização automática
DROP TRIGGER IF EXISTS sync_auth_to_users ON auth.users;
CREATE TRIGGER sync_auth_to_users
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.sync_auth_user_to_users();