-- Sincronizar todos os usuários de auth.users para a tabela users
-- e garantir que a tabela users seja a fonte única de dados

-- Primeiro, adicionar colunas necessárias na tabela users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Criar índice no email para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Migrar todos os usuários de auth.users para a tabela users
INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    plan_code, 
    status, 
    created_at, 
    updated_at
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
    COALESCE(u.plan_code, 'BASIC') as plan_code,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN 'active'
        ELSE 'inactive'
    END as status,
    au.created_at,
    now() as updated_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- Atualizar usuários existentes com dados mais recentes
UPDATE public.users 
SET 
    email = au.email,
    full_name = COALESCE(au.raw_user_meta_data->>'full_name', users.full_name, au.email),
    status = CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN 'active'
        ELSE 'inactive'
    END,
    updated_at = now()
FROM auth.users au
WHERE users.id = au.id;