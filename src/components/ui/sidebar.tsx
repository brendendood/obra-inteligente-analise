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
  // "Indique e ganhe" — item colapsável (apenas ícone quando fechado)
  {
    label: "Indique e ganhe projetos grátis",
    href: "/indique",
    icon: <Gift className="h-5 w-5" />,
    activeMatch: (p) => p.startsWith("/indique"),
  },
  // Sair sempre por último
  {
    label: "Sair",
    href: "#",
    icon: <LogOut className="h-5 w-5" />,
    activeMatch: () => false,
  },
];

export function SessionNavBar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
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
      {/* Header compacto opcional (logo da MadeAI pode ser inserido fora deste arquivo) */}
      <div className="h-14 w-full border-b border-border/70 px-3 flex items-center">
        <div className="h-5 w-5 rounded-sm bg-foreground/90" aria-hidden />
        <motion.span
          className="ml-2 text-sm font-medium"
          variants={labelVariants}
          animate={isCollapsed ? "closed" : "open"}
        >
          Menu
        </motion.span>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-2">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active =
                typeof item.activeMatch === "function"
                  ? item.activeMatch(location.pathname ?? "")
                  : location.pathname === item.href;

              // Handle logout action
              if (item.label === "Sair") {
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        // Trigger logout - this will be handled by the existing Sidebar component
                        const event = new CustomEvent('logout');
                        window.dispatchEvent(event);
                      }}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-2 py-2 transition-colors w-full text-left",
                        "text-muted-foreground hover:text-foreground",
                        "hover:bg-accent"
                      )}
                    >
                      <span
                        className={cn(
                          "grid place-items-center",
                          isCollapsed ? "w-8" : "w-5"
                        )}
                      >
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
                    </button>
                  </li>
                );
              }

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
                    <span
                      className={cn(
                        "grid place-items-center",
                        isCollapsed ? "w-8" : "w-5"
                      )}
                    >
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

      {/* Footer fino apenas para separação visual */}
      <div className="h-4 border-t border-border/70" />
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