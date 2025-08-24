-- Corrigir políticas RLS das tabelas CRM
-- Primeiro, remover políticas existentes problemáticas
DROP POLICY IF EXISTS "crm_clients_modify_own" ON public.crm_clients;
DROP POLICY IF EXISTS "crm_clients_select_own" ON public.crm_clients;
DROP POLICY IF EXISTS "crm_projects_modify_own" ON public.crm_projects;
DROP POLICY IF EXISTS "crm_projects_select_own" ON public.crm_projects;

-- Criar políticas RLS corretas para crm_clients
CREATE POLICY "Users can create their own clients" 
ON public.crm_clients 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view their own clients" 
ON public.crm_clients 
FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own clients" 
ON public.crm_clients 
FOR UPDATE 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own clients" 
ON public.crm_clients 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Criar políticas RLS corretas para crm_projects
CREATE POLICY "Users can create their own projects" 
ON public.crm_projects 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view their own projects" 
ON public.crm_projects 
FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects" 
ON public.crm_projects 
FOR UPDATE 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects" 
ON public.crm_projects 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Criar view para estatísticas de clientes (se não existir)
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

-- Garantir que a view tenha RLS adequada
CREATE POLICY "Users can view their own client stats" 
ON public.crm_clients 
FOR SELECT 
USING (auth.uid() = owner_id);

-- Criar função para facilitar inserção de clientes (garante owner_id)
CREATE OR REPLACE FUNCTION public.insert_crm_client(
    p_name TEXT,
    p_email TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_company TEXT DEFAULT NULL,
    p_status TEXT DEFAULT 'prospect',
    p_avatar TEXT DEFAULT NULL
) RETURNS public.crm_clients
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_client crm_clients;
BEGIN
    INSERT INTO public.crm_clients (
        owner_id, name, email, phone, company, status, avatar
    ) VALUES (
        auth.uid(), p_name, p_email, p_phone, p_company, p_status, p_avatar
    ) RETURNING * INTO new_client;
    
    RETURN new_client;
END;
$$;

-- Criar função para facilitar inserção de projetos (garante owner_id)
CREATE OR REPLACE FUNCTION public.insert_crm_project(
    p_name TEXT,
    p_client_id UUID,
    p_value NUMERIC DEFAULT 0,
    p_status TEXT DEFAULT 'planning',
    p_start_date DATE DEFAULT CURRENT_DATE,
    p_end_date DATE DEFAULT NULL,
    p_description TEXT DEFAULT NULL
) RETURNS public.crm_projects
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_project crm_projects;
BEGIN
    -- Verificar se o cliente pertence ao usuário atual
    IF NOT EXISTS (
        SELECT 1 FROM public.crm_clients 
        WHERE id = p_client_id AND owner_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Cliente não encontrado ou sem permissão';
    END IF;
    
    INSERT INTO public.crm_projects (
        owner_id, name, client_id, value, status, start_date, end_date, description
    ) VALUES (
        auth.uid(), p_name, p_client_id, p_value, p_status, p_start_date, p_end_date, p_description
    ) RETURNING * INTO new_project;
    
    RETURN new_project;
END;
$$;