-- Criar trigger para processar recompensas de referral quando projeto é criado
CREATE OR REPLACE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_reward();

-- Processar referrals existentes retroativamente
DO $$
DECLARE
    referral_record RECORD;
    project_exists BOOLEAN;
BEGIN
    -- Para cada referral não processado
    FOR referral_record IN 
        SELECT ur.*, up.full_name as referred_user_name
        FROM public.user_referrals ur
        LEFT JOIN public.user_profiles up ON ur.referred_user_id = up.user_id
        WHERE ur.referred_user_first_project = false
    LOOP
        -- Verificar se o usuário referenciado já criou algum projeto
        SELECT EXISTS(
            SELECT 1 FROM public.projects 
            WHERE user_id = referral_record.referred_user_id
        ) INTO project_exists;
        
        -- Se criou projeto, dar +5 créditos para quem indicou
        IF project_exists THEN
            -- Adicionar 5 créditos para o referrer
            UPDATE public.user_profiles 
            SET credits = credits + 5 
            WHERE user_id = referral_record.referrer_user_id;
            
            -- Marcar referral como processado
            UPDATE public.user_referrals 
            SET referred_user_first_project = true,
                updated_at = NOW()
            WHERE id = referral_record.id;
            
            -- Log de gamificação para o referrer
            PERFORM public.award_points(
                referral_record.referrer_user_id, 
                100, 
                'referral_first_project', 
                jsonb_build_object(
                    'referred_user_id', referral_record.referred_user_id,
                    'referred_user_name', referral_record.referred_user_name,
                    'extra_projects_awarded', 5,
                    'retroactive_processing', true
                )
            );
            
            RAISE LOG 'Processed retroactive referral for user % -> %', 
                referral_record.referrer_user_id, 
                referral_record.referred_user_id;
        END IF;
    END LOOP;
END $$;