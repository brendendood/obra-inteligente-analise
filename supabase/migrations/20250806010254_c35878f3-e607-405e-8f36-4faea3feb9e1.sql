-- Ativar realtime na tabela ai_messages
ALTER TABLE public.ai_messages REPLICA IDENTITY FULL;

-- Adicionar tabela à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_messages;