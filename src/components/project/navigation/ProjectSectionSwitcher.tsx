
import { useMemo } from 'react';
import { useProjectAccordionManager } from '@/components/project/ProjectWorkspaceTabManager';
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

// Compact dropdown selector for project sections (no icons)
// - Uses Radix Select styled component
// - Solid background and high z-index to avoid transparency issues
// - Lives inside the ProjectHeader (passed via prop)

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

  const options = useMemo(() => sections, []);

  const onSelect = (key: string) => {
    if (!project) return;
    handleSectionChange(key, project);
  };

  return (
    <nav aria-label="Seções do projeto" className="w-fit">
      <label htmlFor="project-section-select" className="sr-only">Selecionar seção</label>
      <Select value={activeSection} onValueChange={onSelect}>
        <SelectTrigger id="project-section-select" className="h-10 min-w-[160px] px-3 rounded-full border-border bg-background shadow-sm">
          <SelectValue placeholder="Selecionar seção" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-popover border border-border shadow-md">
          {options.map(({ key, label }) => (
            <SelectItem key={key} value={key} className="cursor-pointer">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </nav>
  );
};

export default ProjectSectionSwitcher;
