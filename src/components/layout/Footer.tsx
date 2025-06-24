
import { FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 p-2 rounded-lg">
                <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">ArchiAI</span>
            </div>
            <p className="text-slate-400 dark:text-[#bbbbbb] mb-4 max-w-md text-sm sm:text-base leading-relaxed">
              Sua obra, sua IA. Gerencie projetos, cronogramas e orçamentos com a ajuda da inteligência artificial.
            </p>
            <div className="text-xs sm:text-sm text-slate-400 dark:text-[#999]">
              <p>© 2025 ArchiAI. Todos os direitos reservados.</p>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Links Úteis</h3>
            <div className="space-y-2">
              <Link 
                to="/termos" 
                className="block text-slate-400 dark:text-[#bbbbbb] hover:text-white dark:hover:text-[#f2f2f2] transition-colors text-sm"
              >
                Termos de Uso
              </Link>
              <Link 
                to="/politica" 
                className="block text-slate-400 dark:text-[#bbbbbb] hover:text-white dark:hover:text-[#f2f2f2] transition-colors text-sm"
              >
                Política de Privacidade
              </Link>
              <a 
                href="mailto:suporte@archiai.app" 
                className="block text-slate-400 dark:text-[#bbbbbb] hover:text-white dark:hover:text-[#f2f2f2] transition-colors text-sm"
              >
                Suporte
              </a>
            </div>
          </div>

          {/* Contato */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contato</h3>
            <div className="space-y-2 text-slate-400 dark:text-[#bbbbbb] text-sm">
              <p className="break-all sm:break-normal">Email: suporte@archiai.app</p>
              <p className="leading-relaxed">Para engenheiros, arquitetos e equipes de obra</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
