-- ETAPA 2: Habilitar Realtime e configurar para projetos
-- Configurar REPLICA IDENTITY FULL para capturar dados completos durante updates
ALTER TABLE public.projects REPLICA IDENTITY FULL;

-- Adicionar a tabela à publicação do realtime se ainda não estiver
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;