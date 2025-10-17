import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { AppleButton } from '@/components/ui/apple-button';
import { Link } from 'react-router-dom';

export function ContactCTA() {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Ficou com alguma dúvida?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar. Escolha o canal que preferir para falar com nossa equipe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 text-center"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-4">Resposta rápida e direta</p>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20MadeAI."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Iniciar conversa
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 text-center"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">E-mail</h3>
            <p className="text-sm text-muted-foreground mb-4">Suporte técnico detalhado</p>
            <a
              href="mailto:contato@madeai.com.br"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Enviar e-mail
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 text-center"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Demonstração</h3>
            <p className="text-sm text-muted-foreground mb-4">Agende uma call personalizada</p>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Solicitar demonstração
            </Link>
          </motion.div>
        </div>

        <div className="text-center mt-10">
          <AppleButton as={Link} to="/cadastro" variant="primary" size="lg">
            Ou comece agora gratuitamente
          </AppleButton>
        </div>
      </div>
    </section>
  );
}
