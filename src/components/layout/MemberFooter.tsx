
import { useUserData } from '@/hooks/useUserData';
import { getPlanDisplayName } from '@/utils/planUtils';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { LogoImage } from '@/components/ui/LogoImage';

export const MemberFooter = () => {
  const { userData } = useUserData();
  
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200/60 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <LogoImage size="md" clickable={false} />
            </div>
            <p className="text-sm text-slate-600 mb-4 max-w-md">
              Transforme seus projetos de engenharia e arquitetura com o poder da Inteligência Artificial. 
              Análise automatizada, orçamentos precisos e cronogramas inteligentes.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all duration-200"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all duration-200"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all duration-200"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Plataforma</h3>
            <div className="space-y-2">
              <Link 
                to="/painel" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                to="/projetos" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Projetos
              </Link>
              <Link 
                to="/upload" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Upload
              </Link>
              <Link 
                to="/conta" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Minha Conta
              </Link>
            </div>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Suporte</h3>
            <div className="space-y-2">
              <Link 
                to="/ajuda" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Central de Ajuda
              </Link>
              <Link 
                to="/contato" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Contato
              </Link>
              <Link 
                to="/termos" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Termos de Uso
              </Link>
              <Link 
                to="/privacidade" 
                className="block text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                Privacidade
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>MadenAI v2.0</span>
              <span>•</span>
              <span>Plano: {getPlanDisplayName(userData.plan)}</span>
              <span>•</span>
              <span>Projetos: {userData.projectCount}</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="mailto:suporte@maden.ai"
                className="flex items-center text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200"
              >
                <Mail className="h-3 w-3 mr-1" />
                suporte@maden.ai
              </a>
              <a 
                href="https://lovable.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <span>Made with</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-slate-400">
              © 2025 MadenAI - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
