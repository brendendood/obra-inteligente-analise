-- Corrigir dados do usuário supremo brendendood2014@gmail.com
-- 1. Atualizar subscription para enterprise (lowercase)
UPDATE public.user_subscriptions 
SET 
    plan = 'enterprise',
    status = 'active',
    updated_at = NOW()
WHERE user_id = '6b46fd6c-a0be-47a5-81eb-53ecb7fa9cab';

-- 2. Ajustar créditos para valor normal (100 ao invés de 999999)
UPDATE public.user_profiles 
SET 
    credits = 100,
    updated_at = NOW()
WHERE user_id = '6b46fd6c-a0be-47a5-81eb-53ecb7fa9cab';

-- Verificar resultado
SELECT 
    u.email,
    up.credits,
    us.plan as subscription_plan,
    us.status,
    ap.role as admin_role
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id  
LEFT JOIN public.user_subscriptions us ON u.id = us.user_id
LEFT JOIN public.admin_permissions ap ON u.id = ap.user_id AND ap.active = true
WHERE u.email = 'brendendood2014@gmail.com';