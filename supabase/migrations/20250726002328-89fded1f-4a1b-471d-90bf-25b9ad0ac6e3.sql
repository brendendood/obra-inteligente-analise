-- Gamification and Referral System Implementation

-- Add referral fields to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS ref_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT,
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS has_created_first_project BOOLEAN DEFAULT FALSE;

-- Generate ref_code for existing users
UPDATE public.user_profiles 
SET ref_code = CONCAT('REF_', SUBSTRING(id::text, 1, 8))
WHERE ref_code IS NULL;

-- Create user_gamification table
CREATE TABLE IF NOT EXISTS public.user_gamification (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_level_points INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    last_action_date DATE DEFAULT CURRENT_DATE,
    last_login_date DATE DEFAULT CURRENT_DATE,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points_required INTEGER DEFAULT 0,
    action_count_required INTEGER DEFAULT 0,
    action_type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_referrals table
CREATE TABLE IF NOT EXISTS public.user_referrals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_user_id UUID NOT NULL,
    referred_user_id UUID NOT NULL,
    referral_code TEXT NOT NULL,
    credits_awarded BOOLEAN DEFAULT FALSE,
    referred_user_first_project BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gamification_logs table for audit
CREATE TABLE IF NOT EXISTS public.gamification_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type TEXT NOT NULL,
    points_awarded INTEGER DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert initial achievements
INSERT INTO public.achievements (code, name, description, icon, points_required, action_count_required, action_type) VALUES
('first_project', 'Primeiro Projeto', 'Faça upload do seu primeiro projeto', '🎯', 0, 1, 'project_created'),
('ai_expert', 'Expert IA', 'Use a IA 50 vezes', '🤖', 0, 50, 'ai_used'),
('budget_master', 'Orçamentista', 'Gere 10 orçamentos', '💰', 0, 10, 'budget_generated'),
('scheduler', 'Planejador', 'Crie 10 cronogramas', '📅', 0, 10, 'schedule_created'),
('dedicated', 'Dedicado', 'Mantenha streak de 7 dias', '🔥', 0, 7, 'daily_streak'),
('productive', 'Produtivo', 'Crie 5 projetos em um mês', '📈', 0, 5, 'monthly_projects'),
('architect', 'Arquiteto', 'Use 3 tipos diferentes de projeto', '🎨', 0, 3, 'project_types'),
('veteran', 'Veterano', 'Complete 30 dias na plataforma', '🏆', 0, 30, 'days_active'),
('innovator', 'Inovador', 'Use todas as features', '💡', 0, 4, 'features_used'),
('influencer', 'Influencer', 'Indique 10 usuários', '🤝', 0, 10, 'referrals_made')
ON CONFLICT (code) DO NOTHING;

-- Create function to calculate level from points
CREATE OR REPLACE FUNCTION public.calculate_level_from_points(points INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF points >= 4000 THEN RETURN 6; -- Mestre de Obras
    ELSIF points >= 2000 THEN RETURN 5; -- Especialista
    ELSIF points >= 1000 THEN RETURN 4; -- Engenheiro Sênior
    ELSIF points >= 500 THEN RETURN 3; -- Engenheiro Pleno
    ELSIF points >= 200 THEN RETURN 2; -- Engenheiro Jr
    ELSE RETURN 1; -- Estagiário
    END IF;
END;
$$;

-- Create function to get level info
CREATE OR REPLACE FUNCTION public.get_level_info(level_num INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    CASE level_num
        WHEN 1 THEN RETURN '{"name": "Estagiário", "min_points": 0, "max_points": 200, "icon": "🎓"}'::jsonb;
        WHEN 2 THEN RETURN '{"name": "Engenheiro Jr", "min_points": 200, "max_points": 500, "icon": "🔧"}'::jsonb;
        WHEN 3 THEN RETURN '{"name": "Engenheiro Pleno", "min_points": 500, "max_points": 1000, "icon": "⚙️"}'::jsonb;
        WHEN 4 THEN RETURN '{"name": "Engenheiro Sênior", "min_points": 1000, "max_points": 2000, "icon": "🏗️"}'::jsonb;
        WHEN 5 THEN RETURN '{"name": "Especialista", "min_points": 2000, "max_points": 4000, "icon": "🎖️"}'::jsonb;
        WHEN 6 THEN RETURN '{"name": "Mestre de Obras", "min_points": 4000, "max_points": 999999, "icon": "👑"}'::jsonb;
        ELSE RETURN '{"name": "Unknown", "min_points": 0, "max_points": 0, "icon": "❓"}'::jsonb;
    END CASE;
END;
$$;

-- Create function to award points
CREATE OR REPLACE FUNCTION public.award_points(
    target_user_id UUID,
    points INTEGER,
    action_type TEXT,
    details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    current_gamification RECORD;
    new_level INTEGER;
    level_up BOOLEAN := FALSE;
BEGIN
    -- Get current gamification data
    SELECT * INTO current_gamification 
    FROM public.user_gamification 
    WHERE user_id = target_user_id;
    
    -- If no record exists, create one
    IF current_gamification IS NULL THEN
        INSERT INTO public.user_gamification (user_id, total_points, current_level)
        VALUES (target_user_id, points, public.calculate_level_from_points(points))
        ON CONFLICT (user_id) DO UPDATE SET
            total_points = EXCLUDED.total_points,
            current_level = EXCLUDED.current_level;
    ELSE
        -- Calculate new level
        new_level := public.calculate_level_from_points(current_gamification.total_points + points);
        level_up := new_level > current_gamification.current_level;
        
        -- Update gamification data
        UPDATE public.user_gamification 
        SET 
            total_points = total_points + points,
            current_level = new_level,
            updated_at = now()
        WHERE user_id = target_user_id;
    END IF;
    
    -- Log the action
    INSERT INTO public.gamification_logs (user_id, action_type, points_awarded, details)
    VALUES (target_user_id, action_type, points, details);
    
    -- If level up, add to details for notification
    IF level_up THEN
        UPDATE public.gamification_logs 
        SET details = details || jsonb_build_object('level_up', true, 'new_level', new_level)
        WHERE user_id = target_user_id 
        AND action_type = action_type 
        AND created_at = (SELECT MAX(created_at) FROM public.gamification_logs WHERE user_id = target_user_id);
    END IF;
END;
$$;

-- Create function to handle referral signup
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    referrer_id UUID;
    ref_code TEXT;
BEGIN
    -- Extract referral code from metadata
    ref_code := NEW.raw_user_meta_data->>'ref_code';
    
    IF ref_code IS NOT NULL THEN
        -- Find the referrer
        SELECT user_id INTO referrer_id 
        FROM public.user_profiles 
        WHERE ref_code = ref_code;
        
        IF referrer_id IS NOT NULL THEN
            -- Update the new user's profile with referral info
            UPDATE public.user_profiles 
            SET referred_by = ref_code 
            WHERE user_id = NEW.id;
            
            -- Create referral record
            INSERT INTO public.user_referrals (
                referrer_user_id, 
                referred_user_id, 
                referral_code
            ) VALUES (
                referrer_id, 
                NEW.id, 
                ref_code
            );
            
            -- Award immediate points to both users
            PERFORM public.award_points(NEW.id, 50, 'signup_with_referral');
            PERFORM public.award_points(referrer_id, 25, 'successful_referral');
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for referral signup
DROP TRIGGER IF EXISTS on_referral_signup ON auth.users;
CREATE TRIGGER on_referral_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_referral_signup();

-- Enable RLS on new tables
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_gamification
CREATE POLICY "Users can view own gamification data" ON public.user_gamification
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert gamification data" ON public.user_gamification
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update gamification data" ON public.user_gamification
    FOR UPDATE USING (true);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements
    FOR SELECT USING (true);

-- RLS Policies for user_referrals
CREATE POLICY "Users can view own referrals" ON public.user_referrals
    FOR SELECT USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

CREATE POLICY "System can manage referrals" ON public.user_referrals
    FOR ALL USING (true);

-- RLS Policies for gamification_logs
CREATE POLICY "Users can view own gamification logs" ON public.gamification_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert gamification logs" ON public.gamification_logs
    FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admins can view all gamification data" ON public.user_gamification
    FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admins can view all referrals" ON public.user_referrals
    FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admins can view all gamification logs" ON public.gamification_logs
    FOR ALL USING (public.is_admin_user());