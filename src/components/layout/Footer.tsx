
import { Link } from 'react-router-dom';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description - Bustem Style */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <UnifiedLogo size="md" clickable={false} theme="auto" />
            </div>
            <p className="text-gray-600 text-[15px] leading-relaxed max-w-md">
              IA especializada para engenharia e arquitetura. Orçamentos precisos e cronogramas em segundos.
            </p>
          </div>

          {/* Product - Bustem Style */}
          <div>
            <h3 className="font-semibold mb-5 text-navy text-[15px]">Produto</h3>
            <div className="space-y-4">
              <Link to="#recursos" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Recursos
              </Link>
              <Link to="#como-funciona" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Como Funciona
              </Link>
              <Link to="#precos" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Preços
              </Link>
              <Link to="/upload" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Análise Grátis
              </Link>
            </div>
          </div>

          {/* Company - Bustem Style */}
          <div>
            <h3 className="font-semibold mb-5 text-navy text-[15px]">Empresa</h3>
            <div className="space-y-4">
              <a href="mailto:suporte@maden.ai" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Blog
              </a>
              <Link to="/termos" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Termos de Uso
              </Link>
              <Link to="/politica" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Política de Privacidade
              </Link>
            </div>
          </div>

          {/* Help - Bustem Style */}
          <div>
            <h3 className="font-semibold mb-5 text-navy text-[15px]">Ajuda</h3>
            <div className="space-y-4">
              <a href="mailto:suporte@maden.ai" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                FAQ's
              </a>
              <a href="mailto:suporte@maden.ai" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Contato
              </a>
              <a href="mailto:suporte@maden.ai" className="block text-gray-600 hover:text-navy transition-colors duration-200 text-[14px]">
                Suporte
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Bustem Style */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[14px] text-gray-600">
            © 2025 MadeAI. Todos os direitos reservados.
          </div>
          <div className="text-[14px] text-gray-600">
            suporte@maden.ai
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
