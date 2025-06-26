
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Calendar, Bot, FileText, Eye } from 'lucide-react';

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
  const tabs = [
    { value: 'visao-geral', label: 'Visão Geral', icon: Eye },
    { value: 'orcamento', label: 'Orçamento', icon: Calculator },
    { value: 'cronograma', label: 'Cronograma', icon: Calendar },
    { value: 'assistente', label: 'Assistente IA', icon: Bot },
    { value: 'documentos', label: 'Documentos', icon: FileText }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-8">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1 bg-white border border-gray-200 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 transition-all duration-200 rounded-lg"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">{tab.label}</span>
              <span className="sm:hidden font-medium">
                {tab.value === 'visao-geral' ? 'Geral' : 
                 tab.value === 'orcamento' ? 'Orç.' : 
                 tab.value === 'cronograma' ? 'Cron.' : 
                 tab.value === 'assistente' ? 'IA' : 'Docs'}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value={activeTab} className="space-y-8">
        {children}
      </TabsContent>
    </Tabs>
  );
};
