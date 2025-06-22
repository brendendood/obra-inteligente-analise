
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ArqFlow.IA</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Sua obra, sua IA. Gerencie projetos, cronogramas e orçamentos com a ajuda da inteligência artificial.
            </p>
            <div className="text-sm text-slate-400">
              <p>© 2025 ArqFlow.IA. Todos os direitos reservados.</p>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <div className="space-y-2">
              <Link to="/termos" className="block text-slate-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link to="/politica" className="block text-slate-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <a href="mailto:suporte@arqflow.app" className="block text-slate-400 hover:text-white transition-colors">
                Suporte
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-2 text-slate-400">
              <p>Email: suporte@arqflow.app</p>
              <p>Para engenheiros, arquitetos e equipes de obra</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
