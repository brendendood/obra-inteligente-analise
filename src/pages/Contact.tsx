import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fale com a Gente</h1>
          <p className="text-slate-600 mt-2">Entre em contato conosco para dúvidas, sugestões ou suporte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Enviar Mensagem
                </CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e retornaremos em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Nome
                      </label>
                      <Input placeholder="Seu nome completo" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Email
                      </label>
                      <Input type="email" placeholder="seu.email@exemplo.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Assunto
                    </label>
                    <Input placeholder="Qual o motivo do contato?" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Mensagem
                    </label>
                    <Textarea 
                      placeholder="Descreva sua dúvida, sugestão ou problema..."
                      rows={6}
                    />
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outras Formas de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">contato@madenai.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Telefone</p>
                    <p className="text-sm text-slate-600">+55 (11) 9999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Endereço</p>
                    <p className="text-sm text-slate-600">
                      São Paulo, SP<br />
                      Brasil
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Horário de Atendimento</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Segunda a Sexta: 9h às 18h</p>
                  <p>Sábado: 9h às 12h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-blue-900 mb-2">Suporte Técnico</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Para problemas técnicos urgentes, use nosso chat de suporte
                </p>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  Abrir Chat de Suporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contact;