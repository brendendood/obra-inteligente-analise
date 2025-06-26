import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Building, Home, Warehouse, MapPin } from 'lucide-react';
interface ProjectTypesDistributionProps {
  stats: {
    projectsByType: Record<string, number>;
    totalProjects: number;
  };
}
export const ProjectTypesDistribution = ({
  stats
}: ProjectTypesDistributionProps) => {
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
  const types = Object.entries(stats.projectsByType || {}).sort(([, a], [, b]) => b - a).slice(0, 4);
  if (types.length === 0) {
    return <Card className="border-0 shadow-lg">
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
      </Card>;
  }
  return;
};