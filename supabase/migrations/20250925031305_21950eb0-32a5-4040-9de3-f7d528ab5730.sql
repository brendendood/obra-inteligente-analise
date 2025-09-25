-- Atualizar a tabela user_quiz_responses para permitir múltiplas seleções na etapa 3
ALTER TABLE public.user_quiz_responses 
ALTER COLUMN step3_challenge TYPE text[] USING string_to_array(step3_challenge, ',');