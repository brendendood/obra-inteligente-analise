-- Inserir template padrão de verificação de email
INSERT INTO public.email_templates (
    template_key,
    subject,
    html,
    description,
    category,
    from_email,
    from_name,
    locale,
    enabled
) VALUES (
    'verified_user',
    '✉️ Confirme seu email - {{app_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirme seu Email - {{app_name}}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 40px 20px; }
        .title { color: #2d3748; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .text { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; text-align: center; }
        .verification-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .footer { background: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
        .security-notice { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .security-notice-text { color: #dc2626; font-size: 14px; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{app_name}}</div>
            <div class="header-subtitle">Confirme seu email para ativar sua conta</div>
        </div>
        
        <div class="content">
            <h1 class="title">Confirme seu email, {{full_name}}! ✉️</h1>
            
            <p class="text">
                Obrigado por se cadastrar na {{app_name}}! Para garantir a segurança da sua conta e ter acesso completo à plataforma, você precisa confirmar seu endereço de email.
            </p>
            
            <div class="verification-box">
                <p style="margin: 0 0 15px 0; color: #374151; font-weight: 500;">
                    Clique no botão abaixo para confirmar seu email:
                </p>
                <a href="{{verification_url}}" class="cta-button" style="display: inline-block;">
                    ✅ Confirmar Email
                </a>
            </div>
            
            <p class="text">
                Após a confirmação, você terá acesso completo aos recursos da {{app_name}}:
            </p>
            
            <ul style="color: #4a5568; line-height: 1.8; margin-left: 20px;">
                <li>🤖 Assistente de IA especializado em construção</li>
                <li>💰 Geração automática de orçamentos</li>
                <li>📅 Cronogramas inteligentes</li>
                <li>📊 Análises detalhadas de projetos</li>
            </ul>
            
            <div class="security-notice">
                <p class="security-notice-text">
                    <strong>⚠️ Importante:</strong> Este link expira em 24 horas. Se não confirmou a tempo, você pode solicitar um novo email de confirmação.
                </p>
            </div>
            
            <p class="text" style="font-size: 14px; color: #6b7280;">
                Se você não criou uma conta na {{app_name}}, pode ignorar este email com segurança.
            </p>
        </div>
        
        <div class="footer">
            <p style="color: #718096; margin-bottom: 10px;">
                Precisa de ajuda? Entre em contato conosco!
            </p>
            <p style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                © 2024 {{app_name}}. Todos os direitos reservados.
            </p>
        </div>
    </div>
</body>
</html>',
    'Template para verificação de email de novos usuários',
    'verification',
    'noreply@madeai.com.br',
    'MadenAI Verificação',
    'pt-BR',
    true
) ON CONFLICT (template_key, locale) DO UPDATE SET
    subject = EXCLUDED.subject,
    html = EXCLUDED.html,
    description = EXCLUDED.description,
    updated_at = now();