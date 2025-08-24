
import { useState, useEffect } from 'react';
import { AppleButton } from '@/components/ui/apple-button';
import { X, Menu } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const current = (resolvedTheme || theme || "system") as "light" | "dark" | "system";
  const isDark = current === "dark";

  return (
    <header className="w-full flex justify-center px-4 pt-4">
      <div
        className={cn(
          "w-full max-w-7xl h-14 rounded-full flex items-center justify-between px-3 transition-colors",
          "backdrop-blur-md border shadow-xl ring-1",
          // Glass + base por tema
          isDark
            ? "bg-black/60 border-white/10 ring-white/10"
            : "bg-white/60 border-black/10 ring-black/10"
        )}
      >
        {/* Esquerda: logo */}
        <div className="flex items-center gap-3 pl-2">
          <Logo className="transition-all duration-300 hover:scale-105" />
        </div>

        {/* Direita: toggle + botões */}
        <div className="flex items-center gap-3 pr-1">
          <ThemeToggle />

          <Link to="/login" className="hidden sm:block">
            <AppleButton 
              variant="secondary"
              size="sm"
              className={cn(
                "rounded-full",
                // aparência coerente no glass
                isDark
                  ? "bg-neutral-800 text-white border border-white/10 hover:bg-neutral-700"
                  : "bg-neutral-200 text-black border border-black/10 hover:bg-neutral-300"
              )}
            >
              Login
            </AppleButton>
          </Link>

          <Link to="/cadastro">
            <AppleButton 
              variant="primary"
              size="sm"
              className={cn(
                "rounded-full",
                // mantém CTA com bom contraste nos dois temas
                isDark
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              )}
            >
              Começar Agora
            </AppleButton>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <AppleButton 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </AppleButton>
          </div>
        </div>

      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={cn(
          "absolute top-full left-4 right-4 mt-2 rounded-2xl p-4",
          "backdrop-blur-md border shadow-xl ring-1",
          isDark
            ? "bg-black/60 border-white/10 ring-white/10"
            : "bg-white/60 border-black/10 ring-black/10"
        )}>
          <div className="flex flex-col space-y-3">
            <AppleButton 
              as={Link}
              to="/login"
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              Login
            </AppleButton>
            <AppleButton 
              as={Link}
              to="/cadastro"
              variant="primary"
              size="sm"
              className="w-full"
            >
              Começar Agora
            </AppleButton>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
