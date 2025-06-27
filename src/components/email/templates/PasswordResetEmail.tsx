
import React from 'react';
import { EmailTemplateBase } from '../EmailTemplateBase';

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({ userName, resetUrl }: PasswordResetEmailProps) => {
  return (
    <EmailTemplateBase
      title="Redefinição de Senha"
      previewText="Solicitação de redefinição de senha para sua conta MadenAI."
      ctaText="Redefinir Senha"
      ctaUrl={resetUrl}
    >
      <p>Olá, <strong>{userName}</strong>!</p>
      <p>
        Recebemos uma solicitação para redefinir a senha da sua conta na 
        <strong> MadenAI</strong>.
      </p>
      <p>
        Se você fez esta solicitação, clique no botão abaixo para criar uma nova senha. 
        Este link é válido por <strong>24 horas</strong>.
      </p>
      <div style={{ 
        background: '#fef3c7', 
        border: '1px solid #f59e0b', 
        borderRadius: '8px', 
        padding: '15px', 
        margin: '20px 0' 
      }}>
        <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
          ⚠️ <strong>Importante:</strong> Se você não solicitou esta redefinição, 
          ignore este e-mail. Sua senha permanecerá inalterada.
        </p>
      </div>
      <p>
        Por segurança, recomendamos que você escolha uma senha forte e única para 
        proteger sua conta.
      </p>
    </EmailTemplateBase>
  );
};
