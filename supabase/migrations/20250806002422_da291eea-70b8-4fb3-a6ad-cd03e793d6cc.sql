-- Adicionar coluna user_id na tabela ai_messages
ALTER TABLE public.ai_messages ADD COLUMN user_id uuid;

-- Popular dados existentes com user_id através de JOIN com ai_conversations
UPDATE public.ai_messages 
SET user_id = (
    SELECT ac.user_id 
    FROM public.ai_conversations ac 
    WHERE ac.id = ai_messages.conversation_id
);

-- Tornar campo obrigatório após popular os dados
ALTER TABLE public.ai_messages ALTER COLUMN user_id SET NOT NULL;

-- Adicionar política RLS direta para melhor performance
CREATE POLICY "Users can view their own messages directly" 
  ON public.ai_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Adicionar política para inserção com user_id
CREATE POLICY "Users can create messages with their own user_id" 
  ON public.ai_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Adicionar índice para melhor performance
CREATE INDEX idx_ai_messages_user_id ON public.ai_messages(user_id);