-- Corrigir a Security Definer View removendo SECURITY DEFINER
DROP VIEW IF EXISTS v_crm_client_stats;

-- Criar view sem SECURITY DEFINER (para corrigir o erro de segurança)
CREATE VIEW v_crm_client_stats AS
SELECT 
    c.id as client_id,
    c.name as client_name,
    COUNT(p.id) as projects_count,
    COALESCE(SUM(p.value), 0) as total_value,
    MAX(p.created_at) as last_project_date
FROM public.crm_clients c
LEFT JOIN public.crm_projects p ON c.id = p.client_id
WHERE c.owner_id = auth.uid()
GROUP BY c.id, c.name;