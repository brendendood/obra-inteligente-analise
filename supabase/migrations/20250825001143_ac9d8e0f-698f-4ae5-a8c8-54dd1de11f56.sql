-- Criar função para inserir clientes CRM
CREATE OR REPLACE FUNCTION public.insert_crm_client(
    p_name text,
    p_email text DEFAULT NULL,
    p_phone text DEFAULT NULL,
    p_company text DEFAULT NULL,
    p_status text DEFAULT 'prospect',
    p_avatar text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    new_client_id uuid;
BEGIN
    -- Inserir novo cliente
    INSERT INTO public.crm_clients (
        owner_id,
        name,
        email,
        phone,
        company,
        status,
        avatar,
        created_at,
        updated_at
    )
    VALUES (
        auth.uid(),
        p_name,
        p_email,
        p_phone,
        p_company,
        p_status,
        p_avatar,
        now(),
        now()
    )
    RETURNING id INTO new_client_id;
    
    RETURN new_client_id;
END;
$$;