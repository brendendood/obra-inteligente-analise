
import React from 'react';
import { EmailTemplateBase } from '../EmailTemplateBase';

interface WelcomeEmailProps {
  userName: string;
  loginUrl: string;
}

export const WelcomeEmail = ({ userName, loginUrl }: WelcomeEmailProps) => {
  return (
    <EmailTemplateBase
      title="Bem-vindo à MadenAI!"
      previewText="Sua conta foi criada com sucesso. Comece a usar nossa plataforma de IA para análise de obras."
      ctaText="Acessar Plataforma"
      ctaUrl={loginUrl}
    >
      <p>Olá, <strong>{userName}</strong>!</p>
      <p>
        Seja muito bem-vindo à <strong>MadenAI</strong>, a plataforma de gestão e análise 
        de obras com inteligência artificial mais avançada do mercado.
      </p>
      <p>
        Sua conta foi criada com sucesso e você já pode começar a usar todas as 
        funcionalidades disponíveis:
      </p>
      <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '8px' }}>📊 Análise automática de projetos com IA</li>
        <li style={{ marginBottom: '8px' }}>💰 Geração de orçamentos detalhados</li>
        <li style={{ marginBottom: '8px' }}>📅 Cronogramas inteligentes</li>
        <li style={{ marginBottom: '8px' }}>🤖 Assistente virtual especializado</li>
        <li style={{ marginBottom: '8px' }}>📄 Gestão completa de documentos</li>
      </ul>
      <p>
        Estamos aqui para revolucionar a forma como você gerencia seus projetos. 
        Qualquer dúvida, nossa equipe de suporte está sempre disponível.
      </p>
    </EmailTemplateBase>
  );
};
