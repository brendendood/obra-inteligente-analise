import { useEffect, useState } from 'react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

const ToolsIntegrationSection = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const mainTools = [
    { name: 'n8n', position: 'top-left' },
    { name: 'SINAPI', position: 'top-center' },
    { name: 'Supabase', position: 'top-right' },
    { name: 'OpenAI', position: 'right' },
    { name: 'React', position: 'bottom-right' },
    { name: 'TypeScript', position: 'bottom-center' },
    { name: 'Tailwind CSS', position: 'bottom-left' },
    { name: 'PostgreSQL', position: 'left' },
  ];

  const secondaryTools = [
    'AWS', 'Google Cloud', 'Azure', 'Figma', 'Webflow', 'Notion', 'Slack', 'Zapier', 'GitHub', 'Docker'
  ];

  const getToolPosition = (position: string) => {
    const positions = {
      'top-left': 'absolute top-4 left-4 md:top-8 md:left-12',
      'top-center': 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6',
      'top-right': 'absolute top-4 right-4 md:top-8 md:right-12',
      'right': 'absolute right-0 top-1/2 transform translate-x-6 -translate-y-1/2',
      'bottom-right': 'absolute bottom-4 right-4 md:bottom-8 md:right-12',
      'bottom-center': 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6',
      'bottom-left': 'absolute bottom-4 left-4 md:bottom-8 md:left-12',
      'left': 'absolute left-0 top-1/2 transform -translate-x-6 -translate-y-1/2',
    };
    return positions[position as keyof typeof positions] || '';
  };

  const getConnectionPath = (position: string) => {
    const paths = {
      'top-left': 'M80,80 Q140,140 200,200',
      'top-center': 'M200,50 Q200,125 200,200',
      'top-right': 'M320,80 Q260,140 200,200',
      'right': 'M350,200 Q275,200 200,200',
      'bottom-right': 'M320,320 Q260,260 200,200',
      'bottom-center': 'M200,350 Q200,275 200,200',
      'bottom-left': 'M80,320 Q140,260 200,200',
      'left': 'M50,200 Q125,200 200,200',
    };
    return paths[position as keyof typeof paths] || '';
  };

  return (
    <section className="py-32 px-6 md:px-8 bg-background theme-transition">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 tracking-tight theme-transition">
            Tecnologias e Integrações
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-normal theme-transition">
            Conectamos as melhores ferramentas do mercado para entregar resultados excepcionais
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Central container with MadeAI logo */}
          <div className="relative w-full h-80 md:h-96 flex items-center justify-center">
            {/* Animated connection lines */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 400 400"
              style={{ zIndex: 1 }}
            >
              {mainTools.map((tool, index) => (
                <path
                  key={tool.name}
                  d={getConnectionPath(tool.position)}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="4,4"
                  className={`transition-all duration-1000 delay-${index * 100} theme-transition ${
                    isAnimating ? 'opacity-20' : 'opacity-0'
                  }`}
                  style={{
                    animation: isAnimating ? `dashArray 4s ease-in-out infinite ${index * 0.3}s` : undefined
                  }}
                />
              ))}
            </svg>

            {/* Central MadeAI logo with gradient background */}
            <div className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 p-1 shadow-2xl shadow-primary/20">
              <div className="w-full h-full bg-card rounded-full flex items-center justify-center theme-transition">
                <UnifiedLogo size="lg" theme="auto" />
              </div>
            </div>

            {/* Main tool logos positioned around the center */}
            {mainTools.map((tool, index) => (
              <div
                key={tool.name}
                className={`${getToolPosition(tool.position)} z-10 transition-all duration-700 delay-${index * 150} ${
                  isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              >
                <div className="bg-card rounded-xl p-3 md:p-4 shadow-lg border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 group theme-transition">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-all duration-300">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-400 rounded-sm"></div>
                  </div>
                  <div className="text-xs md:text-sm font-medium text-muted-foreground text-center whitespace-nowrap theme-transition">
                    {tool.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary tools grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {secondaryTools.map((tool, index) => (
            <div
              key={tool}
              className={`bg-muted/50 rounded-xl p-4 text-center transition-all duration-500 delay-${index * 100 + 1200} theme-transition ${
                isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-6 h-6 bg-gray-400 rounded mx-auto mb-2"></div>
              <div className="text-xs font-medium text-muted-foreground theme-transition">{tool}</div>
            </div>
          ))}
        </div>
      </div>

      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes dashArray {
            0% {
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dashoffset: 16;
            }
            100% {
              stroke-dashoffset: 32;
            }
          }
        `
      }} />
    </section>
  );
};

export default ToolsIntegrationSection;