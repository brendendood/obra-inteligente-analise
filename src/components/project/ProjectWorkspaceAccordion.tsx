import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calculator, Calendar, Bot, FileText } from 'lucide-react';

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
    { value: 'orcamento', label: 'Orçamento', icon: Calculator },
    { value: 'cronograma', label: 'Cronograma', icon: Calendar },
    { value: 'assistente', label: 'Assistente', icon: Bot },
    { value: 'documentos', label: 'Documentos', icon: FileText }
  ];

  const handleSectionClick = (value: string) => {
    onSectionChange(value);
  };

  return (
    <div className="w-full">
      {/* Header Navigation */}
      <div className="bg-background border-b border-border">
        <div className="flex items-center justify-center px-6 py-4">
          <div className="flex items-center gap-1 bg-muted/30 rounded-2xl p-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.value;
              
              return (
                <button
                  key={section.value}
                  onClick={() => handleSectionClick(section.value)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                    ${isActive 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};