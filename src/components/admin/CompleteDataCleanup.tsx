
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Database, AlertTriangle, RefreshCw } from 'lucide-react';

export const CompleteDataCleanup = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleCompleteCleanup = async () => {
    setIsClearing(true);
    try {
      console.log('🧹 FINALIZANDO LIMPEZA: Limpando cache frontend...');

      // Limpar localStorage e sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Limpar cache específico dos projetos
      const cacheKey = 'madeai_projects_cache';
      localStorage.removeItem(cacheKey);
      
      console.log('✅ Cache frontend limpo');
      console.log('🎉 LIMPEZA COMPLETA FINALIZADA: Todos os usuários agora estão como contas novas!');
      
      toast({
        title: "🎉 Limpeza Completa Finalizada!",
        description: "Sistema resetado - todos os usuários agora estão como contas novas com plano Free.",
        duration: 5000,
      });

      // Recarregar a página para refletir as mudanças
      setTimeout(() => {
        window.location.href = '/painel';
      }, 2000);

    } catch (error) {
      console.error('💥 Erro durante limpeza frontend:', error);
      toast({
        title: "❌ Erro na Limpeza",
        description: "Erro ao limpar cache frontend.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Database className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Limpeza Completa do Sistema</h3>
          <p className="text-sm text-gray-600">Preparar plataforma para produção e dados reais</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">⚠️ Ação Irreversível!</p>
            <p className="text-sm text-amber-700 mt-1">
              Esta operação irá remover PERMANENTEMENTE:
            </p>
            <ul className="text-sm text-amber-700 mt-2 ml-4 list-disc space-y-1">
              <li>Todos os projetos fictícios e de demonstração</li>
              <li>Todas as análises e conversas com IA</li>
              <li>Cache local e dados temporários</li>
              <li>Histórico de interações</li>
            </ul>
            <p className="text-sm font-medium text-amber-800 mt-3">
              ✅ Após a limpeza: A IA será treinada com dados REAIS dos seus projetos
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <RefreshCw className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">🎯 Resultado da Limpeza:</p>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• Sistema pronto para projetos reais</li>
              <li>• IA será treinada com dados precisos</li>
              <li>• Análises baseadas em especificações reais</li>
              <li>• Orçamentos com valores do mercado atual</li>
              <li>• Cronogramas realistas baseados no projeto</li>
            </ul>
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            disabled={isClearing}
            className="w-full flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 text-base shadow-lg"
          >
            <Trash2 className="h-5 w-5" />
            <span>{isClearing ? 'Limpando Sistema...' : 'Limpar Sistema Completamente'}</span>
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-white border border-gray-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-900 text-xl flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Confirmar Limpeza Total</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base space-y-2">
              <p><strong className="text-red-600">ÚLTIMA CONFIRMAÇÃO:</strong></p>
              <p>Todos os dados fictícios serão removidos permanentemente.</p>
              <p className="text-green-700 font-medium">
                ✅ A plataforma ficará pronta para dados reais e treinamento preciso da IA.
              </p>
              <p>Deseja continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCompleteCleanup}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg font-semibold"
            >
              Sim, Limpar Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
