-- Adicionar template de confirmação de email na tabela email_templates
INSERT INTO public.email_templates (
  template_key,
  subject,
  html,
  description,
  category,
  from_email,
  from_name,
  enabled
) VALUES (
  'signup_confirmation',
  '✅ Confirme sua conta na MadenAI',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme sua conta - MadenAI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
          M
        </div>
        <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">MadenAI</h1>
      </div>
      
      <!-- Conteúdo -->
      <div style="text-align: center;">
        <h2 style="color: #334155; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
          Bem-vindo, {{user_name}}! 🎉
        </h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Sua conta foi criada com sucesso! Para começar a usar a plataforma MadenAI, 
          você precisa confirmar seu endereço de email clicando no botão abaixo.
        </p>
        
        <!-- Botão de Confirmação -->
        <div style="margin: 40px 0;">
          <a href="{{confirmation_url}}" 
             style="background: linear-gradient(135deg, #2563eb, #3b82f6); 
                    color: white; 
                    padding: 16px 32px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 16px;
                    display: inline-block;
                    transition: all 0.2s;">
            ✅ Confirmar Email
          </a>
        </div>
        
        <!-- Token alternativo -->
        <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <p style="color: #475569; font-size: 14px; margin-bottom: 10px;">
            <strong>Ou use este código de confirmação:</strong>
          </p>
          <code style="font-family: ''Courier New'', monospace; 
                     background: white; 
                     border: 1px solid #e2e8f0; 
                     border-radius: 4px; 
                     padding: 8px 12px; 
                     font-size: 16px; 
                     color: #1e293b; 
                     display: inline-block;">
            {{confirmation_token}}
          </code>
        </div>
        
        <!-- Informações adicionais -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 40px;">
          <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
            Este link de confirmação expira em 24 horas. Se você não criou esta conta, 
            pode ignorar este email com segurança.
          </p>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            Precisa de ajuda? Entre em contato conosco em 
            <a href="mailto:suporte@madeai.com.br" style="color: #2563eb; text-decoration: none;">
              suporte@madeai.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #94a3b8; font-size: 12px;">
        © 2024 MadenAI. Todos os direitos reservados.
      </p>
    </div>
  </div>
</body>
</html>',
  'Template para emails de confirmação de cadastro enviados automaticamente pelo Supabase',
  'auth',
  'suporte@madeai.com.br',
  'MadenAI',
  true
) ON CONFLICT (template_key) DO UPDATE SET
  subject = EXCLUDED.subject,
  html = EXCLUDED.html,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  from_email = EXCLUDED.from_email,
  from_name = EXCLUDED.from_name,
  enabled = EXCLUDED.enabled,
  updated_at = now();