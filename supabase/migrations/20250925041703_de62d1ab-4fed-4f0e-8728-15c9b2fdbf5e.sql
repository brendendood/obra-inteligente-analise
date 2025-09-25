-- Garantir que o usuário supremo está configurado com ENTERPRISE
INSERT INTO public.users (id, plan_code, lifetime_base_consumed, created_at)
SELECT 
  au.id,
  'ENTERPRISE' as plan_code,
  0 as lifetime_base_consumed,
  NOW() as created_at
FROM auth.users au
WHERE au.email = 'brendendood2014@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = au.id
  );

-- Forçar ENTERPRISE para o usuário supremo
UPDATE public.users 
SET 
  plan_code = 'ENTERPRISE'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'brendendood2014@gmail.com'
);

-- Inserir perfil se não existir
INSERT INTO public.user_profiles (
  user_id, 
  full_name, 
  ref_code, 
  credits, 
  quiz_completed,
  plan_selected,
  created_at,
  updated_at
)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Supreme User'),
  CONCAT('REF_', SUBSTRING(au.id::text, 1, 8)),
  999999, -- Créditos ilimitados
  true,   -- Quiz completo
  true,   -- Plano selecionado
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'brendendood2014@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.user_id = au.id
  );

-- Garantir perfil do usuário supremo sempre atualizado
UPDATE public.user_profiles 
SET 
  credits = 999999,
  quiz_completed = true,
  plan_selected = true,
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'brendendood2014@gmail.com'
);