"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, type Variants } from "framer-motion";
import {
  Bot,
  Home,
  Users2,
  User,
  CreditCard,
  CircleHelp,
  MessageCircle,
  Gift,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ProjectLimitBar } from "@/components/layout/ProjectLimitBar";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { canUpgrade, getUpgradeMessage } from "@/utils/planUtils";

/**
 * IMPORTANTE
 * - Desktop-only: use este componente apenas em md+ (ex.: <div className="hidden md:block">).
 * - Não altera mobile; mantém o existente.
 * - Sidebar fixo à esquerda, 100vh. Colapsa por hover.
 * - Sem cards: somente itens de menu (ícone + rótulo quando expandido).
 * - "Indique e ganhe" é um item normal do menu; quando colapsado mostra apenas o ícone.
 */

const SIDEBAR_WIDTH_OPEN = 240;   // px
const SIDEBAR_WIDTH_CLOSED = 64;  // px

const sidebarVariants: Variants = {
  open: { width: SIDEBAR_WIDTH_OPEN },
  closed: { width: SIDEBAR_WIDTH_CLOSED },
};

const labelVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.16 },
  },
  closed: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.12 },
  },
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeMatch?: (pathname: string) => boolean;
};

const makeItems = (pathname: string): NavItem[] => [
  {
    label: "Assistente IA",
    href: "/ia",
    icon: <Bot className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/ia"),
  },
  {
    label: "Dashboard",
    href: "/painel",
    icon: <Home className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/painel") || p === "/",
  },
  {
    label: "CRM",
    href: "/crm",
    icon: <Users2 className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/crm"),
  },
  {
    label: "Conta & Preferências",
    href: "/conta",
    icon: <User className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/conta") || p.startsWith("/perfil"),
  },
  {
    label: "Plano e Pagamentos",
    href: "/plano",
    icon: <CreditCard className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/plano") || p.startsWith("/pagamentos"),
  },
  {
    label: "Ajuda e FAQs",
    href: "/ajuda",
    icon: <CircleHelp className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/ajuda") || p.startsWith("/faq"),
  },
  {
    label: "Fale com a Gente",
    href: "/contato",
    icon: <MessageCircle className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/contato") || p.startsWith("/suporte"),
  },
];

export function SessionNavBar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user } = useAuth();
  const { userData } = useUserData();
  const items = makeItems(location.pathname ?? "");

  return (
    <motion.aside
      role="navigation"
      aria-label="Menu lateral do usuário"
      className={cn(
        "fixed left-0 top-0 z-40 h-screen shrink-0 border-r",
        "bg-background text-foreground border-border",
        // evita sobrepor conteúdo em layouts grid; largura animada
        "flex flex-col"
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Header com logo MadeAI */}
      <div className="h-14 w-full border-b border-border/70 px-3 flex items-center justify-between">
        <motion.div
          className="overflow-hidden"
          animate={{
            width: isCollapsed ? "32px" : "auto",
          }}
        >
          <img 
            src="/lovable-uploads/647b2a47-622a-4d51-b065-536ce53708e0.png"
            alt="MadeAI Logo"
            className={cn(
              "transition-all duration-300 dark:hidden",
              isCollapsed ? "w-8 h-8" : "w-[120px] h-8"
            )}
          />
          <img 
            src="/lovable-uploads/20907bfc-be0d-490c-9375-39a51c3bffb4.png"
            alt="MadeAI Logo"
            className={cn(
              "transition-all duration-300 hidden dark:block",
              isCollapsed ? "w-8 h-8" : "w-[120px] h-8"
            )}
          />
        </motion.div>
        
        {/* Theme Toggle */}
        <motion.div
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : "auto",
          }}
          className="overflow-hidden"
        >
          <ThemeToggle />
        </motion.div>
      </div>

      {/* Project Limit Bar */}
      <div className="px-2 py-3 border-b border-border/70">
        <motion.div
          animate={{
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : "auto",
          }}
          className="overflow-hidden"
        >
          <ProjectLimitBar 
            currentProjects={userData.projectCount} 
            plan={userData.plan}
            extraCredits={userData.credits}
          />
        </motion.div>
        
        {/* Link "Indique e ganhe" visível quando colapsado */}
        <motion.div
          animate={{
            opacity: isCollapsed ? 1 : 0,
            height: isCollapsed ? "auto" : 0,
          }}
          className="overflow-hidden flex justify-center"
        >
          <Link
            to="/indique"
            className="p-2 rounded-md hover:bg-accent transition-colors"
            title="Indique e ganhe projetos grátis"
          >
            <Gift className="h-5 w-5 text-muted-foreground" />
          </Link>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-2">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active =
                typeof item.activeMatch === "function"
                  ? item.activeMatch(location.pathname ?? "")
                  : location.pathname === item.href;

              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-2 py-2 transition-colors",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-accent",
                      active && "bg-accent text-foreground"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="grid place-items-center w-5 h-5 flex-shrink-0">
                      {item.icon}
                    </span>

                    {/* Rótulo que some quando colapsado */}
                    <motion.span
                      className="text-sm truncate"
                      variants={labelVariants}
                      animate={isCollapsed ? "closed" : "open"}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea>

      {/* User Profile Section */}
      <div className="border-t border-border/70 p-2">
        <motion.div
          animate={{
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : "auto",
          }}
          className="overflow-hidden"
        >
          <div className="space-y-3 p-2">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 
                   user?.email?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Upgrade Button */}
            {canUpgrade(userData.plan) && (
              <Button 
                asChild 
                className="w-full h-8 text-xs"
                variant="default"
              >
                <Link to="/plano">
                  {getUpgradeMessage(userData.plan)}
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Collapsed User Avatar */}
        <motion.div
          animate={{
            opacity: isCollapsed ? 1 : 0,
            height: isCollapsed ? "auto" : 0,
          }}
          className="overflow-hidden flex justify-center"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 
               user?.email?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Logout Button */}
        <div className="mt-2">
          <button
            onClick={() => {
              window.location.href = '/logout';
            }}
            className={cn(
              "group flex items-center gap-3 rounded-md px-2 py-2 transition-colors w-full text-left",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-accent"
            )}
            title="Sair"
          >
            <span className="grid place-items-center w-5 h-5 flex-shrink-0">
              <LogOut className="h-5 w-5" />
            </span>
            <motion.span
              className="text-sm truncate"
              variants={labelVariants}
              animate={isCollapsed ? "closed" : "open"}
            >
              Sair
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

// Dummy exports to maintain compatibility with existing components
// These will not be used but prevent build errors
export const useSidebar = () => ({ state: 'expanded', open: true });
export const SidebarGroup = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const SidebarGroupContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const SidebarGroupLabel = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const SidebarMenu = ({ children, ...props }: any) => <ul {...props}>{children}</ul>;
export const SidebarMenuButton = ({ children, ...props }: any) => <button {...props}>{children}</button>;
export const SidebarMenuItem = ({ children, ...props }: any) => <li {...props}>{children}</li>;