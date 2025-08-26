-- Fix Security Definer View issues
-- Remove views that bypass RLS through SECURITY DEFINER functions

-- Drop the problematic views first
DROP VIEW IF EXISTS public.safe_admin_users;
DROP VIEW IF EXISTS public.v_crm_client_stats;

-- Recreate safe_admin_users view without security definer functions
-- Instead of using is_superuser(), we'll rely on RLS policies on the underlying table
CREATE OR REPLACE VIEW public.safe_admin_users AS
SELECT 
    id,
    email,
    full_name,
    is_active,
    created_at,
    last_login
FROM public.admin_users;

-- Enable RLS on the safe_admin_users view (views inherit RLS from base tables)
-- The admin_users table should have proper RLS policies

-- Recreate v_crm_client_stats view - this one is actually safe as it doesn't use security definer functions
-- But let's make sure it's properly secured with RLS
CREATE OR REPLACE VIEW public.v_crm_client_stats AS
SELECT 
    c.id AS client_id,
    c.name AS client_name,
    c.owner_id,
    COUNT(p.id) AS projects_count,
    COALESCE(SUM(p.value), 0::numeric) AS total_value,
    MAX(p.created_at) AS last_project_date,
    c.status AS client_status,
    c.company AS client_company,
    c.email AS client_email,
    c.phone AS client_phone,
    c.created_at AS client_created_at
FROM public.crm_clients c
LEFT JOIN public.crm_projects p ON c.id = p.client_id
WHERE c.owner_id = auth.uid()  -- Add explicit RLS filter
GROUP BY c.id, c.name, c.owner_id, c.status, c.company, c.email, c.phone, c.created_at
ORDER BY c.created_at DESC;

-- Add RLS policies for the admin_users table if they don't exist
-- This ensures safe_admin_users view is properly secured
DO $$
BEGIN
    -- Check if RLS is enabled on admin_users
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' 
        AND c.relname = 'admin_users'
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Add policy for superusers to view admin_users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'admin_users' 
        AND policyname = 'Superusers can view admin users'
    ) THEN
        CREATE POLICY "Superusers can view admin users" ON public.admin_users
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.admin_permissions 
                WHERE user_id = auth.uid() 
                AND active = true 
                AND role = 'super_admin'
            )
        );
    END IF;
END $$;