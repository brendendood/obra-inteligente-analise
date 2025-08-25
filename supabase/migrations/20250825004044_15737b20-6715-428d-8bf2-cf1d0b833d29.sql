-- Verificar se existe template de boas-vindas e criar se necessário
INSERT INTO public.email_templates (
  template_key,
  subject,
  html,
  description,
  category,
  enabled,
  created_at,
  updated_at
) VALUES (
  'welcome_user',
  '🎉 Bem-vindo à MadeAI, {{user_name}}!',
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="pt">
<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Bem-vindo à MadeAI</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #018CFF 0%, #0EA5E9 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 24px;
      padding: 40px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    .hero-section {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      width: 120px;
      height: auto;
      margin-bottom: 24px;
    }
    .welcome-title {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }
    .welcome-subtitle {
      font-size: 18px;
      color: #64748b;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }
    .cta-button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: #ffffff;
      font-weight: 600;
      border-radius: 12px;
      padding: 16px 32px;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transition: all 0.3s ease;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }
    .features-section {
      background: #f8fafc;
      border-radius: 16px;
      padding: 32px;
      margin: 32px 0;
    }
    .features-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 20px 0;
      text-align: center;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .feature-item {
      padding: 8px 0;
      color: #475569;
      font-size: 15px;
      display: flex;
      align-items: center;
    }
    .feature-icon {
      color: #22c55e;
      margin-right: 12px;
      font-weight: bold;
    }
    .footer-section {
      text-align: center;
      padding-top: 32px;
      border-top: 1px solid #e2e8f0;
      margin-top: 32px;
    }
    .footer-text {
      font-size: 14px;
      color: #94a3b8;
      margin: 8px 0;
    }
    .support-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="hero-section">
      <img src="https://fvlfgss.stripocdn.email/content/guids/CABINET_370106225da0f9388993368c1eb7e1b1d2aa0ebf1eed50a23d34716d8e4cad58/images/1.png" alt="MadeAI Logo" class="logo">
      <h1 class="welcome-title">Bem-vindo à MadeAI, {{user_name}}! 🎉</h1>
      <p class="welcome-subtitle">Sua conta foi criada com sucesso. Agora você pode explorar todo o poder da inteligência artificial para seus projetos.</p>
      <a href="{{dashboard_url}}" class="cta-button">Começar Agora</a>
    </div>

    <div class="features-section">
      <h2 class="features-title">O que você pode fazer:</h2>
      <ul class="feature-list">
        <li class="feature-item">
          <span class="feature-icon">✨</span>
          Criar e gerenciar projetos com IA
        </li>
        <li class="feature-item">
          <span class="feature-icon">🤖</span>
          Conversar com nosso assistente inteligente
        </li>
        <li class="feature-item">
          <span class="feature-icon">📊</span>
          Análises automáticas de documentos
        </li>
        <li class="feature-item">
          <span class="feature-icon">🔧</span>
          Ferramentas avançadas de produtividade
        </li>
        <li class="feature-item">
          <span class="feature-icon">📈</span>
          Relatórios e insights detalhados
        </li>
      </ul>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <p style="font-size: 16px; color: #475569; margin: 0 0 16px 0;">
        Precisa de ajuda? Nossa equipe está aqui para você!
      </p>
      <a href="mailto:suporte@madeai.com.br" class="support-link">
        Entre em contato conosco
      </a>
    </div>

    <div class="footer-section">
      <p class="footer-text">
        <strong>Obrigado por escolher a MadeAI!</strong><br>
        Equipe MadeAI 💙
      </p>
      <p class="footer-text">
        © 2024 MadeAI. Todos os direitos reservados.<br>
        Este é um e-mail automático, não responda a esta mensagem.
      </p>
    </div>
  </div>
</body>
</html>',
  'Email de boas-vindas enviado após confirmação de conta',
  'onboarding',
  true,
  now(),
  now()
) ON CONFLICT (template_key) DO UPDATE SET
  subject = EXCLUDED.subject,
  html = EXCLUDED.html,
  description = EXCLUDED.description,
  updated_at = now();