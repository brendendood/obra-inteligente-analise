-- Reset all user avatars to use initials system
UPDATE user_profiles 
SET 
  avatar_url = NULL,
  avatar_type = 'initials'
WHERE avatar_url IS NOT NULL OR avatar_type != 'initials';

-- Update the trigger to always set initials avatar for new users
DROP FUNCTION IF EXISTS public.handle_new_user_profile() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert profile with initials avatar system
  INSERT INTO public.user_profiles (
    user_id, 
    full_name,
    avatar_url,
    avatar_type
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NULL, -- Always null to force initials generation
    'initials'
  );
  
  -- Insert free subscription as default
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();