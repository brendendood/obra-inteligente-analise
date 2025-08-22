import { useEffect, useState, useRef } from 'react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
const ToolsIntegrationSection = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 300);
      }
    }, {
      threshold: 0.2,
      rootMargin: '50px'
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);
  const mainTools = [{
    name: 'n8n',
    position: 'top-left',
    url: 'https://n8n.io/favicon.ico',
    alt: 'n8n logo'
  }, {
    name: 'SINAPI',
    position: 'top-center',
    url: 'https://sinapi.io/wp-content/uploads/2023/07/sinapi-logo.png',
    alt: 'SINAPI logo'
  }, {
    name: 'Supabase',
    position: 'top-right',
    url: 'https://supabase.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-logo-icon.6c339e31.png&w=64&q=75',
    alt: 'Supabase logo'
  }, {
    name: 'OpenAI',
    position: 'right',
    url: 'https://openai.com/favicon.ico',
    alt: 'OpenAI logo'
  }, {
    name: 'React',
    position: 'bottom-right',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    alt: 'React logo'
  }, {
    name: 'TypeScript',
    position: 'bottom-center',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',
    alt: 'TypeScript logo'
  }, {
    name: 'Tailwind CSS',
    position: 'bottom-left',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
    alt: 'Tailwind CSS logo'
  }, {
    name: 'PostgreSQL',
    position: 'left',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg',
    alt: 'PostgreSQL logo'
  }];
  const secondaryTools = [{
    name: 'AWS',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
  }, {
    name: 'Google Cloud',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg'
  }, {
    name: 'Azure',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg'
  }, {
    name: 'Figma',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg'
  }, {
    name: 'Webflow',
    url: 'https://assets-global.website-files.com/5d3e265ac89f6a3e64292efc/5d3e265ac89f6aa529292f34_webflow-black.svg'
  }, {
    name: 'Notion',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png'
  }, {
    name: 'Slack',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
  }, {
    name: 'Zapier',
    url: 'https://zapier.com/favicon.ico'
  }, {
    name: 'GitHub',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
  }, {
    name: 'Docker',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg'
  }];
  const getToolPosition = (position: string) => {
    const positions = {
      'top-left': 'absolute top-4 left-4 md:top-8 md:left-12',
      'top-center': 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6',
      'top-right': 'absolute top-4 right-4 md:top-8 md:right-12',
      'right': 'absolute right-0 top-1/2 transform translate-x-6 -translate-y-1/2',
      'bottom-right': 'absolute bottom-4 right-4 md:bottom-8 md:right-12',
      'bottom-center': 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6',
      'bottom-left': 'absolute bottom-4 left-4 md:bottom-8 md:left-12',
      'left': 'absolute left-0 top-1/2 transform -translate-x-6 -translate-y-1/2'
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
      'left': 'M50,200 Q125,200 200,200'
    };
    return paths[position as keyof typeof paths] || '';
  };
  return <section ref={sectionRef} className="md:px-8 bg-background theme-transition py-[28px] px-[19px]">
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
            {/* Central MadeAI logo with 3-layer Siri-style gradient */}
            <div className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full p-1 shadow-2xl shadow-primary/20">
              {/* Camada 1 - Externa */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 animate-pulse"></div>
              {/* Camada 2 - Média */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-500 via-pink-400 to-purple-600 opacity-80"></div>
              {/* Camada 3 - Interna */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-blue-500 opacity-60"></div>
              {/* Logo Container */}
              <div className="relative w-full h-full bg-card rounded-full flex items-center justify-center theme-transition">
                <UnifiedLogo size="lg" theme="auto" />
              </div>
            </div>

            {/* Main tool logos positioned around the center */}
            {mainTools.map((tool, index) => <div key={tool.name} className={`${getToolPosition(tool.position)} z-10 transition-all duration-1000 ${isAnimating ? `opacity-100 scale-100 animate-logo-emerge` : 'opacity-0 scale-0'}`} style={{
            animationDelay: `${index * 200}ms`,
            animationDuration: '800ms',
            animationFillMode: 'forwards'
          }}>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={tool.url} alt={tool.alt} className="w-8 h-8 md:w-10 md:h-10 object-contain filter grayscale opacity-60 hover:opacity-80 transition-all duration-300" style={{
                  filter: 'grayscale(100%) brightness(0.6)'
                }} loading="lazy" />
                  </div>
                  <div className="text-xs md:text-sm font-medium text-muted-foreground text-center whitespace-nowrap theme-transition">
                    {tool.name}
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Secondary tools grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {secondaryTools.map((tool, index) => <div key={tool.name} className={`bg-muted/50 rounded-xl p-4 text-center transition-all duration-500 delay-${index * 100 + 1200} theme-transition ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-6 h-6 rounded mx-auto mb-2 flex items-center justify-center overflow-hidden">
                <img src={tool.url} alt={`${tool.name} logo`} className="w-4 h-4 object-contain filter grayscale opacity-50" style={{
              filter: 'grayscale(100%) brightness(0.5)'
            }} loading="lazy" />
              </div>
              <div className="text-xs font-medium text-muted-foreground theme-transition">{tool.name}</div>
            </div>)}
        </div>
      </div>

      
      <style dangerouslySetInnerHTML={{
      __html: `
          @keyframes logo-emerge {
            0% {
              opacity: 0;
              transform: scale(0) translate(-50%, -50%);
              filter: blur(10px);
            }
            50% {
              opacity: 0.5;
              transform: scale(0.5) translate(-50%, -50%);
              filter: blur(5px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translate(0, 0);
              filter: blur(0px);
            }
          }
          
          .animate-logo-emerge {
            animation: logo-emerge 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `
    }} />
    </section>;
};
export default ToolsIntegrationSection;