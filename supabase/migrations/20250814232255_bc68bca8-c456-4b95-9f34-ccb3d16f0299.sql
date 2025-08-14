-- Limpeza completa de usuários - manter apenas brendendood2014@gmail.com
-- ATENÇÃO: Esta operação é IRREVERSÍVEL

DO $$
DECLARE
    admin_user_id uuid;
    deleted_count integer;
BEGIN
    -- Capturar o user_id do admin que deve ser mantido
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'brendendood2014@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'ERRO: Usuário brendendood2014@gmail.com não encontrado!';
    END IF;
    
    RAISE NOTICE 'Admin user_id encontrado: %', admin_user_id;
    
    -- FASE 1: Deletar dados de projetos (cascata automática)
    DELETE FROM projects WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Projetos deletados: %', deleted_count;
    
    -- FASE 2: Deletar conversas AI
    DELETE FROM ai_conversations WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Conversas AI deletadas: %', deleted_count;
    
    -- FASE 3: Deletar mensagens AI órfãs (se houver)
    DELETE FROM ai_messages WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Mensagens AI deletadas: %', deleted_count;
    
    -- FASE 4: Deletar histórico de chat N8N
    DELETE FROM n8n_chat_histories WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Histórico N8N deletado: %', deleted_count;
    
    -- FASE 5: Deletar dados de gamificação
    DELETE FROM gamification_logs WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Logs de gamificação deletados: %', deleted_count;
    
    DELETE FROM user_gamification WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Dados de gamificação deletados: %', deleted_count;
    
    -- FASE 6: Deletar histórico de login
    DELETE FROM user_login_history WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Histórico de login deletado: %', deleted_count;
    
    -- FASE 7: Deletar analytics
    DELETE FROM user_analytics WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Analytics deletados: %', deleted_count;
    
    DELETE FROM user_analytics_enhanced WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Analytics enhanced deletados: %', deleted_count;
    
    -- FASE 8: Deletar pagamentos
    DELETE FROM user_payments WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Pagamentos deletados: %', deleted_count;
    
    DELETE FROM payments WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Registros de pagamento deletados: %', deleted_count;
    
    -- FASE 9: Deletar logs de acesso ao chat
    DELETE FROM chat_access_logs WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Logs de acesso ao chat deletados: %', deleted_count;
    
    -- FASE 10: Deletar métricas de AI
    DELETE FROM ai_usage_metrics WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Métricas de AI deletadas: %', deleted_count;
    
    -- FASE 11: Deletar segmentos de usuário
    DELETE FROM user_segments WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Segmentos de usuário deletados: %', deleted_count;
    
    -- FASE 12: Deletar documentos de projeto (se houver)
    DELETE FROM project_documents WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Documentos de projeto deletados: %', deleted_count;
    
    -- FASE 13: Deletar logs de impersonação (manter apenas do admin)
    DELETE FROM admin_impersonation_logs WHERE admin_id != admin_user_id AND user_impersonated_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Logs de impersonação deletados: %', deleted_count;
    
    -- FASE 14: Deletar assinaturas de usuários
    DELETE FROM user_subscriptions WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Assinaturas deletadas: %', deleted_count;
    
    -- FASE 15: Deletar perfis de usuários
    DELETE FROM user_profiles WHERE user_id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Perfis de usuário deletados: %', deleted_count;
    
    -- FASE 16: Deletar usuários da auth (cascata final)
    DELETE FROM auth.users WHERE id != admin_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Usuários auth deletados: %', deleted_count;
    
    -- VERIFICAÇÃO FINAL
    SELECT COUNT(*) INTO deleted_count FROM auth.users;
    RAISE NOTICE 'RESULTADO: % usuário(s) restante(s) no sistema', deleted_count;
    
    -- Confirmar que só sobrou o admin
    IF deleted_count = 1 THEN
        RAISE NOTICE 'SUCESSO: Limpeza concluída. Apenas brendendood2014@gmail.com permanece no sistema.';
    ELSE
        RAISE EXCEPTION 'ERRO: % usuários restantes. Esperado: 1', deleted_count;
    END IF;
    
END $$;