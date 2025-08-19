
import { Link } from 'react-router-dom';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <UnifiedLogo size="lg" clickable={false} theme="dark" />
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Transforme seus projetos de engenharia e arquitetura com o poder da Inteligência Artificial. 
              Análise automatizada, orçamentos precisos e cronogramas inteligentes.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>© 2025 MadeAI. Todos os direitos reservados.</p>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Links Úteis</h3>
            <div className="space-y-3">
              <Link to="/termos" className="block text-muted-foreground hover:text-foreground transition-colors duration-200">
                Termos de Uso
              </Link>
              <Link to="/politica" className="block text-muted-foreground hover:text-foreground transition-colors duration-200">
                Política de Privacidade
              </Link>
              <a href="mailto:suporte@maden.ai" className="block text-muted-foreground hover:text-foreground transition-colors duration-200">
                Suporte
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Contato</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>Email: suporte@maden.ai</p>
              <p>Para engenheiros, arquitetos e equipes especializadas</p>
              <p className="text-sm mt-4">
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
