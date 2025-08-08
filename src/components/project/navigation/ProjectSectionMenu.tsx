
import { useEffect, useMemo, useState } from 'react';
import { useProjectAccordionManager } from '@/components/project/ProjectWorkspaceTabManager';
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { NavLink } from 'react-router-dom';
import { Calculator, CalendarRange, Bot, FileText, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';

// Vertical, collapsible section selector for project pages
// - Uses ProjectDetailContext to ensure current project exists
// - Uses useProjectAccordionManager for active section + navigation
// - Persists collapsed state in localStorage

const STORAGE_KEY = 'project-section-menu-collapsed';

const sections = [
  { key: 'visao-geral', label: 'Visão Geral', icon: LayoutGrid },
  { key: 'orcamento', label: 'Orçamento', icon: Calculator },
  { key: 'cronograma', label: 'Cronograma', icon: CalendarRange },
  { key: 'assistente', label: 'Assistente', icon: Bot },
  { key: 'documentos', label: 'Documentos', icon: FileText },
] as const;

export const ProjectSectionMenu = () => {
  const { project } = useProjectDetail();
  const { activeSection, handleSectionChange } = useProjectAccordionManager();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {}
  }, [collapsed]);

  const widthCls = useMemo(() => (collapsed ? 'w-14' : 'w-60'), [collapsed]);

  const onSelect = (key: string) => {
    if (!project) return;
    handleSectionChange(key, project);
  };

  return (
    <nav aria-label="Seções do projeto" className={`sticky top-4 ${widthCls}`}>
      <div className="rounded-2xl border border-border bg-background shadow-sm">
        {/* Header / Toggle */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
          {!collapsed && (
            <h2 className="text-sm font-medium text-foreground">Navegação do Projeto</h2>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Items */}
        <ul className="p-1">
          {sections.map(({ key, label, icon: Icon }) => {
            const isActive = activeSection === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect(key)}
                  className={[
                    'group w-full flex items-center gap-3 rounded-lg px-2',
                    collapsed ? 'py-3 justify-center' : 'py-2.5',
                    'transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick links (optional) */}
        <div className="px-2 pb-2">
          <NavLink
            to="/painel"
            className={[
              'block rounded-lg text-xs px-2 py-2 text-muted-foreground hover:bg-muted',
              collapsed ? 'text-center' : 'text-left',
            ].join(' ')}
          >
            {!collapsed ? 'Voltar ao painel' : '↩︎'}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default ProjectSectionMenu;
