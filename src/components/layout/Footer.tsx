import { Mail, Phone, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border bg-background theme-transition">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="mb-4">
              <img 
                src="/lovable-uploads/c77446ad-cd65-4beb-a2f8-86ad4e6eccd7.png" 
                alt="MadeAI" 
                className="h-16 w-auto" 
              />
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm theme-transition">
              Transforme seus projetos arquitetônicos em orçamentos precisos com nossa IA especializada.
            </p>
            <div className="flex gap-4">
              <a href="mailto:contato@maden.ai" className="text-muted-foreground hover:text-foreground transition-fast hover-scale theme-transition" target="_blank" rel="noopener">
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+5511999999999" className="text-muted-foreground hover:text-foreground transition-fast hover-scale theme-transition" target="_blank" rel="noopener">
                <Phone className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/madeai.br" className="text-muted-foreground hover:text-foreground transition-fast hover-scale theme-transition" target="_blank" rel="noopener">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/maden-ai" className="text-muted-foreground hover:text-foreground transition-fast hover-scale theme-transition" target="_blank" rel="noopener">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 theme-transition">Produto</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground theme-transition cursor-pointer">Recursos</span>
              </li>
              <li>
                <span className="text-muted-foreground theme-transition cursor-pointer">Preços</span>
              </li>
              <li>
                <span className="text-muted-foreground theme-transition cursor-pointer">Demonstração</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 theme-transition">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground theme-transition">Sobre nós</span>
              </li>
              <li>
                <span className="text-muted-foreground theme-transition">Blog</span>
              </li>
              <li>
                <a href="mailto:contato@maden.ai" className="text-muted-foreground hover:text-foreground transition-fast theme-transition">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 theme-transition">Ajuda</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-fast theme-transition">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-fast theme-transition">
                  Termos & Condições
                </Link>
              </li>
              <li>
                <a href="mailto:contato@maden.ai?subject=FAQ" className="text-muted-foreground hover:text-foreground transition-fast theme-transition">
                  FAQ's
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 theme-transition">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-fast theme-transition">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-fast theme-transition">
                  Termos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 theme-transition">
          <div className="text-sm text-muted-foreground theme-transition">
            © 2025 MadeAI. Todos os direitos reservados.
          </div>
          <div className="flex gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Logo_IBGE.svg/200px-Logo_IBGE.svg.png" alt="SINAPI - IBGE" className="h-8 opacity-75 hover:opacity-100 transition-fast hover-scale" loading="lazy" />
            <img src="https://supabase.com/brand-assets/supabase-logo-wordmark--dark.svg" alt="Supabase" className="h-8 opacity-75 hover:opacity-100 transition-fast hover-scale" loading="lazy" />
            <img src="https://docs.n8n.io/favicon.svg" alt="N8N" className="h-8 opacity-75 hover:opacity-100 transition-fast hover-scale" loading="lazy" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;