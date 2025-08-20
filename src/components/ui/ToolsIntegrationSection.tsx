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

  const tools = [
    { name: 'n8n', logo: '🔗', position: 'top-left' },
    { name: 'SINAPI', logo: '📊', position: 'top-center' },
    { name: 'Supabase', logo: '⚡', position: 'top-right' },
    { name: 'OpenAI', logo: '🧠', position: 'right' },
    { name: 'React', logo: '⚛️', position: 'bottom-right' },
    { name: 'TypeScript', logo: '📘', position: 'bottom-center' },
    { name: 'Tailwind CSS', logo: '🎨', position: 'bottom-left' },
    { name: 'PostgreSQL', logo: '🐘', position: 'left' },
    { name: 'AWS', logo: '☁️', position: 'left-top' },
    { name: 'Google Cloud', logo: '🌤️', position: 'right-top' },
    { name: 'Azure', logo: '🔵', position: 'left-bottom' },
    { name: 'Figma', logo: '🎨', position: 'right-bottom' },
  ];

  const getToolPosition = (position: string) => {
    const positions = {
      'top-left': 'absolute top-4 left-4 md:top-8 md:left-8',
      'top-center': 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4',
      'top-right': 'absolute top-4 right-4 md:top-8 md:right-8',
      'right': 'absolute right-0 top-1/2 transform translate-x-4 -translate-y-1/2',
      'bottom-right': 'absolute bottom-4 right-4 md:bottom-8 md:right-8',
      'bottom-center': 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4',
      'bottom-left': 'absolute bottom-4 left-4 md:bottom-8 md:left-8',
      'left': 'absolute left-0 top-1/2 transform -translate-x-4 -translate-y-1/2',
      'left-top': 'absolute top-1/4 left-0 transform -translate-x-6 -translate-y-2',
      'right-top': 'absolute top-1/4 right-0 transform translate-x-6 -translate-y-2',
      'left-bottom': 'absolute bottom-1/4 left-0 transform -translate-x-6 translate-y-2',
      'right-bottom': 'absolute bottom-1/4 right-0 transform translate-x-6 translate-y-2',
    };
    return positions[position as keyof typeof positions] || '';
  };

  const getConnectionPath = (position: string) => {
    const paths = {
      'top-left': 'M80,80 Q120,120 200,200',
      'top-center': 'M200,40 Q200,120 200,200',
      'top-right': 'M320,80 Q280,120 200,200',
      'right': 'M360,200 Q280,200 200,200',
      'bottom-right': 'M320,320 Q280,280 200,200',
      'bottom-center': 'M200,360 Q200,280 200,200',
      'bottom-left': 'M80,320 Q120,280 200,200',
      'left': 'M40,200 Q120,200 200,200',
      'left-top': 'M20,120 Q110,160 200,200',
      'right-top': 'M380,120 Q290,160 200,200',
      'left-bottom': 'M20,280 Q110,240 200,200',
      'right-bottom': 'M380,280 Q290,240 200,200',
    };
    return paths[position as keyof typeof paths] || '';
  };

  return (
    <section className="py-32 px-6 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-slate-900 mb-8 tracking-tight">
            Tecnologias e Integrações
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-normal">
            Conectamos as melhores ferramentas do mercado para entregar resultados excepcionais
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central container with MadeAI logo */}
          <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center">
            {/* Animated connection lines */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 400 400"
              style={{ zIndex: 1 }}
            >
              {tools.map((tool, index) => (
                <path
                  key={tool.name}
                  d={getConnectionPath(tool.position)}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className={`transition-all duration-1000 delay-${index * 100} ${
                    isAnimating ? 'opacity-30' : 'opacity-0'
                  }`}
                  style={{
                    animation: isAnimating ? `dashArray 3s ease-in-out infinite ${index * 0.2}s` : undefined
                  }}
                />
              ))}
            </svg>

            {/* Central MadeAI logo */}
            <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
              <UnifiedLogo size="2xl" theme="auto" />
            </div>

            {/* Tool logos positioned around the center */}
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className={`${getToolPosition(tool.position)} z-10 transition-all duration-700 delay-${index * 150} ${
                  isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              >
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="text-2xl md:text-3xl mb-2 text-center filter grayscale group-hover:grayscale-0 transition-all duration-300">
                    {tool.logo}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-slate-600 text-center whitespace-nowrap">
                    {tool.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional tools grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {['Webflow', 'Notion', 'Slack', 'Zapier', 'GitHub', 'Docker'].map((tool, index) => (
            <div
              key={tool}
              className={`bg-slate-50 rounded-xl p-4 text-center transition-all duration-500 delay-${index * 100 + 1000} ${
                isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-xl mb-2 filter grayscale">🔧</div>
              <div className="text-sm font-medium text-slate-600">{tool}</div>
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
              stroke-dashoffset: 20;
            }
            100% {
              stroke-dashoffset: 40;
            }
          }
        `
      }} />
    </section>
  );
};

export default ToolsIntegrationSection;