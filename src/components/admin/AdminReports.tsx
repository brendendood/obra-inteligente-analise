
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Brain,
  AlertTriangle
} from 'lucide-react';
import { ReportsFilters } from './reports/ReportsFilters';
import { RevenueChart } from './reports/RevenueChart';
import { UserEngagementChart } from './reports/UserEngagementChart';
import { AIUsageChart } from './reports/AIUsageChart';
import { PredictiveInsights } from './reports/PredictiveInsights';
import { useAdminReports } from '@/hooks/useAdminReports';

export const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    reportData,
    loading,
    filters,
    updateFilters,
    exportReport,
  } = useAdminReports();

  const reportTabs = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: BarChart3,
    },
    {
      id: 'revenue',
      label: 'Receita',
      icon: DollarSign,
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
    },
    {
      id: 'ai-usage',
      label: 'Uso da IA',
      icon: Brain,
    },
    {
      id: 'predictive',
      label: 'Insights Preditivos',
      icon: TrendingUp,
    }
  ];

  const handleExport = async (format: 'pdf' | 'csv', type: string) => {
    try {
      await exportReport(format, type, filters);
    } catch (error) {
      console.error('Erro na exportação:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Inteligentes</h1>
          <p className="text-gray-600 mt-1">Análises avançadas e exportações estratégicas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExport('csv', 'complete')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button 
            onClick={() => handleExport('pdf', 'executive')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Relatório PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <ReportsFilters 
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {reportData?.totalRevenue?.toLocaleString('pt-BR') || '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {reportData?.revenueGrowth > 0 ? '+' : ''}{reportData?.revenueGrowth?.toFixed(1)}% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usuários Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.activeUsers?.toLocaleString('pt-BR') || '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {reportData?.userGrowth > 0 ? '+' : ''}{reportData?.userGrowth?.toFixed(1)}% crescimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Custo IA (Mês)
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $ {reportData?.aiCostMonth?.toFixed(2) || '0.00'}
            </div>
            <div className="flex items-center mt-1">
              {reportData?.aiCostTrend === 'up' && (
                <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
              )}
              <p className="text-xs text-gray-500">
                {reportData?.aiUsageCount || 0} chamadas este mês
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa Conversão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.conversionRate?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Free → Paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={reportData?.revenueChart} />
            <UserEngagementChart data={reportData?.engagementChart} />
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <RevenueChart 
            data={reportData?.revenueChart} 
            detailed={true}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserEngagementChart 
            data={reportData?.engagementChart}
            detailed={true}
          />
        </TabsContent>

        <TabsContent value="ai-usage" className="mt-6">
          <AIUsageChart data={reportData?.aiUsageChart} />
        </TabsContent>

        <TabsContent value="predictive" className="mt-6">
          <PredictiveInsights data={reportData?.predictiveData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
