
import React from 'react';

interface EmailTemplateBaseProps {
  title: string;
  children: React.ReactNode;
  ctaText?: string;
  ctaUrl?: string;
  previewText?: string;
}

export const EmailTemplateBase = ({ 
  title, 
  children, 
  ctaText, 
  ctaUrl, 
  previewText 
}: EmailTemplateBaseProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .title { color: #1e293b; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
          .text { color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 20px; }
          .cta-button { display: inline-block; background: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .cta-button:hover { background: #2563eb; }
          .footer { background-color: #f1f5f9; padding: 30px 20px; text-align: center; }
          .footer-text { color: #64748b; font-size: 14px; line-height: 20px; margin-bottom: 10px; }
          .footer-links { margin-top: 15px; }
          .footer-link { color: #3b82f6; text-decoration: none; margin: 0 10px; font-size: 14px; }
          .divider { height: 1px; background-color: #e2e8f0; margin: 30px 0; }
          @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .title { font-size: 20px; }
            .text { font-size: 15px; }
            .cta-button { display: block; text-align: center; }
          }
        `}</style>
      </head>
      <body>
        {previewText && (
          <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
            {previewText}
          </div>
        )}
        <div className="container">
          <div className="header">
            <h1 className="logo">MadenAI</h1>
          </div>
          <div className="content">
            <h2 className="title">{title}</h2>
            <div className="text">
              {children}
            </div>
            {ctaText && ctaUrl && (
              <div style={{ textAlign: 'center' }}>
                <a href={ctaUrl} className="cta-button">{ctaText}</a>
              </div>
            )}
          </div>
          <div className="footer">
            <p className="footer-text">
              <strong>Equipe MadenAI</strong><br />
              Plataforma de gestão e análise de obras com IA<br />
              arqcloud.com.br
            </p>
            <div className="footer-links">
              <a href="https://arqcloud.com.br/suporte" className="footer-link">Suporte</a>
              <a href="https://arqcloud.com.br/privacidade" className="footer-link">Privacidade</a>
              <a href="https://arqcloud.com.br/termos" className="footer-link">Termos</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};
