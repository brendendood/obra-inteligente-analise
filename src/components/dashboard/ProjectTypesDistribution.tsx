
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Building, Home, Warehouse, MapPin } from 'lucide-react';

interface ProjectTypesDistributionProps {
  stats: {
    projectsByType: Record<string, number>;
    totalProjects: number;
  };
}

export const ProjectTypesDistribution = ({ stats }: ProjectTypesDistributionProps) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residencial':
        return Home;
      case 'comercial':
        return Building;
      case 'industrial':
        return Warehouse;
      default:
        return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residencial':
        return 'bg-blue-100 text-blue-800';
      case 'comercial':
        return 'bg-green-100 text-green-800';
      case 'industrial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const types = Object.entries(stats.projectsByType || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  if (types.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <PieChart className="h-5 w-5 text-purple-600" />
            <span>Tipos de Projetos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum projeto cadastrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <PieChart className="h-5 w-5 text-purple-600" />
          <span>Tipos de Projetos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {types.map(([type, count]) => {
            const Icon = getTypeIcon(type);
            const percentage = stats.totalProjects > 0 ? (count / stats.totalProjects) * 100 : 0;
            
            return (
              <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{type}</p>
                    <p className="text-sm text-gray-600">{count} projetos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{Math.round(percentage)}%</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
