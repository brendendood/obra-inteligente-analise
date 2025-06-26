
import { Card, CardContent } from '@/components/ui/card';
import { Building2, CheckCircle, Clock, BarChart3 } from 'lucide-react';

interface ProjectsStatsProps {
  totalProjects: number;
  processedProjects: number;
}

const ProjectsStats = ({ totalProjects, processedProjects }: ProjectsStatsProps) => {
  const pendingProjects = totalProjects - processedProjects;
  const processingRate = totalProjects > 0 ? Math.round((processedProjects / totalProjects) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total de Projetos */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projetos Processados */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Analisados</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{processedProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projetos Pendentes */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Processamento */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Taxa</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{processingRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsStats;
