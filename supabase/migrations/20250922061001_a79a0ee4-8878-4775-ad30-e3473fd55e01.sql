-- Teste final: criar uma entrada temporária para validar se o trigger funciona
-- Esta entrada será removida automaticamente após o teste

-- Primeiro criar um teste de inserção simulado
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_project_record record;
BEGIN
    -- Testar inserção na tabela projects
    INSERT INTO public.projects (
        user_id,
        name,
        file_path,
        project_status,
        city,
        state,
        country
    ) VALUES (
        test_user_id,
        'TESTE_TRIGGER_SYNC',
        'test/path.pdf',
        'draft',
        'Test City',
        'Test State',
        'Brasil'
    ) RETURNING * INTO test_project_record;
    
    -- Verificar se o trigger criou entrada correspondente no CRM
    IF EXISTS (
        SELECT 1 FROM public.crm_projects 
        WHERE owner_id = test_user_id 
        AND name = 'TESTE_TRIGGER_SYNC'
        AND client_id IS NULL
    ) THEN
        RAISE NOTICE 'TESTE PASSOU: Trigger de sincronização funcionando corretamente';
    ELSE
        RAISE EXCEPTION 'TESTE FALHOU: Trigger não sincronizou projeto para CRM';
    END IF;
    
    -- Limpar dados de teste
    DELETE FROM public.crm_projects WHERE owner_id = test_user_id;
    DELETE FROM public.projects WHERE user_id = test_user_id;
    
    RAISE NOTICE 'SUCESSO: Sistema de upload corrigido e testado com sucesso';
END;
$$;