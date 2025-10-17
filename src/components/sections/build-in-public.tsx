import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Linkedin, ExternalLink } from 'lucide-react';
import { AppleButton } from '@/components/ui/apple-button';

export function BuildInPublic() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6">
            <Linkedin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Building in Public</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Desenvolvemos a MadeAI com você
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Compartilhamos nossa jornada, atualizações e evoluções diretamente com a comunidade. 
            Acompanhe nosso desenvolvimento transparente e veja como estamos construindo o futuro da análise de projetos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://linkedin.com/company/madeai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#004182] transition-colors duration-300"
            >
              <Linkedin className="w-5 h-5" />
              Seguir no LinkedIn
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-2">+450</div>
              <div className="text-sm text-muted-foreground">Profissionais ativos</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-2">Semanal</div>
              <div className="text-sm text-muted-foreground">Novas atualizações</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Feedback integrado</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
