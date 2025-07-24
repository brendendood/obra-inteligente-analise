-- Fix critical security issue: Add RLS policy to coupons table
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for coupons table
CREATE POLICY "Users can view their own coupons" 
ON public.coupons 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own coupons" 
ON public.coupons 
FOR UPDATE 
USING (user_id = auth.uid());

-- Admin can view all coupons (if needed)
CREATE POLICY "Admins can view all coupons" 
ON public.coupons 
FOR SELECT 
USING (is_admin_user());

-- Fix database functions security: Add missing search_path to functions
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Atualizar user_metadata no auth.users quando user_profiles for alterado
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'full_name', NEW.full_name,
    'company', NEW.company,
    'phone', NEW.phone,
    'city', NEW.city,
    'state', NEW.state,
    'country', NEW.country,
    'avatar_url', NEW.avatar_url,
    'avatar_type', NEW.avatar_type,
    'gender', NEW.gender,
    'cargo', NEW.cargo,
    'empresa', NEW.empresa
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    full_name,
    company,
    cargo,
    avatar_url,
    avatar_type,
    gender
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'cargo', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'avatar_type', 'initials'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'male')
  );
  
  -- Inserir assinatura FREE como padrão
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$function$;