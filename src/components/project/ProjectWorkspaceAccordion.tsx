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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <Accordion 
        type="single" 
        value={activeSection} 
        onValueChange={handleValueChange}
        className="w-full"
        collapsible={false} // Não permitir fechar todas as seções
      >
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.value;
          
          return (
            <AccordionItem 
              key={section.value} 
              value={section.value}
              className="border-b border-gray-100 last:border-b-0"
            >
              <AccordionTrigger 
                className={`
                  flex items-center justify-between px-6 py-4 hover:no-underline
                  transition-all duration-300 group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 transition-colors duration-300 ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-blue-600'
                  }`} />
                  <span className={`font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'text-blue-700' 
                      : 'text-gray-700 group-hover:text-blue-600'
                  }`}>
                    {section.label}
                  </span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 py-6 bg-gray-50/50">
                {isActive && children}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};