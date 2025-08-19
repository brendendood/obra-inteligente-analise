-- Atualizar template de confirmação com HTML anti-spam otimizado
UPDATE email_templates 
SET html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="pt">
<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Verifique sua conta MadeAI</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 20px;
      background-color: #018CFF;
      font-family: Arial, sans-serif;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 30px;
      padding: 20px;
      max-width: 600px;
      margin: auto;
    }
    .es-button {
      background: #31CB4B;
      color: #ffffff;
      font-weight: bold;
      border-radius: 15px;
      padding: 15px 30px;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
    }
    .es-button:hover {
      background: #28a73e;
    }
    .link-fallback {
      word-break: break-all;
      color: #1376C8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding-bottom: 20px;">
          <img src="https://fvlfgss.stripocdn.email/content/guids/CABINET_370106225da0f9388993368c1eb7e1b1d2aa0ebf1eed50a23d34716d8e4cad58/images/1.png" alt="Logo MadeAI" width="200" style="display:block; border:0; outline:none; text-decoration:none;">
        </td>
      </tr>
      <tr>
        <td>
          <h1 style="color:#333333; font-family: Arial, sans-serif; font-size: 24px; margin-bottom: 10px;">Verifique sua conta MadeAI.</h1>
          <hr style="border:none; border-top:1px solid #cccccc; margin: 20px 0;">
          <p style="font-size:18px; color:#333333; font-family: Arial, sans-serif; line-height: 1.5;">
            Bem vindo(a) à MadeAI, clique no botão abaixo para <strong>verificar seu e-mail</strong> e começar a explorar a Made.
          </p>
          <div style="text-align:center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" target="_blank" class="es-button">Verificar endereço de e-mail</a>
          </div>
          <p style="font-size:14px; color:#666666; font-family: Arial, sans-serif; line-height: 1.5;">
            Se o botão não funcionar, clique no link abaixo:<br>
            <a href="{{ .ConfirmationURL }}" class="link-fallback">{{ .ConfirmationURL }}</a>
          </p>
          <p style="font-size:16px; color:#333333; font-family: Arial, sans-serif; line-height: 1.5; margin-top: 30px;">
            Se você acha que recebeu esse e-mail por engano, não hesite em enviar uma mensagem para 
            <a href="mailto:contato@madeai.com.br" style="color:#1376C8; text-decoration: none;">contato@madeai.com.br</a>. 
            <strong>Nosso time de suporte 💬 irá te responder e te ajudar com isso.</strong>
          </p>
          <p style="font-size:16px; color:#333333; font-family: Arial, sans-serif; line-height: 1.5;">
            <strong>Obrigado.<br>Equipe MadeAI.</strong>
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
            <p style="font-size:12px; color:#999999; font-family: Arial, sans-serif;">
              © 2024 MadeAI. Todos os direitos reservados.<br>
              Este é um e-mail automático, não responda a esta mensagem.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>',
subject = 'Verifique sua conta MadeAI',
from_email = 'noreply@madeai.com.br',
from_name = 'MadeAI',
reply_to = 'contato@madeai.com.br',
updated_at = now()
WHERE template_key = 'signup_confirmation';