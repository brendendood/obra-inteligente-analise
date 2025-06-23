
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
}

const AdminStatsCard = ({ title, value, description, icon: Icon, trend }: AdminStatsCardProps) => {
  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 mb-1">
          {value}
        </div>
        <p className="text-xs text-slate-600 mb-2">
          {description}
        </p>
        {trend && (
          <div className="flex items-center space-x-1">
            <span className={`text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-slate-500">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStatsCard;
