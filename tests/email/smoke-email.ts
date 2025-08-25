import { Resend } from 'resend';

interface SmokeTestResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

class EmailSmokeTest {
  private resend: Resend;
  private testEmail = 'test@example.com';
  private fromEmail = 'onboarding@resend.dev'; // Resend default sender

  constructor() {
    const apiKey = process.env.RESEND_API_KEY_SANDBOX;
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY_SANDBOX não encontrado. Verifique o arquivo .env.example');
    }

    if (!apiKey.startsWith('re_test_')) {
      console.warn('⚠️  ATENÇÃO: API key não parece ser sandbox (deve começar com re_test_)');
    }

    this.resend = new Resend(apiKey);
  }

  async runSmokeTest(): Promise<SmokeTestResult> {
    const timestamp = new Date().toISOString();
    
    console.log('🧪 Iniciando Smoke Test - Sistema de E-mail');
    console.log('📧 Enviando e-mail de teste...');
    console.log(`📤 Para: ${this.testEmail}`);
    console.log(`📨 De: ${this.fromEmail}`);
    console.log('⏰ Timestamp:', timestamp);
    console.log('---');

    try {
      const emailData = {
        from: this.fromEmail,
        to: [this.testEmail],
        subject: `[TESTE] MadeAI Email Smoke Test - ${new Date().toLocaleDateString('pt-BR')}`,
        html: this.getTestEmailTemplate(),
        tags: [
          { name: 'environment', value: 'test' },
          { name: 'type', value: 'smoke-test' }
        ]
      };

      console.log('📝 Conteúdo preparado, enviando...');
      
      const { data, error } = await this.resend.emails.send(emailData);

      if (error) {
        throw new Error(`Resend API Error: ${error.message}`);
      }

      const result: SmokeTestResult = {
        success: true,
        message: `✅ E-mail enviado com sucesso! ID: ${data?.id}`,
        details: {
          emailId: data?.id,
          recipient: this.testEmail,
          sender: this.fromEmail,
          apiKeyPrefix: process.env.RESEND_API_KEY_SANDBOX?.substring(0, 10) + '...'
        },
        timestamp
      };

      console.log('✅ SUCESSO:', result.message);
      console.log('📋 Detalhes:', JSON.stringify(result.details, null, 2));
      
      return result;

    } catch (error: any) {
      const result: SmokeTestResult = {
        success: false,
        message: `❌ Falha no envio: ${error.message}`,
        details: {
          error: error.message,
          recipient: this.testEmail,
          sender: this.fromEmail,
          apiKeyConfigured: !!process.env.RESEND_API_KEY_SANDBOX
        },
        timestamp
      };

      console.error('❌ ERRO:', result.message);
      console.error('📋 Detalhes:', JSON.stringify(result.details, null, 2));
      
      return result;
    }
  }

  private getTestEmailTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>MadeAI Email Smoke Test</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1376C8; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
            .status { background: #d4edda; border: 1px solid #c3e6cb; padding: 10px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧪 MadeAI Email Smoke Test</h1>
            </div>
            <div class="content">
                <div class="status">
                    <h3>✅ Teste de E-mail Executado com Sucesso</h3>
                    <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    <p><strong>Ambiente:</strong> Sandbox/Teste</p>
                    <p><strong>Sistema:</strong> MadeAI Email Service</p>
                </div>
                <br>
                <p>Este é um e-mail de teste automático gerado pelo sistema de smoke tests da plataforma MadeAI.</p>
                <p>Se você recebeu este e-mail, significa que:</p>
                <ul>
                    <li>✅ A API do Resend está funcionando</li>
                    <li>✅ As credenciais sandbox estão válidas</li>
                    <li>✅ O sistema de envio está operacional</li>
                    <li>✅ Os templates HTML estão sendo processados</li>
                </ul>
                <p><em>Este e-mail foi enviado usando a API key sandbox do Resend para fins de teste.</em></p>
            </div>
            <div class="footer">
                <p>MadeAI - Sistema de Testes Automatizados<br>
                Gerado automaticamente em ${new Date().toISOString()}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async validateApiKey(): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY_SANDBOX;
    
    console.log('🔑 Validando API Key...');
    
    if (!apiKey) {
      throw new Error('❌ RESEND_API_KEY_SANDBOX não configurada');
    }

    if (apiKey.length < 20) {
      throw new Error('❌ API Key parece estar incompleta');
    }

    if (!apiKey.startsWith('re_')) {
      throw new Error('❌ API Key não tem formato válido (deve começar com re_)');
    }

    if (!apiKey.startsWith('re_test_')) {
      console.warn('⚠️  ATENÇÃO: API Key não é sandbox (recomendado: re_test_...)');
    }

    console.log('✅ API Key válida');
    console.log(`🔹 Formato: ${apiKey.substring(0, 10)}...`);
    console.log(`🔹 Tipo: ${apiKey.startsWith('re_test_') ? 'Sandbox' : 'Produção'}`);
  }
}

// Função principal
async function runEmailSmokeTest(): Promise<void> {
  console.log('🚀 MadeAI Email Smoke Test');
  console.log('=====================================');
  
  try {
    const smokeTest = new EmailSmokeTest();
    
    // Validar API key primeiro
    await smokeTest.validateApiKey();
    console.log('---');
    
    // Executar teste
    const result = await smokeTest.runSmokeTest();
    
    console.log('=====================================');
    console.log('📊 RESULTADO FINAL:');
    console.log(`Status: ${result.success ? '✅ SUCESSO' : '❌ FALHA'}`);
    console.log(`Mensagem: ${result.message}`);
    console.log(`Timestamp: ${result.timestamp}`);
    
    // Exit code baseado no resultado
    process.exit(result.success ? 0 : 1);
    
  } catch (error: any) {
    console.error('💥 ERRO CRÍTICO:', error.message);
    console.error('=====================================');
    console.error('❌ Smoke test falhou na inicialização');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runEmailSmokeTest();
}

export { EmailSmokeTest, runEmailSmokeTest };
export type { SmokeTestResult };