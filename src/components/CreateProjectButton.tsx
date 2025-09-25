// /components/CreateProjectButton.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Loader2 } from 'lucide-react';

interface CreateProjectButtonProps {
  onProjectCreated?: (projectId: string) => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function CreateProjectButton({ 
  onProjectCreated,
  variant = 'default',
  size = 'default',
  className 
}: CreateProjectButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleCreate() {
    setLoading(true);
    
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "❌ Erro de autenticação",
          description: "Você precisa estar logado para criar projetos.",
          variant: "destructive"
        });
        return;
      }

      // Call the Supabase Edge Function to create project
      const { data, error } = await supabase.functions.invoke('create-project', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          name: `Novo Projeto ${new Date().toLocaleDateString('pt-BR')}`,
          description: 'Projeto criado automaticamente',
          project_type: 'construcao',
          file_path: ''
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        
        if (error.message?.includes('LIMIT_REACHED')) {
          toast({
            title: "🚫 Limite atingido",
            description: "Você atingiu seu limite de projetos. Faça upgrade para continuar. Deletar não libera créditos.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "❌ Erro ao criar projeto",
            description: error.message || "Tente novamente em alguns instantes.",
            variant: "destructive"
          });
        }
        return;
      }

      if (!data?.ok) {
        if (data?.error === 'LIMIT_REACHED') {
          toast({
            title: "🚫 Limite atingido",
            description: "Você atingiu seu limite de projetos. Faça upgrade para continuar. Deletar não libera créditos.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "❌ Erro ao criar projeto",
            description: data?.error || "Erro desconhecido. Tente novamente.",
            variant: "destructive"
          });
        }
        return;
      }

      // Success
      toast({
        title: "✅ Projeto criado!",
        description: "Seu novo projeto foi criado com sucesso.",
        variant: "default"
      });

      // Call the callback if provided
      if (onProjectCreated && data.project_id) {
        onProjectCreated(data.project_id);
      }

      // Optionally refresh the page to show the new project
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "🌐 Erro de rede",
        description: "Falha de conexão ao criar projeto. Verifique sua internet.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCreate}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Criando…
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Criar Projeto
        </>
      )}
    </Button>
  );
}