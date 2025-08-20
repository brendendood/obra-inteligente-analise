
import { Link } from 'react-router-dom';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description - Bustem Style */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <UnifiedLogo size="md" clickable={false} theme="auto" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              IA especializada para engenharia e arquitetura. Orçamentos precisos e cronogramas em segundos.
            </p>
          </div>

          {/* Product - Bustem Style */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">Produto</h3>
            <div className="space-y-3">
              <Link to="#recursos" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Recursos
              </Link>
              <Link to="#como-funciona" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Como Funciona
              </Link>
              <Link to="#precos" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Preços
              </Link>
              <Link to="/upload" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Análise Grátis
              </Link>
            </div>
          </div>

          {/* Company - Bustem Style */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">Empresa</h3>
            <div className="space-y-3">
              <a href="mailto:suporte@maden.ai" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Blog
              </a>
              <Link to="/termos" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Termos de Uso
              </Link>
              <Link to="/politica" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Política de Privacidade
              </Link>
            </div>
          </div>

          {/* Help - Bustem Style */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">Ajuda</h3>
            <div className="space-y-3">
              <a href="mailto:suporte@maden.ai" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                FAQ's
              </a>
              <a href="mailto:suporte@maden.ai" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Contato
              </a>
              <a href="mailto:suporte@maden.ai" className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                Suporte
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Bustem Style */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 MadeAI. Todos os direitos reservados.
          </div>
          <div className="text-sm text-muted-foreground">
            suporte@maden.ai
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
