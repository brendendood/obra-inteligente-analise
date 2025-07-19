
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-white text-xl">MadenAI</span>
            </div>
            <p className="text-sm text-slate-400">
              Transformando projetos de construção com inteligência artificial
            </p>
          </div>

          {/* Links Principais */}
          <div>
            <h3 className="font-semibold text-white mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/painel" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/projetos" className="hover:text-white transition-colors">Projetos</Link></li>
              <li><Link to="/upload" className="hover:text-white transition-colors">Upload</Link></li>
              <li><Link to="/assistente" className="hover:text-white transition-colors">Assistente IA</Link></li>
            </ul>
          </div>

          {/* Tecnologias */}
          <div>
            <h3 className="font-semibold text-white mb-4">Tecnologias</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sinapi" className="hover:text-white transition-colors">SINAPI</Link></li>
              <li><Link to="/supabase" className="hover:text-white transition-colors">Supabase</Link></li>
              <li><Link to="/n8n" className="hover:text-white transition-colors">N8N</Link></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-white mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><a href="mailto:contato@madenai.com" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 MadenAI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
