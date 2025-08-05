import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calculator, Calendar, Bot, FileText, Eye } from 'lucide-react';

interface ProjectWorkspaceAccordionProps {
  activeSection: string;
  onSectionChange: (value: string) => void;
  children: React.ReactNode;
}

export const ProjectWorkspaceAccordion = ({ 
  activeSection, 
  onSectionChange, 
  children 
}: ProjectWorkspaceAccordionProps) => {
  const sections = [
    { value: 'visao-geral', label: 'Visão Geral', icon: Eye },
    { value: 'orcamento', label: 'Orçamento', icon: Calculator },
    { value: 'cronograma', label: 'Cronograma', icon: Calendar },
    { value: 'assistente', label: 'Assistente IA', icon: Bot },
    { value: 'documentos', label: 'Documentos', icon: FileText }
  ];

  const handleValueChange = (value: string) => {
    // Se clicou na seção já ativa, não fazer nada (manter expandida)
    if (value === activeSection) return;
    
    // Se clicou em outra seção, navegar para ela
    onSectionChange(value);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <Accordion 
        type="single" 
        value={activeSection} 
        onValueChange={handleValueChange}
        className="w-full"
        collapsible={false}
      >
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.value;
          
          return (
            <AccordionItem 
              key={section.value} 
              value={section.value}
              className="border-b border-border/50 last:border-b-0"
            >
              <AccordionTrigger 
                className={`
                  flex items-center justify-between px-4 py-3 hover:no-underline
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-accent text-foreground' 
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 transition-colors duration-200 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground group-hover:text-primary'
                  }`} />
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-foreground' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {section.label}
                  </span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 py-4 bg-background/50">
                {isActive && children}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};