
import React from 'react';
import { EmailTemplateBase } from '../EmailTemplateBase';

interface DocumentExportEmailProps {
  userName: string;
  projectName: string;
  documentType: string;
  downloadUrl: string;
  expiresIn: string;
}

export const DocumentExportEmail = ({ 
  userName, 
  projectName, 
  documentType, 
  downloadUrl, 
  expiresIn 
}: DocumentExportEmailProps) => {
  return (
    <EmailTemplateBase
      title="Documento Pronto para Download"
      previewText={`Seu ${documentType} do projeto "${projectName}" está disponível para download.`}
      ctaText="Baixar Documento"
      ctaUrl={downloadUrl}
    >
      <p>Olá, <strong>{userName}</strong>!</p>
      <p>
        Seu <strong>{documentType}</strong> do projeto <strong>"{projectName}"</strong> 
        foi gerado com sucesso e está pronto para download.
      </p>
      <div style={{ 
        background: '#dbeafe', 
        border: '1px solid #3b82f6', 
        borderRadius: '8px', 
        padding: '20px', 
        margin: '20px 0',
        textAlign: 'center' 
      }}>
        <p style={{ margin: 0, color: '#1d4ed8', fontWeight: 'bold' }}>
          📄 Documento Disponível
        </p>
        <p style={{ margin: '10px 0 0 0', color: '#1d4ed8', fontSize: '14px' }}>
          Tipo: {documentType}
        </p>
      </div>
      <p>
        O documento contém todas as informações processadas pela nossa IA, incluindo 
        análises detalhadas, cálculos precisos e recomendações personalizadas para 
        seu projeto.
      </p>
      <div style={{ 
        background: '#fef3c7', 
        border: '1px solid #f59e0b', 
        borderRadius: '8px', 
        padding: '15px', 
        margin: '20px 0' 
      }}>
        <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
          ⏰ <strong>Atenção:</strong> Este link de download expira em {expiresIn}. 
          Faça o download assim que possível.
        </p>
      </div>
      <p>
        Após o download, você pode visualizar, imprimir ou compartilhar o documento 
        conforme necessário.
      </p>
    </EmailTemplateBase>
  );
};
