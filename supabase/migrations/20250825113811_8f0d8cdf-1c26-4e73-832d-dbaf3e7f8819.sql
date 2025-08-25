-- Criar view para estatísticas dos clientes CRM
CREATE OR REPLACE VIEW public.v_crm_client_stats AS
SELECT 
    c.id as client_id,
    c.name as client_name,
    c.owner_id,
    COUNT(p.id) as projects_count,
    COALESCE(SUM(p.value), 0) as total_value,
    MAX(p.created_at) as last_project_date,
    c.status as client_status,
    c.company as client_company,
    c.email as client_email,
    c.phone as client_phone,
    c.created_at as client_created_at
FROM public.crm_clients c
LEFT JOIN public.crm_projects p ON c.id = p.client_id
GROUP BY c.id, c.name, c.owner_id, c.status, c.company, c.email, c.phone, c.created_at
ORDER BY c.created_at DESC;