-- Atualizar templates de email para corrigir marca "MadenAI" para "MadeAI" e URLs das imagens
UPDATE email_templates 
SET 
  from_name = 'MadeAI',
  from_email = CASE 
    WHEN template_key = 'verified_user' THEN 'verificacao@madeai.com.br'
    WHEN template_key = 'onboarding_step1' THEN 'onboarding@madeai.com.br'
    WHEN template_key = 'welcome_user' THEN 'boas-vindas@madeai.com.br'
    ELSE from_email
  END,
  subject = REPLACE(subject, 'MadenAI', 'MadeAI'),
  html = REPLACE(
    REPLACE(
      REPLACE(html, 'MadenAI', 'MadeAI'),
      'src="/lovable-uploads/', 
      'src="https://mozqijzvtbuwuzgemzsm.supabase.co/storage/v1/object/public/project-files/'
    ),
    'href="/lovable-uploads/', 
    'href="https://mozqijzvtbuwuzgemzsm.supabase.co/storage/v1/object/public/project-files/'
  ),
  updated_at = now()
WHERE template_key IN ('verified_user', 'onboarding_step1', 'welcome_user');