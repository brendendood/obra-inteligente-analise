
import { Link } from 'react-router-dom';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <UnifiedLogo size="lg" clickable={false} theme="light" />
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Transforme seus projetos de engenharia e arquitetura com o poder da Inteligência Artificial. 
              Análise automatizada, orçamentos precisos e cronogramas inteligentes.
            </p>
            <div className="text-sm text-slate-400">
              <p>© 2025 MadeAI. Todos os direitos reservados.</p>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <div className="space-y-2">
              <Link to="/termos" className="block text-slate-400 hover:text-white transition-colors duration-200">
                Termos de Uso
              </Link>
              <Link to="/politica" className="block text-slate-400 hover:text-white transition-colors duration-200">
                Política de Privacidade
              </Link>
              <a href="mailto:suporte@maden.ai" className="block text-slate-400 hover:text-white transition-colors duration-200">
                Suporte
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-2 text-slate-400">
              <p>Email: suporte@maden.ai</p>
              <p>Para engenheiros, arquitetos e equipes especializadas</p>
              <p className="text-sm mt-3 text-slate-500">
                Potencializando projetos com IA desde 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
