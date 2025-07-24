-- Habilitar Realtime para a tabela projects
-- Configurar REPLICA IDENTITY FULL para capturar dados completos durante updates
ALTER TABLE public.projects REPLICA IDENTITY FULL;

-- Adicionar a tabela à publicação do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;