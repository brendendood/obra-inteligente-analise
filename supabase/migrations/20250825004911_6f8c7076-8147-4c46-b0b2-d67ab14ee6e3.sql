-- Fix critical security vulnerability in admin_users table
-- Current policy allows any user to access admin data if emails match
-- This is a serious security flaw that could expose admin information

-- Drop the insecure existing policy
DROP POLICY IF EXISTS "Admin users can view own data" ON public.admin_users;

-- Create secure policies that only allow proper admin users to access admin data
-- Only superusers can view admin user data
CREATE POLICY "Only superusers can view admin users" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (public.is_superuser());

-- Only superusers can manage (insert, update, delete) admin users
CREATE POLICY "Only superusers can manage admin users" 
ON public.admin_users 
FOR ALL 
TO authenticated
USING (public.is_superuser())
WITH CHECK (public.is_superuser());

-- Additional security: Create a view for safe admin user access
-- This view only exposes necessary information and adds an extra layer of security
CREATE OR REPLACE VIEW public.safe_admin_users AS
SELECT 
    id,
    email,
    full_name,
    is_active,
    created_at,
    last_login
FROM public.admin_users
WHERE public.is_superuser() = true;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.safe_admin_users TO authenticated;

-- Add RLS to the view for extra security
ALTER VIEW public.safe_admin_users SET (security_barrier = true);