
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Database, AlertTriangle } from 'lucide-react';

export const DataCleanup = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      console.log('🗑️ Iniciando limpeza completa dos dados...');

      // Limpar dados de análises primeiro (devido às foreign keys)
      const { error: analysesError } = await supabase
        .from('project_analyses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

      if (analysesError) {
        console.error('Erro ao limpar análises:', analysesError);
      }

      // Limpar conversas
      const { error: conversationsError } = await supabase
        .from('project_conversations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

      if (conversationsError) {
        console.error('Erro ao limpar conversas:', conversationsError);
      }

      // Limpar projetos
      const { error: projectsError } = await supabase
        .from('projects')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

      if (projectsError) {
        console.error('Erro ao limpar projetos:', projectsError);
        throw projectsError;
      }

      console.log('✅ Limpeza completa realizada com sucesso');
      
      toast({
        title: "🧹 Base de dados limpa!",
        description: "Todos os projetos e dados foram removidos com sucesso. A plataforma está pronta para uso.",
      });

      // Recarregar a página para refletir as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('💥 Erro durante limpeza:', error);
      toast({
        title: "❌ Erro na limpeza",
        description: "Não foi possível limpar todos os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Database className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Limpeza da Base de Dados</h3>
          <p className="text-sm text-gray-600">Remover todos os dados de teste e projetos fictícios</p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">Atenção!</p>
            <p className="text-sm text-orange-700">
              Esta ação irá remover permanentemente TODOS os projetos, análises e dados da plataforma. 
              Use apenas para preparar o sistema para produção.
            </p>
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            disabled={isClearing}
            className="w-full flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isClearing ? 'Limpando...' : 'Limpar Toda a Base de Dados'}</span>
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-white border border-gray-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-900 text-xl flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirmar Limpeza Completa</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              <strong className="text-red-600">AÇÃO IRREVERSÍVEL:</strong> Todos os projetos, análises, conversas e dados serão permanentemente removidos.
              <br /><br />
              A plataforma ficará completamente limpa, pronta para uso em produção.
              <br /><br />
              Tem certeza absoluta que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAllData}
              className="bg-red-600 text-white hover:bg-red-700 shadow-lg"
            >
              Sim, Limpar Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
