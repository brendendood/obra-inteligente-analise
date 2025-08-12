import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';
import { Plus, Save, Eye, Mail, RefreshCw } from 'lucide-react';

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

  const selected = useMemo(
    () => templates.find(t => t.id === selectedId) || null,
    [templates, selectedId]
  );

  const debouncedTimer = useRef<number | null>(null);

  useEffect(() => {
    loadTemplates();

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
          <p className="text-gray-600">Gerencie o HTML dos e-mails do MadeAI em tempo real</p>
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
