import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';
import { Plus, Save, Eye, Mail, RefreshCw, Send, Users, AlertTriangle, Clock } from 'lucide-react';

interface EmailTemplate {
  id: string;
  template_key: string;
  subject: string;
  html: string;
  description?: string | null;
  updated_at: string;
}

export const AdminEmailTemplates = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Bulk email states
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);
  const [bulkLogs, setBulkLogs] = useState<string[]>([]);
  const [selectedEmailTypes, setSelectedEmailTypes] = useState<string[]>(['welcome_user']);
  const [userCount, setUserCount] = useState(0);

  const selected = useMemo(
    () => templates.find(t => t.id === selectedId) || null,
    [templates, selectedId]
  );

  const debouncedTimer = useRef<number | null>(null);

  useEffect(() => {
    loadTemplates();
    loadUserCount();

    // Realtime updates
    const channel = (supabase as any)
      .channel('email_templates_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'email_templates' }, () => {
        loadTemplates(false);
      })
      .subscribe();

    return () => {
      try { (supabase as any).removeChannel(channel); } catch {}
    };
  }, []);

  const loadTemplates = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      const { data, error } = await (supabase as any)
        .from('email_templates')
        .select('*')
        .order('template_key', { ascending: true });
      if (error) throw error;
      setTemplates(data || []);
      if (!selectedId && data && data.length) setSelectedId(data[0].id);
    } catch (e: any) {
      console.error('Erro ao carregar templates:', e);
      toast({ title: 'Erro ao carregar', description: e.message || 'Falha ao buscar templates.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadUserCount = async () => {
    try {
      const { count, error } = await (supabase as any)
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setUserCount(count || 0);
    } catch (error) {
      console.error('Erro ao carregar contagem de usuários:', error);
    }
  };

  const createTemplate = async () => {
    const key = prompt('Digite a chave (template_key) do novo template (ex: welcome_email)');
    if (!key) return;
    try {
      const { data, error } = await (supabase as any)
        .from('email_templates')
        .insert({ template_key: key, subject: '', html: '', description: '' })
        .select('*')
        .single();
      if (error) throw error;
      toast({ title: 'Template criado', description: `Template ${key} criado com sucesso.` });
      setTemplates(prev => [ ...(prev || []), data ]);
      setSelectedId(data.id);
    } catch (e: any) {
      toast({ title: 'Falha ao criar', description: e.message || 'Verifique se a chave é única.', variant: 'destructive' });
    }
  };

  const updateField = (field: 'subject' | 'html' | 'description', value: string) => {
    if (!selected) return;
    setTemplates(prev => prev.map(t => t.id === selected.id ? { ...t, [field]: value } : t));

    if (debouncedTimer.current) window.clearTimeout(debouncedTimer.current);
    debouncedTimer.current = window.setTimeout(() => saveSelected(), 600);
  };

  const saveSelected = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      const { error } = await (supabase as any)
        .from('email_templates')
        .update({ subject: selected.subject, html: selected.html, description: selected.description })
        .eq('id', selected.id);
      if (error) throw error;
      toast({ title: 'Salvo', description: 'Template atualizado com sucesso.' });
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message || 'Falha ao salvar template.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const startBulkEmailSending = async () => {
    if (selectedEmailTypes.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um tipo de email",
        variant: "destructive"
      });
      return;
    }

    setBulkSending(true);
    setBulkProgress(0);
    setBulkLogs(['🚀 Iniciando envio em massa...']);
    
    try {
      const { data, error } = await supabase.functions.invoke('bulk-email-sender', {
        body: {
          email_types: selectedEmailTypes,
          test_mode: false
        }
      });

      if (error) throw error;

      setBulkTotal(data.total_users);
      setBulkLogs(prev => [...prev, `📋 Enviando para ${data.total_users} usuários...`]);
      
      // Simular progresso real
      let progress = 0;
      const totalEmails = data.total_emails;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setBulkSending(false);
          setBulkLogs(prev => [...prev, `✅ Envio concluído! ${data.successful} sucessos, ${data.failed} falhas`]);
          clearInterval(interval);
          toast({
            title: "Concluído",
            description: `Emails enviados: ${data.successful} sucessos, ${data.failed} falhas`
          });
        }
        setBulkProgress(progress);
        
        if (progress % 25 === 0) {
          setBulkLogs(prev => [...prev, `⏳ Progresso: ${Math.round(progress)}%`]);
        }
      }, 800);

    } catch (error: any) {
      console.error('Erro no envio em massa:', error);
      setBulkLogs(prev => [...prev, `❌ Erro: ${error.message}`]);
      setBulkSending(false);
      toast({
        title: "Erro",
        description: "Erro no envio em massa",
        variant: "destructive"
      });
    }
  };

  const emailTypeOptions = [
    { id: 'welcome_user', label: 'Email de Boas-vindas', description: 'Email de boas-vindas para novos usuários' },
    { id: 'onboarding_step1', label: 'Onboarding Passo 1', description: 'Primeiro email de onboarding' },
    { id: 'project_milestone', label: 'Marco de Projeto', description: 'Email de comemoração de marcos' },
    { id: 'usage_limit_reached', label: 'Limite de Uso', description: 'Notificação de limite atingido' }
  ];

  const previewHtml = useMemo(() => {
    return DOMPurify.sanitize(selected?.html || '', { USE_PROFILES: { html: true } });
  }, [selected?.html]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" /> Templates de E-mail
          </h2>
          <p className="text-gray-600">Gerencie templates e envie emails em massa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadTemplates()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
          </Button>
          <Button onClick={createTemplate}>
            <Plus className="h-4 w-4 mr-2" /> Novo Template
          </Button>
        </div>
      </div>

      {/* Bulk Email Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-green-600" />
            Teste de Emails em Massa
          </CardTitle>
          <p className="text-sm text-gray-600">
            Envie emails de teste para todos os usuários cadastrados ({userCount} usuários)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Tipos de Email para Enviar:</h4>
            <div className="grid grid-cols-2 gap-3">
              {emailTypeOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedEmailTypes.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEmailTypes(prev => [...prev, option.id]);
                      } else {
                        setSelectedEmailTypes(prev => prev.filter(t => t !== option.id));
                      }
                    }}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {bulkSending && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progresso: {Math.round(bulkProgress)}%</span>
                <span>{bulkTotal} usuários</span>
              </div>
              <Progress value={bulkProgress} className="w-full" />
            </div>
          )}

          {bulkLogs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Log de Envio:</h4>
              <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                {bulkLogs.map((log, index) => (
                  <div key={index} className="text-xs text-gray-600 font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Este teste enviará emails reais para todos os usuários cadastrados. 
              Use com responsabilidade e apenas em ambiente de desenvolvimento.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              onClick={startBulkEmailSending}
              disabled={bulkSending || selectedEmailTypes.length === 0}
              className="flex items-center gap-2"
            >
              {bulkSending ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar para {userCount} Usuários
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setBulkLogs([]);
                setBulkProgress(0);
              }}
              disabled={bulkSending}
            >
              Limpar Log
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de templates */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[520px] pr-2">
              <div className="space-y-2">
                {loading && (
                  <div className="text-sm text-gray-500">Carregando...</div>
                )}
                {(!loading && templates.length === 0) && (
                  <div className="text-sm text-gray-500">Nenhum template ainda. Crie o primeiro.</div>
                )}
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full text-left p-3 rounded-md border ${selectedId === t.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate font-medium">{t.template_key}</div>
                      <Badge variant={selectedId === t.id ? 'default' : 'secondary'} className="text-[10px]">{new Date(t.updated_at).toLocaleDateString('pt-BR')}</Badge>
                    </div>
                    {t.description && (
                      <div className="text-xs text-gray-500 mt-1 truncate">{t.description}</div>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-600" /> Editor e Pré-visualização
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Chave (template_key)</label>
                    <Input value={selected.template_key} disabled />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Assunto</label>
                    <Input
                      value={selected.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      placeholder="Assunto do e-mail"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Descrição (opcional)</label>
                    <Input
                      value={selected.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Breve descrição do template"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">HTML do E-mail</label>
                    <Textarea
                      value={selected.html}
                      onChange={(e) => updateField('html', e.target.value)}
                      rows={16}
                      className="font-mono"
                      placeholder="Cole aqui o HTML completo do e-mail"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveSelected} disabled={saving} className="min-w-[140px]">
                      <Save className="h-4 w-4 mr-2" /> {saving ? 'Salvando...' : 'Salvar agora'}
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-2">Pré-visualização</div>
                  <div className="border rounded-md h-[520px] overflow-auto bg-white">
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Selecione ou crie um template para editar.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEmailTemplates;