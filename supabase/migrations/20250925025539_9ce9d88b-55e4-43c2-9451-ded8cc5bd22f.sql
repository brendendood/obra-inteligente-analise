-- 1. Migrar todos os usuários free para basic
UPDATE users 
SET plan_code = 'basic' 
WHERE plan_code = 'free' OR plan_code IS NULL;

-- 2. Criar tabela para respostas do quiz
CREATE TABLE public.user_quiz_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    step1_context TEXT NOT NULL,
    step2_role TEXT NOT NULL,
    step3_challenge TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Adicionar RLS para quiz responses
ALTER TABLE public.user_quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own quiz responses" 
ON public.user_quiz_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quiz responses" 
ON public.user_quiz_responses 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Adicionar campos de controle no user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN quiz_completed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN plan_selected BOOLEAN NOT NULL DEFAULT false;

-- 5. Marcar usuários existentes como completados (para não quebrar o fluxo)
UPDATE public.user_profiles 
SET quiz_completed = true, plan_selected = true 
WHERE user_id IS NOT NULL;