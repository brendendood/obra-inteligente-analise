"use client";

import { useState } from "react";
import { SidebarProvider, DesktopSidebar, SidebarLink } from "@/components/ui/sidebar-new";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Ícones do lucide-react
import {
  Bot,
  LayoutDashboard,
  Users2,
  User,
  CreditCard,
  CircleHelp,
  MessageCircle,
  LogOut,
  Gift,
  BadgeCheck,
} from "lucide-react";

type SidebarMadeDesktopProps = {
  projectsCurrent: number;
  projectsLimit: number;
  planLabel: string;
  userName: string;
  onUpgradeHref: string;
  onInviteHref: string;
  hrefs: {
    assistenteIA: string;
    dashboard: string;
    crm: string;
    contaPref: string;
    planoPag: string;
    ajudaFaqs: string;
    faleComAGente: string;
    sair: string;
  };
};

export default function SidebarMadeDesktopOnly(props: SidebarMadeDesktopProps) {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const progress =
    props.projectsLimit > 0
      ? Math.min(100, Math.round((props.projectsCurrent / props.projectsLimit) * 100))
      : 0;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="hidden md:block">
      <SidebarProvider open={open} setOpen={setOpen}>
        <DesktopSidebar className="justify-between gap-6 bg-[#0f172a] dark:bg-[#0f172a] border-r border-white/5">
          {/* TOPO — progress, plano e convite */}
          <div className="flex flex-col gap-4">
            {/* Status de Projetos */}
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-200">
                  Projetos: {props.projectsCurrent}/{props.projectsLimit}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-100 border border-white/10">
                  <BadgeCheck className="h-3 w-3 opacity-80" />
                  {props.planLabel}
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#00A3FF]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <a
                href={props.onInviteHref}
                className="mt-2 inline-flex items-center gap-2 text-[13px] text-sky-400 hover:text-sky-300"
              >
                <Gift className="h-4 w-4" />
                Indique e ganhe projetos grátis
              </a>
            </div>

            {/* LINKS — manter labels/ordem/rotas */}
            <nav className="flex flex-col gap-1">
              <SidebarLink
                link={{
                  label: "Assistente IA",
                  href: props.hrefs.assistenteIA,
                  icon: <Bot className="h-5 w-5 text-slate-200" />,
                }}
              />
              <SidebarLink
                link={{
                  label: "Dashboard",
                  href: props.hrefs.dashboard,
                  icon: <LayoutDashboard className="h-5 w-5 text-slate-200" />,
                }}
              />
              <SidebarLink
                link={{
                  label: "CRM",
                  href: props.hrefs.crm,
                  icon: <Users2 className="h-5 w-5 text-slate-200" />,
                }}
              />
              <div className="mt-2 rounded-xl bg-sky-500/10 border border-sky-500/20 p-1.5">
                <SidebarLink
                  link={{
                    label: "Conta & Preferências",
                    href: props.hrefs.contaPref,
                    icon: <User className="h-5 w-5 text-sky-400" />,
                  }}
                  className="px-2"
                />
              </div>
              <SidebarLink
                link={{
                  label: "Plano e Pagamentos",
                  href: props.hrefs.planoPag,
                  icon: <CreditCard className="h-5 w-5 text-slate-200" />,
                }}
              />
              <SidebarLink
                link={{
                  label: "Ajuda e FAQs",
                  href: props.hrefs.ajudaFaqs,
                  icon: <CircleHelp className="h-5 w-5 text-slate-200" />,
                }}
              />
              <div className="mt-2 rounded-xl bg-sky-500/10 border border-sky-500/20 p-1.5">
                <SidebarLink
                  link={{
                    label: "Fale com a Gente",
                    href: props.hrefs.faleComAGente,
                    icon: <MessageCircle className="h-5 w-5 text-sky-400" />,
                  }}
                  className="px-2"
                />
              </div>
            </nav>
          </div>

          {/* BASE — card do usuário + upgrade + sair */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500 grid place-items-center text-white text-sm font-semibold">
                  {getInitials(props.userName)}
                </div>
                <div className="min-w-0">
                  <div className="text-slate-100 text-sm font-medium truncate">
                    {props.userName}
                  </div>
                  <div className="text-slate-300/70 text-xs">Plano {props.planLabel}</div>
                </div>
              </div>
              <a
                href={props.onUpgradeHref}
                className={cn(
                  "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2",
                  "bg-[#00A3FF] hover:bg-[#0595e6] text-white text-sm font-medium"
                )}
              >
                Contato para Upgrade
              </a>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </DesktopSidebar>
      </SidebarProvider>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}