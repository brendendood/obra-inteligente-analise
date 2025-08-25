-- Criar função para inserir projetos CRM  
CREATE OR REPLACE FUNCTION public.insert_crm_project(
    p_name text,
    p_client_id uuid,
    p_value numeric DEFAULT 0,
    p_status text DEFAULT 'planning',
    p_start_date date DEFAULT CURRENT_DATE,
    p_end_date date DEFAULT NULL,
    p_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    new_project_id uuid;
BEGIN
    -- Verificar se o cliente pertence ao usuário atual
    IF NOT EXISTS (
        SELECT 1 FROM public.crm_clients 
        WHERE id = p_client_id AND owner_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Cliente não encontrado ou sem permissão';
    END IF;
    
    -- Inserir novo projeto
    INSERT INTO public.crm_projects (
        owner_id,
        name,
        client_id,
        value,
        status,
        start_date,
        end_date,
        description,
        created_at,
        updated_at
    )
    VALUES (
        auth.uid(),
        p_name,
        p_client_id,
        p_value,
        p_status,
        p_start_date,
        p_end_date,
        p_description,
        now(),
        now()
    )
    RETURNING id INTO new_project_id;
    
    RETURN new_project_id;
END;
$$;