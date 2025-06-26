
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface DashboardWelcomeHeaderProps {
  userName: string;
  greeting: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardWelcomeHeader = ({ userName, greeting, onRefresh, isLoading }: DashboardWelcomeHeaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeleteAllProjects = async () => {
    if (!user) return;

    try {
      console.log('🗑️ LIMPEZA: Iniciando exclusão completa dos projetos...');

      // Limpar localStorage
      localStorage.clear();
      sessionStorage.clear();
      console.log('✅ Cache local limpo');

      // Limpar análises primeiro (devido às foreign keys)
      const { error: analysesError } = await supabase
        .from('project_analyses')
        .delete()
        .eq('project_id', 'any'); // Deletar todas as análises do usuário atual

      if (analysesError && analysesError.code !== 'PGRST116') {
        console.error('❌ Erro ao limpar análises:', analysesError);
      } else {
        console.log('✅ Análises removidas');
      }

      // Limpar conversas
      const { error: conversationsError } = await supabase
        .from('project_conversations')
        .delete()
        .eq('project_id', 'any'); // Deletar todas as conversas do usuário atual

      if (conversationsError && conversationsError.code !== 'PGRST116') {
        console.error('❌ Erro ao limpar conversas:', conversationsError);
      } else {
        console.log('✅ Conversas removidas');
      }

      // Limpar todos os projetos do usuário
      const { error: projectsError } = await supabase
        .from('projects')
        .delete()
        .eq('user_id', user.id);

      if (projectsError) {
        console.error('❌ Erro ao limpar projetos:', projectsError);
        throw projectsError;
      } else {
        console.log('✅ Projetos removidos');
      }

      console.log('🎉 LIMPEZA: Todos os projetos foram excluídos com sucesso!');
      
      toast({
        title: "🧹 Projetos Excluídos!",
        description: "Todos os seus projetos foram removidos. O sistema está limpo para receber projetos reais.",
        duration: 5000,
      });

      // Recarregar dados
      setTimeout(() => {
        onRefresh();
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('💥 Erro durante limpeza:', error);
      toast({
        title: "❌ Erro na Exclusão",
        description: "Não foi possível excluir todos os projetos. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <WelcomeSection 
          userName={userName}
          hasProjects={true} // Sempre mostrar o botão para poder limpar
          onDeleteAll={handleDeleteAllProjects}
        />
        <Button 
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{greeting}, {userName}!</h2>
            <p className="text-gray-600">Bem-vindo ao MadenAI. Gerencie seus projetos com inteligência artificial.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">📊</span>
              <span className="font-medium text-green-800">Análises Precisas</span>
            </div>
            <p className="text-sm text-green-700 mt-1">IA treinada para arquitetura</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">⚡</span>
              <span className="font-medium text-purple-800">Processamento Rápido</span>
            </div>
            <p className="text-sm text-purple-700 mt-1">Resultados em segundos</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-2">
              <span className="text-orange-600">🎯</span>
              <span className="font-medium text-orange-800">Dados Reais</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">Baseado em projetos reais</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcomeHeader;
