-- Fix Security Definer View issues by using security_invoker = true
-- This ensures views respect RLS policies from the underlying tables

-- Drop existing views
DROP VIEW IF EXISTS public.safe_admin_users CASCADE;
DROP VIEW IF EXISTS public.v_crm_client_stats CASCADE;
DROP VIEW IF EXISTS public.v_project_summary CASCADE;

-- Recreate views with security_invoker = true to respect RLS
CREATE VIEW public.safe_admin_users
WITH (security_invoker = true) AS
SELECT 
    id,
    email,
    full_name,
    is_active,
    created_at,
    last_login
FROM public.admin_users;

-- Recreate v_crm_client_stats view with security_invoker
CREATE VIEW public.v_crm_client_stats
WITH (security_invoker = true) AS
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
GROUP BY c.id, c.name, c.owner_id, c.status, c.company, c.email, c.phone, c.created_at
ORDER BY c.created_at DESC;

-- Recreate v_project_summary view with security_invoker
CREATE VIEW public.v_project_summary
WITH (security_invoker = true) AS
WITH bi AS (
    SELECT 
        project_id,
        COUNT(*) AS total_items,
        COALESCE(SUM(subtotal), 0::numeric) AS total_budget
    FROM public.project_budget_items
    GROUP BY project_id
), st AS (
    SELECT 
        project_id,
        COUNT(*) AS total_stages
    FROM public.project_schedule_tasks
    GROUP BY project_id
), stc AS (
    SELECT 
        project_id,
        COUNT(*) AS stages_completed
    FROM public.project_schedule_tasks
    WHERE status = 'concluido'::text
    GROUP BY project_id
), range AS (
    SELECT 
        project_id,
        MIN(start_date) AS overall_start,
        MAX(end_date) AS overall_end
    FROM public.project_schedule_tasks
    GROUP BY project_id
)
SELECT 
    p.id AS project_id,
    COALESCE(bi.total_items, 0::bigint) AS total_items,
    COALESCE(bi.total_budget, 0::numeric) AS total_budget,
    COALESCE(st.total_stages, 0::bigint) AS total_stages,
    COALESCE(stc.stages_completed, 0::bigint) AS stages_completed,
    CASE
        WHEN COALESCE(st.total_stages, 0::bigint) > 0 
        THEN ROUND(COALESCE(stc.stages_completed, 0::bigint)::numeric / st.total_stages::numeric * 100::numeric, 2)
        ELSE 0::numeric
    END AS progress_percent,
    range.overall_start,
    range.overall_end
FROM public.projects p
LEFT JOIN bi ON bi.project_id = p.id
LEFT JOIN st ON st.project_id = p.id
LEFT JOIN stc ON stc.project_id = p.id
LEFT JOIN range ON range.project_id = p.id;