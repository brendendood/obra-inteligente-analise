// /components/DeleteProjectButton.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteProjectButtonProps {
  projectId: string;
  onDeleted?: () => void;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export default function DeleteProjectButton({ 
  projectId, 
  onDeleted,
  variant = 'outline',
  size = 'sm',
  className,
  showIcon = true
}: DeleteProjectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    setLoading(true);
    
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "❌ Erro de autenticação",
          description: "Você precisa estar logado para excluir projetos.",
          variant: "destructive"
        });
        return;
      }

      // Call the Supabase Edge Function to delete project
      const { data, error } = await supabase.functions.invoke('delete-project', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { projectId } // Pass projectId in body for edge function to extract from URL
      });

      if (error) {
        console.error('Edge function error:', error);
        
        if (error.message?.includes('PROJECT_NOT_FOUND')) {
          toast({
            title: "📂 Projeto não encontrado",
            description: "O projeto pode ter sido removido ou você não tem acesso.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "❌ Erro ao excluir projeto",
            description: error.message || "Tente novamente em alguns instantes.",
            variant: "destructive"
          });
        }
        return;
      }

      if (!data?.ok) {
        toast({
          title: "❌ Erro ao excluir projeto",
          description: data?.error || "Erro desconhecido. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Success
      toast({
        title: "🗑️ Projeto excluído",
        description: "O projeto foi marcado como excluído. Lembre-se: isso não devolve créditos.",
        variant: "default"
      });

      // Close dialog and call callback
      setOpen(false);
      onDeleted?.();

    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "🌐 Erro de rede",
        description: "Falha de conexão ao excluir projeto. Verifique sua internet.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              {size !== 'sm' && <span className="ml-2">Excluindo…</span>}
            </>
          ) : (
            <>
              {showIcon && <Trash2 className="h-3 w-3" />}
              {size !== 'sm' && <span className="ml-2">Excluir</span>}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Excluir Projeto
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir este projeto?
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Esta ação NÃO devolve créditos e não pode ser desfeita.
            </p>
            <p className="text-muted-foreground text-sm">
              O projeto será marcado como excluído mas permanecerá no sistema para auditoria.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo…
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Sim, excluir
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}