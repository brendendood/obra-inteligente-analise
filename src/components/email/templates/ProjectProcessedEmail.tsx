
import React from 'react';
import { EmailTemplateBase } from '../EmailTemplateBase';

interface ProjectProcessedEmailProps {
  userName: string;
  projectName: string;
  projectUrl: string;
  processingTime: string;
}

export const ProjectProcessedEmail = ({ 
  userName, 
  projectName, 
  projectUrl, 
  processingTime 
}: ProjectProcessedEmailProps) => {
  return (
    <EmailTemplateBase
      title="Projeto Processado com Sucesso!"
      previewText={`Seu projeto "${projectName}" foi analisado pela nossa IA e está pronto para visualização.`}
      ctaText="Ver Projeto"
      ctaUrl={projectUrl}
    >
      <p>Olá, <strong>{userName}</strong>!</p>
      <p>
        Temos ótimas notícias! Seu projeto <strong>"{projectName}"</strong> foi 
        processado com sucesso pela nossa inteligência artificial.
      </p>
      <div style={{ 
        background: '#d1fae5', 
        border: '1px solid #10b981', 
        borderRadius: '8px', 
        padding: '20px', 
        margin: '20px 0',
        textAlign: 'center' 
      }}>
        <p style={{ margin: 0, color: '#047857', fontWeight: 'bold' }}>
          ✅ Análise Concluída
        </p>
        <p style={{ margin: '10px 0 0 0', color: '#047857', fontSize: '14px' }}>
          Tempo de processamento: {processingTime}
        </p>
      </div>
      <p>
        Agora você pode acessar:
      </p>
      <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '8px' }}>📊 Análise detalhada do projeto</li>
        <li style={{ marginBottom: '8px' }}>💰 Orçamento automatizado</li>
        <li style={{ marginBottom: '8px' }}>📅 Cronograma otimizado</li>
        <li style={{ marginBottom: '8px' }}>📄 Relatórios em PDF</li>
      </ul>
      <p>
        Clique no botão abaixo para visualizar todos os resultados e começar a 
        trabalhar com os dados gerados.
      </p>
    </EmailTemplateBase>
  );
};
