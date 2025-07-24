
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home, Upload, Brain, FolderOpen, Calculator, Calendar, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { MyAccountDialog } from '@/components/account/MyAccountDialog';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useProject } from '@/contexts/ProjectContext';

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderMobileMenu = ({ isOpen, onClose }: HeaderMobileMenuProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { toast } = useToast();
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const { getAvatarUrl, getAvatarFallback } = useDefaultAvatar();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "👋 Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "❌ Erro no logout",
        description: "Não foi possível fazer logout.",
        variant: "destructive"
      });
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  const fullName = user?.user_metadata?.full_name || '';
  const avatarUrl = getAvatarUrl(fullName, user?.email);
  const isInProject = Boolean(projectId && currentProject);

  // Navegação principal
  const mainNavigation = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/painel',
      isActive: location.pathname === '/painel'
    },
    {
      title: 'Meus Projetos',
      icon: FolderOpen,
      path: '/projetos',
      isActive: location.pathname === '/projetos'
    },
    {
      title: 'Upload de Projeto',
      icon: Upload,
      path: '/upload',
      isActive: location.pathname === '/upload'
    },
    {
      title: 'Assistente IA',
      icon: Brain,
      path: '/ia',
      isActive: location.pathname === '/ia'
    }
  ];

  // Navegação do projeto (quando estiver dentro de um projeto)
  const projectNavigation = isInProject ? [
    {
      title: 'Visão Geral',
      icon: Home,
      path: `/projeto/${projectId}`,
      isActive: location.pathname === `/projeto/${projectId}`
    },
    {
      title: 'Orçamento',
      icon: Calculator,
      path: `/projeto/${projectId}/orcamento`,
      isActive: location.pathname === `/projeto/${projectId}/orcamento`
    },
    {
      title: 'Cronograma',
      icon: Calendar,
      path: `/projeto/${projectId}/cronograma`,
      isActive: location.pathname === `/projeto/${projectId}/cronograma`
    },
    {
      title: 'IA do Projeto',
      icon: Brain,
      path: `/projeto/${projectId}/assistente`,
      isActive: location.pathname === `/projeto/${projectId}/assistente`
    },
    {
      title: 'Documentos',
      icon: FileText,
      path: `/projeto/${projectId}/documentos`,
      isActive: location.pathname === `/projeto/${projectId}/documentos`
    }
  ] : [];

  return (
    <>
      <div className="md:hidden border-t border-slate-200 py-4 animate-fade-in">
        <div className="space-y-1">
          {/* Navegação Principal */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Navegação Principal
            </h3>
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 text-sm rounded-lg mx-2 transition-colors ${
                    item.isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${item.isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Navegação do Projeto (se estiver em um projeto) */}
          {isInProject && projectNavigation.length > 0 && (
            <div className="mb-4 border-t border-slate-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {currentProject?.name || 'Projeto Atual'}
              </h3>
              {projectNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-sm rounded-lg mx-2 transition-colors ${
                      item.isActive 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.isActive ? 'text-green-700' : 'text-slate-400'}`} />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Área do Usuário */}
          {isAuthenticated ? (
            <div className="border-t border-slate-200 pt-4 mt-4">
              <button
                onClick={() => {
                  setShowAccountDialog(true);
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 text-sm text-slate-600 bg-slate-50 rounded-lg mx-2 hover:bg-slate-100 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {getAvatarFallback(fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
              </button>
              <Button 
                variant="outline" 
                onClick={() => {
                  handleLogout();
                  onClose();
                }} 
                className="w-full justify-start mt-2 mx-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <Button 
                onClick={() => {
                  navigate('/cadastro');
                  onClose();
                }} 
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>

      <MyAccountDialog
        isOpen={showAccountDialog}
        onClose={() => setShowAccountDialog(false)}
      />
    </>
  );
};
