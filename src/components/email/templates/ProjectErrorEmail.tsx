
import React from 'react';
import { EmailTemplateBase } from '../EmailTemplateBase';

interface ProjectErrorEmailProps {
  userName: string;
  projectName: string;
  errorDetails: string;
  supportUrl: string;
}

export const ProjectErrorEmail = ({ 
  userName, 
  projectName, 
  errorDetails, 
  supportUrl 
}: ProjectErrorEmailProps) => {
  return (
    <EmailTemplateBase
      title="Erro no Processamento do Projeto"
      previewText={`Encontramos um problema ao processar seu projeto "${projectName}". Nossa equipe está trabalhando na solução.`}
      ctaText="Contatar Suporte"
      ctaUrl={supportUrl}
    >
      <p>Olá, <strong>{userName}</strong>!</p>
      <p>
        Infelizmente, encontramos um problema ao processar seu projeto 
        <strong> "{projectName}"</strong> em nossa plataforma.
      </p>
      <div style={{ 
        background: '#fee2e2', 
        border: '1px solid #ef4444', 
        borderRadius: '8px', 
        padding: '20px', 
        margin: '20px 0' 
      }}>
        <p style={{ margin: 0, color: '#dc2626', fontWeight: 'bold' }}>
          ⚠️ Erro Detectado
        </p>
        <p style={{ margin: '10px 0 0 0', color: '#dc2626', fontSize: '14px' }}>
          {errorDetails}
        </p>
      </div>
      <p>
        <strong>O que estamos fazendo:</strong>
      </p>
      <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '8px' }}>Nossa equipe técnica foi notificada automaticamente</li>
        <li style={{ marginBottom: '8px' }}>Estamos investigando a causa do problema</li>
        <li style={{ marginBottom: '8px' }}>Trabalharemos para processar seu projeto o mais rápido possível</li>
      </ul>
      <p>
        <strong>O que você pode fazer:</strong>
      </p>
      <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '8px' }}>Verificar se o arquivo está no formato correto (PDF, DWG, etc.)</li>
        <li style={{ marginBottom: '8px' }}>Tentar fazer upload novamente em alguns minutos</li>
        <li style={{ marginBottom: '8px' }}>Entrar em contato conosco se o problema persistir</li>
      </ul>
      <p>
        Pedimos desculpas pelo inconveniente e agradecemos sua paciência. Nossa equipe 
        de suporte está disponível 24/7 para ajudá-lo.
      </p>
    </EmailTemplateBase>
  );
};
