
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Validação
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        toast({
          title: "❌ Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "✅ Mensagem enviada!",
        description: "Recebemos sua mensagem e responderemos em breve.",
      });

      // Limpar formulário
      setFormData({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        subject: '',
        category: '',
        message: '',
        priority: 'normal'
      });

    } catch (error) {
      toast({
        title: "❌ Erro ao enviar",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Email",
      description: "suporte@maden.ai",
      action: "Enviar Email",
      href: "mailto:suporte@maden.ai"
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Telefone",
      description: "(11) 9999-9999",
      action: "Ligar",
      href: "tel:+5511999999999"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
      title: "Chat ao Vivo",
      description: "Disponível 24/7",
      action: "Iniciar Chat",
      href: "#chat"
    }
  ];

  const supportHours = [
    { day: "Segunda - Sexta", hours: "08:00 - 18:00" },
    { day: "Sábado", hours: "09:00 - 14:00" },
    { day: "Domingo", hours: "Chat online apenas" }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Fale Conosco</h1>
              <p className="text-slate-600">Estamos aqui para ajudar você a aproveitar ao máximo o MadenAI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Envie sua Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suporte">Suporte Técnico</SelectItem>
                          <SelectItem value="vendas">Vendas</SelectItem>
                          <SelectItem value="bug">Reportar Bug</SelectItem>
                          <SelectItem value="feature">Sugestão de Funcionalidade</SelectItem>
                          <SelectItem value="billing">Cobrança</SelectItem>
                          <SelectItem value="other">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Descreva brevemente o assunto"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Descreva sua dúvida, problema ou sugestão em detalhes..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      disabled={sending}
                      className="flex-1"
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setFormData({
                        name: user?.user_metadata?.full_name || '',
                        email: user?.email || '',
                        subject: '',
                        category: '',
                        message: '',
                        priority: 'normal'
                      })}
                    >
                      Limpar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Outros Meios de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{method.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{method.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (method.href.startsWith('#')) {
                            toast({
                              title: "🚀 Funcionalidade em breve!",
                              description: "Esta funcionalidade será implementada em breve.",
                            });
                          } else {
                            window.open(method.href, '_blank');
                          }
                        }}
                      >
                        {method.action}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{schedule.day}</span>
                      <span className="text-sm font-medium text-slate-900">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Chat online 24/7</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Assistência automática disponível a qualquer hora
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SLA Promise */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-900 mb-2">Compromisso de Resposta</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Urgente:</span>
                      <Badge variant="destructive" className="text-xs">2 horas</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Alta:</span>
                      <Badge className="text-xs bg-orange-500">8 horas</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Normal:</span>
                      <Badge className="text-xs bg-blue-500">24 horas</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Baixa:</span>
                      <Badge variant="secondary" className="text-xs">48 horas</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contact;
