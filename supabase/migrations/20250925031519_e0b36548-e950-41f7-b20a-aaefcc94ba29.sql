-- Atualizar função para incluir dados do quiz no painel de admin
CREATE OR REPLACE FUNCTION public.get_admin_users_with_quiz_data()
RETURNS TABLE(
  profile_id uuid,
  user_id uuid,
  email text,
  full_name text,
  company text,
  phone text,
  city text,
  state text,
  country text,
  cargo text,
  avatar_url text,
  gender text,
  tags text[],
  created_at timestamp with time zone,
  last_sign_in_at timestamp with time zone,
  subscription_plan text,
  subscription_status text,
  real_location text,
  last_login_ip text,
  email_confirmed_at timestamp with time zone,
  quiz_context text,
  quiz_role text,
  quiz_challenges text[],
  quiz_completed_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id as profile_id,
    up.user_id,
    au.email,
    up.full_name,
    up.company,
    up.phone,
    up.city,
    up.state,
    up.country,
    up.cargo,
    up.avatar_url,
    up.gender,
    up.tags,
    up.created_at,
    au.last_sign_in_at,
    COALESCE(u.plan_code, 'basic') as subscription_plan,
    CASE 
      WHEN u.plan_code IS NULL THEN 'pending'
      ELSE 'active'
    END as subscription_status,
    CONCAT(
      COALESCE(ull.city, 'Não informado'), ', ',
      COALESCE(ull.region, 'Não informado'), ', ',
      COALESCE(ull.country, 'Não informado')
    ) as real_location,
    ull.ip_address::text as last_login_ip,
    au.email_confirmed_at,
    uqr.step1_context as quiz_context,
    uqr.step2_role as quiz_role,
    uqr.step3_challenge as quiz_challenges,
    uqr.created_at as quiz_completed_at
  FROM public.user_profiles up
  INNER JOIN auth.users au ON up.user_id = au.id
  LEFT JOIN public.users u ON up.user_id = u.id
  LEFT JOIN (
    SELECT DISTINCT ON (user_id) 
      user_id, city, region, country, ip_address, login_at
    FROM public.user_login_history
    WHERE city IS NOT NULL AND country IS NOT NULL
    ORDER BY user_id, login_at DESC
  ) ull ON up.user_id = ull.user_id
  LEFT JOIN public.user_quiz_responses uqr ON up.user_id = uqr.user_id
  ORDER BY up.created_at DESC;
END;
$$;