
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  FileText, 
  Calculator, 
  Calendar, 
  Bot, 
  Download
} from 'lucide-react';

interface ProjectWorkspaceTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export const ProjectWorkspaceTabs = ({ 
  activeTab, 
  onTabChange, 
  children 
}: ProjectWorkspaceTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger 
          value="visao-geral"
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Visão Geral</span>
        </TabsTrigger>
        <TabsTrigger 
          value="orcamento"
          className="flex items-center space-x-2"
        >
          <Calculator className="h-4 w-4" />
          <span className="hidden sm:inline">Orçamento</span>
        </TabsTrigger>
        <TabsTrigger 
          value="cronograma"
          className="flex items-center space-x-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Cronograma</span>
        </TabsTrigger>
        <TabsTrigger 
          value="assistente"
          className="flex items-center space-x-2"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">Assistente</span>
        </TabsTrigger>
        <TabsTrigger 
          value="documentos"
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Documentos</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="flex-1">
        {children}
      </TabsContent>
    </Tabs>
  );
};
