import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectStore } from '@/stores/projectStore';
import { useAuth } from '@/hooks/useAuth';

export const DashboardDebugInfo = () => {
  const { projects } = useProjectStore();
  const { user } = useAuth();

  const projectsWithBudget = projects.filter(p => {
    const hasBudgetData = (p.analysis_data as any)?.budget_data?.total_com_bdi && 
                         (p.analysis_data as any).budget_data.total_com_bdi > 0;
    return hasBudgetData;
  });

  const totalInvestment = projectsWithBudget.reduce((sum, project) => {
    const cost = (project.analysis_data as any)?.budget_data?.total_com_bdi || 0;
    return sum + cost;
  }, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-700">🔍 Debug Info - Investimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div>
            <strong>Usuário Atual:</strong> {user?.email} (ID: {user?.id})
          </div>
          
          <div>
            <strong>Total de Projetos:</strong> {projects.length}
          </div>
          
          <div>
            <strong>Projetos com Orçamento:</strong> {projectsWithBudget.length}
          </div>
          
          <div>
            <strong>Investimento Total Calculado:</strong> {formatCurrency(totalInvestment)}
          </div>
          
          <div>
            <strong>Detalhes dos Projetos:</strong>
            <ul className="mt-2 space-y-1">
              {projects.map((project, index) => {
                const budgetValue = (project.analysis_data as any)?.budget_data?.total_com_bdi || 0;
                return (
                  <li key={index} className="flex justify-between">
                    <span>{project.name} ({project.total_area}m²)</span>
                    <span className={budgetValue > 0 ? 'text-green-600' : 'text-gray-400'}>
                      {formatCurrency(budgetValue)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};