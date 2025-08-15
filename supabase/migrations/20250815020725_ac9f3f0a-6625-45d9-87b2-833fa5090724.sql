-- Atualizar template welcome_user com design moderno e logo otimizada
UPDATE public.email_templates 
SET 
  subject = '🎉 Bem-vindo à MadenAI - Sua conta está ativa!',
  html = '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à MadenAI</title>
  <style>
    /* Force image display for Gmail */
    img { display: block !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <img src="https://madeai.com.br/lovable-uploads/b33f9843-c454-49dd-b4fb-b67df4065889.png" 
             alt="MadenAI - Gestão de Obras com IA" 
             width="120" 
             height="120"
             style="display: block !important; margin: 0 auto 20px auto; max-width: 120px; height: 120px; border-radius: 8px; object-fit: contain;" />
        <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">MadenAI</h1>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Gestão Inteligente de Obras</p>
      </div>
      
      <!-- Conteúdo Principal -->
      <div style="text-align: center;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 30px;">
          🎉
        </div>
        
        <h2 style="color: #334155; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
          Parabéns, {{user_name}}!
        </h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Sua conta foi <strong>confirmada com sucesso</strong> e já está totalmente ativa! 
          Agora você pode começar a usar todos os recursos da plataforma MadenAI.
        </p>
        
        <!-- Call to Action Principal -->
        <div style="margin: 40px 0;">
          <a href="{{dashboard_url}}" 
             style="background: linear-gradient(135deg, #2563eb, #3b82f6); 
                    color: white; 
                    padding: 16px 32px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 16px;
                    display: inline-block;
                    transition: all 0.2s;
                    border: none;
                    cursor: pointer;">
            🚀 Acessar Dashboard
          </a>
        </div>
        
        <!-- Recursos Disponíveis -->
        <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: left;">
          <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">
            🏗️ O que você pode fazer agora:
          </h3>
          
          <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
            <div style="flex: 1; min-width: 200px; background: white; border-radius: 6px; padding: 15px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
              <strong style="color: #334155; font-size: 14px;">Criar Orçamentos</strong>
              <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Gere orçamentos inteligentes com IA</p>
            </div>
            
            <div style="flex: 1; min-width: 200px; background: white; border-radius: 6px; padding: 15px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">📅</div>
              <strong style="color: #334155; font-size: 14px;">Planejar Cronogramas</strong>
              <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Organize suas obras com precisão</p>
            </div>
            
            <div style="flex: 1; min-width: 200px; background: white; border-radius: 6px; padding: 15px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🤖</div>
              <strong style="color: #334155; font-size: 14px;">Assistente IA</strong>
              <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Tire dúvidas sobre suas obras</p>
            </div>
          </div>
        </div>
        
        <!-- Próximos Passos -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 40px;">
          <h4 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            📋 Próximos passos recomendados:
          </h4>
          
          <ol style="text-align: left; color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Faça upload dos documentos do seu primeiro projeto</li>
            <li>Explore o assistente IA para tirar dúvidas</li>
            <li>Gere seu primeiro orçamento automatizado</li>
            <li>Configure o cronograma da obra</li>
          </ol>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            Precisa de ajuda? Entre em contato conosco em 
            <a href="mailto:{{support_email}}" style="color: #2563eb; text-decoration: none;">
              {{support_email}}
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
  updated_at = now()
WHERE template_key = 'welcome_user' AND enabled = true;