-- Solucionar problema do client_id na sincronização de projetos para CRM

-- 1. Primeiro, remover o trigger problemático temporariamente
DROP TRIGGER IF EXISTS trigger_sync_project_to_crm ON public.projects;

-- 2. Modificar a tabela crm_projects para permitir client_id como nullable
ALTER TABLE public.crm_projects ALTER COLUMN client_id DROP NOT NULL;

-- 3. Recriar a função de sincronização com tratamento adequado
CREATE OR REPLACE FUNCTION public.sync_project_to_crm()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Inserir projeto correspondente na tabela crm_projects
    -- client_id será NULL para projetos que não têm cliente associado
    INSERT INTO public.crm_projects (
        owner_id,
        name,
        client_id,  -- será NULL para projetos normais
        status,
        value,
        start_date,
        end_date,
        description,
        created_at,
        updated_at
    ) VALUES (
        NEW.user_id,                                    -- owner_id = user_id do projeto
        NEW.name,                                       -- nome do projeto
        NULL,                                           -- client_id = NULL (projetos podem não ter cliente)
        CASE 
            WHEN NEW.project_status = 'completed' THEN 'completed'
            WHEN NEW.project_status = 'in_progress' THEN 'in_progress' 
            ELSE 'planning'
        END,                                            -- status mapeado
        COALESCE(NEW.estimated_budget, 0),             -- valor estimado
        COALESCE(NEW.start_date, CURRENT_DATE),        -- data de início
        NEW.end_date,                                   -- data de término
        NEW.description,                                -- descrição
        NEW.created_at,                                 -- mantém data de criação original
        NEW.updated_at                                  -- mantém data de atualização
    );
    
    RETURN NEW;
END;
$$;

-- 4. Recriar o trigger com a função corrigida
CREATE TRIGGER trigger_sync_project_to_crm
    AFTER INSERT ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_project_to_crm();

-- 5. Também corrigir a função de atualização para não quebrar se não encontrar registros
CREATE OR REPLACE FUNCTION public.sync_project_update_to_crm()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Atualizar projeto correspondente na tabela crm_projects (se existir)
    UPDATE public.crm_projects 
    SET 
        name = NEW.name,
        status = CASE 
            WHEN NEW.project_status = 'completed' THEN 'completed'
            WHEN NEW.project_status = 'in_progress' THEN 'in_progress' 
            ELSE 'planning'
        END,
        value = COALESCE(NEW.estimated_budget, 0),
        start_date = COALESCE(NEW.start_date, CURRENT_DATE),
        end_date = NEW.end_date,
        description = NEW.description,
        updated_at = NEW.updated_at
    WHERE owner_id = NEW.user_id 
    AND name = OLD.name
    AND created_at = NEW.created_at;  -- usar created_at para identificar o projeto correto
    
    -- Se não encontrou o registro para atualizar, não faz nada (não há erro)
    
    RETURN NEW;
END;
$$;