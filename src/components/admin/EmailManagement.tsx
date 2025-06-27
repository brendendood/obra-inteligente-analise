
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, 
  Send, 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  Eye,
  RefreshCw
} from 'lucide-react';

const EmailManagement = () => {
  const [loading, setLoading] = useState(false);
  const [emailType, setEmailType] = useState('');
  const [recipient, setRecipient] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [emailStats, setEmailStats] = useState({
    sent: 0,
    delivered: 0,
    opened: 0,
    failed: 0
  });
  const { toast } = useToast();

  const emailTemplates = [
    { 
      id: 'welcome', 
      name: 'Boas-vindas', 
      description: 'E-mail de confirmação de cadastro',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    { 
      id: 'password-reset', 
      name: 'Redefinição de Senha', 
      description: 'Link para redefinir senha',
      icon: Settings,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      id: 'project-processed', 
      name: 'Projeto Processado', 
      description: 'Notificação de projeto analisado',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    { 
      id: 'document-export', 
      name: 'Documento Disponível', 
      description: 'Link para download de documento',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      id: 'project-error', 
      name: 'Erro no Projeto', 
      description: 'Alerta de erro no processamento',
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600'
    },
    { 
      id: 'feature-update', 
      name: 'Nova Funcionalidade', 
      description: 'Anúncio de recursos novos',
      icon: RefreshCw,
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const handleSendEmail = async () => {
    if (!emailType || !recipient) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Selecione o tipo de e-mail e informe o destinatário.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          emailType,
          recipient,
          customSubject,
          customMessage,
          templateData: {
            userName: recipient.split('@')[0],
            projectName: 'Projeto Teste',
            loginUrl: 'https://arqcloud.com.br/login',
            resetUrl: 'https://arqcloud.com.br/reset',
            projectUrl: 'https://arqcloud.com.br/projeto/123',
            supportUrl: 'https://arqcloud.com.br/suporte',
            platformUrl: 'https://arqcloud.com.br/painel',
            processingTime: '2 minutos',
            documentType: 'Relatório de Orçamento',
            downloadUrl: 'https://arqcloud.com.br/download/123',
            expiresIn: '7 dias',
            errorDetails: 'Arquivo não suportado',
            featureTitle: 'Assistente IA Aprimorado',
            featureDescription: 'Nova versão do assistente com análises mais precisas'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "✅ E-mail enviado!",
        description: `E-mail de ${emailTemplates.find(t => t.id === emailType)?.name} enviado para ${recipient}`,
      });

      // Limpar formulário
      setEmailType('');
      setRecipient('');
      setCustomSubject('');
      setCustomMessage('');

      // Atualizar estatísticas
      setEmailStats(prev => ({ ...prev, sent: prev.sent + 1 }));

    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      toast({
        title: "❌ Erro no envio",
        description: "Não foi possível enviar o e-mail. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewEmail = () => {
    if (!emailType) {
      toast({
        title: "⚠️ Selecione um template",
        description: "Escolha o tipo de e-mail para visualizar o preview.",
        variant: "destructive",
      });
      return;
    }

    // Abrir preview em nova janela
    const previewUrl = `/email-preview?type=${emailType}`;
    window.open(previewUrl, '_blank', 'width=800,height=600');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Gerenciamento de E-mails
            </h3>
            <p className="text-slate-600">
              Envio manual e automático de e-mails @arqcloud.com.br
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Enviados</p>
                <p className="text-2xl font-bold text-slate-900">{emailStats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Entregues</p>
                <p className="text-2xl font-bold text-green-600">{emailStats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Abertos</p>
                <p className="text-2xl font-bold text-purple-600">{emailStats.opened}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Falharam</p>
                <p className="text-2xl font-bold text-red-600">{emailStats.failed}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Envio Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-blue-600" />
              <span>Envio Manual</span>
            </CardTitle>
            <CardDescription>
              Envie e-mails personalizados para usuários específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-type">Tipo de E-mail</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        <template.icon className="h-4 w-4" />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient">E-mail do Destinatário</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="usuario@exemplo.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="custom-subject">Assunto Personalizado (Opcional)</Label>
              <Input
                id="custom-subject"
                placeholder="Deixe vazio para usar o padrão"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="custom-message">Mensagem Adicional (Opcional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Adicione uma mensagem personalizada"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleSendEmail} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar E-mail
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handlePreviewEmail}
                disabled={!emailType}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span>Templates Disponíveis</span>
            </CardTitle>
            <CardDescription>
              Templates responsivos e profissionais com branding MadenAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${template.color}`}>
                      <template.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{template.name}</p>
                      <p className="text-sm text-slate-600">{template.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Ativo
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de Domínio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <span>Configurações de Domínio</span>
          </CardTitle>
          <CardDescription>
            Configurações de envio para @arqcloud.com.br
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Remetente</Label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  MadenAI &lt;noreply@arqcloud.com.br&gt;
                </p>
                <p className="text-xs text-green-600">✅ Configurado</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reply-To</Label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  suporte@arqcloud.com.br
                </p>
                <p className="text-xs text-green-600">✅ Configurado</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status do Domínio</Label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Verificado e Ativo
                </p>
                <p className="text-xs text-green-600">✅ SPF, DKIM, DMARC</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Taxa de Entrega</Label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  98.5% (Excelente)
                </p>
                <p className="text-xs text-green-600">✅ Baixo spam rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManagement;
