
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, Clock } from 'lucide-react';
import { Project } from '@/types/project';

interface DashboardStatsProps {
  currentProject: Project | null;
}

const DashboardStats = ({ currentProject }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="glass-card card-hover dark:bg-[#1a1a1a] dark:border-[#333]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-[#bbbbbb]">
            Projetos Ativos
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground dark:text-[#bbbbbb]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground dark:text-[#f2f2f2]">
            {currentProject ? 1 : 0}
          </div>
          <p className="text-xs text-muted-foreground dark:text-[#bbbbbb]">
            {currentProject ? 'Projeto em análise' : 'Nenhum projeto ativo'}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card card-hover dark:bg-[#1a1a1a] dark:border-[#333]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-[#bbbbbb]">
            Análises Feitas
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground dark:text-[#bbbbbb]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground dark:text-[#f2f2f2]">
            {currentProject ? 1 : 0}
          </div>
          <p className="text-xs text-muted-foreground dark:text-[#bbbbbb]">
            Análises com IA
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card card-hover dark:bg-[#1a1a1a] dark:border-[#333]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-[#bbbbbb]">
            Tempo Economizado
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground dark:text-[#bbbbbb]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground dark:text-[#f2f2f2]">
            {currentProject ? '2h' : '0h'}
          </div>
          <p className="text-xs text-muted-foreground dark:text-[#bbbbbb]">
            Em análises manuais
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
