
-- Inserir o usuário atual como admin na tabela admin_permissions
-- Substitua 'SEU_EMAIL@EXEMPLO.COM' pelo seu email real

INSERT INTO public.admin_permissions (user_id, active, created_at, updated_at)
SELECT 
  au.id,
  true,
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'brendendood2014@gmail.com'  -- Substitua pelo seu email
AND NOT EXISTS (
  SELECT 1 FROM public.admin_permissions ap 
  WHERE ap.user_id = au.id
);

-- Verificar se o usuário foi adicionado
SELECT 
  au.email,
  ap.active,
  ap.created_at
FROM auth.users au
JOIN public.admin_permissions ap ON au.id = ap.user_id
WHERE au.email = 'brendendood2014@gmail.com';  -- Substitua pelo seu email
