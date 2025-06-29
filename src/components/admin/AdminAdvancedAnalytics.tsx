
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, Users, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdvancedAnalyticsCards } from './analytics/AdvancedAnalyticsCards';
import { UserEngagementTable } from './analytics/UserEngagementTable';
import { UserSegmentsManager } from './analytics/UserSegmentsManager';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';

export const AdminAdvancedAnalytics = () => {
  const {
    analytics,
    userEngagement,
    loading,
    error,
    refreshAnalytics,
    refreshEngagement,
    triggerSegmentUpdate,
  } = useAdvancedAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics avançado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar analytics</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={refreshAnalytics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics não disponível</h3>
              <p className="text-gray-500 mb-4">
                Não foi possível carregar os dados de analytics avançado.
              </p>
              <Button onClick={refreshAnalytics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Carregar Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Avançado</h1>
          <p className="text-gray-600 mt-1">Inteligência de dados e comportamento dos usuários</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={triggerSegmentUpdate}>
            <Target className="h-4 w-4 mr-2" />
            Atualizar Segmentos
          </Button>
          <Button variant="outline" onClick={() => {
            refreshAnalytics();
            refreshEngagement();
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Engajamento
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Segmentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <AdvancedAnalyticsCards analytics={analytics} />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <UserEngagementTable userEngagement={userEngagement} />
        </TabsContent>

        <TabsContent value="segments" className="mt-6">
          <UserSegmentsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
