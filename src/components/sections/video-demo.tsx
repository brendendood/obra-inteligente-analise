import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';

export function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Veja a MadeAI em ação
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Assista como nossa IA analisa um projeto real e gera orçamento completo em menos de 3 minutos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl overflow-hidden border border-border shadow-2xl">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="group relative"
                  aria-label="Reproduzir vídeo de demonstração"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img 
                    src="/src/assets/hero-dashboard-mockup.jpg" 
                    alt="Preview do Dashboard MadeAI" 
                    className="w-full h-full object-cover opacity-40"
                  />
                </div>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Demonstração MadeAI"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
          
          {/* Trust indicator */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ⭐ Mais de <strong>450 profissionais</strong> já usaram este processo
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
