-- Remover view antiga e recriar corretamente
DROP VIEW IF EXISTS v_crm_client_stats;

-- Criar view para estatísticas de clientes com nomes corretos
CREATE OR REPLACE VIEW v_crm_client_stats AS
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

-- Garantir RLS na view
ALTER VIEW v_crm_client_stats OWNER TO postgres;

-- Criar política RLS específica para a view
GRANT SELECT ON v_crm_client_stats TO authenticated;

-- Função para obter estatísticas de cliente específico
CREATE OR REPLACE FUNCTION public.get_client_stats()
RETURNS TABLE (
    client_id UUID,
    client_name TEXT,
    projects_count BIGINT,
    total_value NUMERIC,
    last_project_date TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as client_id,
        c.name as client_name,
        COUNT(p.id) as projects_count,
        COALESCE(SUM(p.value), 0) as total_value,
        MAX(p.created_at) as last_project_date
    FROM public.crm_clients c
    LEFT JOIN public.crm_projects p ON c.id = p.client_id
    WHERE c.owner_id = auth.uid()
    GROUP BY c.id, c.name
    ORDER BY c.created_at DESC;
END;
$$;