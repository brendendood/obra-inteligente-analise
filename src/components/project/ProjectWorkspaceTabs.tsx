
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
        <TabsList className="flex justify-center items-center h-auto bg-transparent gap-2 w-full max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            
            return (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`
                  flex items-center justify-center p-4 rounded-xl font-medium
                  transition-all duration-300 border-2 border-transparent
                  hover:scale-105 hover:shadow-md
                  ${isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200'
                  }
                  data-[state=active]:bg-blue-600 data-[state=active]:text-white 
                  data-[state=active]:border-blue-600 data-[state=active]:shadow-lg
                  data-[state=active]:scale-105
                  min-w-[60px] group
                `}
                title={tab.label}
              >
                <Icon className={`h-6 w-6 transition-all duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-blue-600 group-hover:text-blue-700'
                }`} />
                {/* Label oculto no mobile, visível no hover para desktop */}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {tab.label}
                </span>
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
