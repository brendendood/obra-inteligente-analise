
import { useEffect, useMemo, useState } from 'react';
import { useProjectAccordionManager } from '@/components/project/ProjectWorkspaceTabManager';
import { useProjectDetail } from '@/contexts/ProjectDetailContext';

// Compact horizontal selector for project sections (no icons)
// - Collapsible: expanded shows horizontal pills; collapsed shows a compact select
// - Persists collapsed state in localStorage

const STORAGE_KEY = 'project-section-switcher-collapsed';

const sections = [
  { key: 'visao-geral', label: 'Visão Geral' },
  { key: 'orcamento', label: 'Orçamento' },
  { key: 'cronograma', label: 'Cronograma' },
  { key: 'assistente', label: 'Assistente' },
  { key: 'documentos', label: 'Documentos' },
] as const;

export const ProjectSectionSwitcher = () => {
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

  const onSelect = (key: string) => {
    if (!project) return;
    handleSectionChange(key, project);
  };

  const options = useMemo(() => sections, []);

  return (
    <nav aria-label="Seções do projeto" className="w-full">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5">
        {/* Expanded: horizontal pills */}
        {!collapsed ? (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {options.map(({ key, label }) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelect(key)}
                  className={[
                    'px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          // Collapsed: compact native select to save space
          <div className="flex-1 min-w-0">
            <label htmlFor="project-section-select" className="sr-only">Selecionar seção</label>
            <select
              id="project-section-select"
              value={activeSection}
              onChange={(e) => onSelect(e.target.value)}
              className="h-8 w-full max-w-[220px] text-sm rounded-md bg-muted text-foreground border border-border px-2"
            >
              {options.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Collapse/expand toggle (text only) */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto text-xs text-muted-foreground hover:underline"
          aria-label={collapsed ? 'Expandir seletor' : 'Recolher seletor'}
        >
          {collapsed ? 'Expandir' : 'Recolher'}
        </button>
      </div>
    </nav>
  );
};

export default ProjectSectionSwitcher;
