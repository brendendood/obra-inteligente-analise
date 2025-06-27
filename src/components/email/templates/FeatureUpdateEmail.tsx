
import React from 'react';
import { EmailTemplateBase } from '../EmailTemplateBase';

interface FeatureUpdateEmailProps {
  userName: string;
  featureTitle: string;
  featureDescription: string;
  platformUrl: string;
}

export const FeatureUpdateEmail = ({ 
  userName, 
  featureTitle, 
  featureDescription, 
  platformUrl 
}: FeatureUpdateEmailProps) => {
  return (
    <EmailTemplateBase
      title="Nova Funcionalidade Disponível!"
      previewText={`Descubra a nova funcionalidade "${featureTitle}" na MadenAI.`}
      ctaText="Explorar Novidades"
      ctaUrl={platformUrl}
    >
      <p>Olá, <strong>{userName}</strong>!</p>
      <p>
        Temos o prazer de anunciar uma nova funcionalidade na <strong>MadenAI</strong> 
        que vai tornar sua experiência ainda melhor!
      </p>
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #0ea5e9', 
        borderRadius: '8px', 
        padding: '20px', 
        margin: '20px 0' 
      }}>
        <p style={{ margin: 0, color: '#0c4a6e', fontWeight: 'bold', fontSize: '18px' }}>
          🚀 {featureTitle}
        </p>
        <p style={{ margin: '10px 0 0 0', color: '#0c4a6e', fontSize: '15px' }}>
          {featureDescription}
        </p>
      </div>
      <p>
        <strong>Por que isso é importante para você:</strong>
      </p>
      <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '8px' }}>Maior produtividade em seus projetos</li>
        <li style={{ marginBottom: '8px' }}>Análises mais precisas e detalhadas</li>
        <li style={{ marginBottom: '8px' }}>Interface mais intuitiva e fácil de usar</li>
        <li style={{ marginBottom: '8px' }}>Economia de tempo significativa</li>
      </ul>
      <p>
        A funcionalidade já está disponível em sua conta e pode ser acessada 
        imediatamente. Preparamos também tutoriais e guias para ajudá-lo a 
        aproveitar ao máximo esta novidade.
      </p>
      <p>
        Continue acompanhando nossas atualizações - temos muitas outras melhorias 
        chegando em breve!
      </p>
    </EmailTemplateBase>
  );
};
