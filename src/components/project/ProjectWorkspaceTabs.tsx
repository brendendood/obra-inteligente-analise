
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
    { value: 'visao-geral', label: 'Visão Geral', icon: Eye, shortLabel: 'Geral' },
    { value: 'orcamento', label: 'Orçamento', icon: Calculator, shortLabel: 'Orç.' },
    { value: 'cronograma', label: 'Cronograma', icon: Calendar, shortLabel: 'Cron.' },
    { value: 'assistente', label: 'Assistente IA', icon: Bot, shortLabel: 'IA' },
    { value: 'documentos', label: 'Documentos', icon: FileText, shortLabel: 'Docs' }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto bg-transparent gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            
            return (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`
                  flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium
                  transition-all duration-200 border border-transparent
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                  data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 
                  data-[state=active]:border-blue-200 data-[state=active]:shadow-sm
                `}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm">{tab.label}</span>
                <span className="sm:hidden text-sm font-medium">{tab.shortLabel}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <TabsContent value={activeTab} className="space-y-8 focus-visible:outline-none">
        {children}
      </TabsContent>
    </Tabs>
  );
};
