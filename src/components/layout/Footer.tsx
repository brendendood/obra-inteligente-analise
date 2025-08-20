
import { Link } from 'react-router-dom';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <UnifiedLogo size="md" clickable={false} theme="light" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Análise instantânea, orçamentos e cronogramas precisos para engenheiros e arquitetos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <div className="space-y-3">
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Features
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Pricing
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                API
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Integrations
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <div className="space-y-3">
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Blog
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Careers
              </Link>
              <Link to="/contato" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-white mb-4">Help</h3>
            <div className="space-y-3">
              <Link to="/politica" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/termos" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Terms & Conditions
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                FAQ's
              </Link>
              <a href="mailto:suporte@maden.ai" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Support
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 MadeAI. Todos os direitos reservados.
            </div>
            <div className="text-sm text-gray-400">
              <p>suporte@maden.ai</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
