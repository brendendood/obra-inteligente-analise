-- Inserir template de reset de senha no sistema de templates gerenciáveis
INSERT INTO public.email_templates (
    template_key,
    subject, 
    html,
    description,
    category,
    enabled
) VALUES (
    'password_reset',
    'Recuperação de Senha - MadenAI',
    '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - MadenAI</title>
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">MadenAI</h1>
      <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Recuperação de Senha</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Redefinir sua senha</h2>
      
      <p style="color: #475569; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
        Você solicitou a recuperação de senha para sua conta MadenAI. Clique no botão abaixo para criar uma nova senha:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{reset_url}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
          Redefinir Senha
        </a>
      </div>
      
      <p style="color: #64748b; margin: 20px 0 0 0; font-size: 14px; line-height: 1.6;">
        Se você não solicitou esta recuperação, pode ignorar este email com segurança. Sua senha atual continuará válida.
      </p>
      
      <div style="border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0; padding-top: 20px;">
        <p style="color: #64748b; margin: 0; font-size: 14px;">
          <strong>Link alternativo:</strong><br>
          Se o botão não funcionar, copie e cole este link no seu navegador:<br>
          <a href="{{reset_url}}" style="color: #667eea; word-break: break-all;">{{reset_url}}</a>
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; margin: 0; font-size: 14px;">
        © 2024 MadenAI. Todos os direitos reservados.
      </p>
    </div>
  </div>
</body>
</html>',
    'Template para email de recuperação de senha',
    'authentication',
    true
);