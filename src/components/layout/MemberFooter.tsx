
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Heart, Shield, FileText, HelpCircle } from 'lucide-react';

export const MemberFooter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto w-full">
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Empresa */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">MadenAI</h3>
              <p className="text-sm text-gray-600 mt-1">
                Plataforma de gestão e análise de obras com IA
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {user?.email?.includes('admin') ? (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </>
                ) : (
                  'Usuário'
                )}
              </Badge>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Ferramentas
            </h4>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/projetos')}
                className="w-full justify-start h-8 px-2 text-gray-600 hover:text-gray-900"
              >
                Meus Projetos
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/upload')}
                className="w-full justify-start h-8 px-2 text-gray-600 hover:text-gray-900"
              >
                Novo Upload
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/assistente')}
                className="w-full justify-start h-8 px-2 text-gray-600 hover:text-gray-900"
              >
                Assistente IA
              </Button>
            </div>
          </div>

          {/* Suporte */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Suporte
            </h4>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/termos')}
                className="w-full justify-start h-8 px-2 text-gray-600 hover:text-gray-900"
              >
                <FileText className="h-3 w-3 mr-2" />
                Termos de Uso
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/privacidade')}
                className="w-full justify-start h-8 px-2 text-gray-600 hover:text-gray-900"
              >
                <Shield className="h-3 w-3 mr-2" />
                Privacidade
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-8 px-2 text-gray-600 hover:text-gray-900"
                onClick={() => window.open('mailto:suporte@maden.ai', '_blank')}
              >
                <HelpCircle className="h-3 w-3 mr-2" />
                Contato
              </Button>
            </div>
          </div>

          {/* Status da Conta */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Sua Conta
            </h4>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span><br />
                <span className="text-xs">{user?.email}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Plano:</span><br />
                <Badge variant="secondary" className="text-xs">
                  Gratuito
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} MadenAI. Todos os direitos reservados.
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>Feito com</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>para engenheiros e arquitetos</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
