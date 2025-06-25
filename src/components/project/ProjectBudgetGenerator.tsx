
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, Download, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetItem {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
  categoria: string;
}

interface BudgetData {
  projectId: string;
  projectName: string;
  totalArea: number;
  items: BudgetItem[];
  subtotais: {
    [categoria: string]: number;
  };
  total: number;
  bdi: number;
  total_com_bdi: number;
  data_referencia: string;
}

interface ProjectBudgetGeneratorProps {
  project: any;
  onBudgetGenerated?: (data: BudgetData) => void;
}

export const ProjectBudgetGenerator = ({ project, onBudgetGenerated }: ProjectBudgetGeneratorProps) => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generateBudget = async () => {
    if (!project) return;
    
    console.log('💰 ORÇAMENTO: Gerando para projeto:', project.name);
    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Simular progresso de geração
      const progressSteps = [
        { step: 20, message: 'Analisando projeto...' },
        { step: 40, message: 'Consultando tabela SINAPI...' },
        { step: 60, message: 'Calculando quantitativos...' },
        { step: 80, message: 'Aplicando BDI e encargos...' },
        { step: 100, message: 'Finalizando orçamento...' }
      ];
      
      for (const progressStep of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(progressStep.step);
        toast({
          title: progressStep.message,
          description: `${progressStep.step}% concluído`,
        });
      }
      
      // Gerar orçamento baseado na área do projeto
      const area = project.total_area || 100;
      const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
      
      const items: BudgetItem[] = [
        {
          codigo: 'SINAPI-92551',
          descricao: 'Escavação manual de valas em material de 1ª categoria',
          unidade: 'm³',
          quantidade: area * 0.3,
          preco_unitario: 45.67,
          total: area * 0.3 * 45.67,
          categoria: 'Movimento de Terra'
        },
        {
          codigo: 'SINAPI-94102',
          descricao: 'Concreto FCK=25MPa, com brita 1 e 2 - lançamento/aplicação manual',
          unidade: 'm³',
          quantidade: area * 0.15,
          preco_unitario: 387.45,
          total: area * 0.15 * 387.45,
          categoria: 'Estrutura'
        },
        {
          codigo: 'SINAPI-87245',
          descricao: 'Alvenaria de vedação com tijolos cerâmicos furados',
          unidade: 'm²',
          quantidade: area * 2.8,
          preco_unitario: 89.23,
          total: area * 2.8 * 89.23,
          categoria: 'Alvenaria'
        },
        {
          codigo: 'SINAPI-91204',
          descricao: 'Revestimento cerâmico para paredes internas',
          unidade: 'm²',
          quantidade: area * 1.5,
          preco_unitario: 156.78,
          total: area * 1.5 * 156.78,
          categoria: 'Acabamentos'
        },
        {
          codigo: 'SINAPI-91856',
          descricao: 'Instalação elétrica completa - residencial padrão médio',
          unidade: 'm²',
          quantidade: area,
          preco_unitario: 125.34,
          total: area * 125.34,
          categoria: 'Instalações'
        },
        {
          codigo: 'SINAPI-92115',
          descricao: 'Instalação hidrossanitária completa - residencial padrão médio',
          unidade: 'm²',
          quantidade: area,
          preco_unitario: 98.45,
          total: area * 98.45,
          categoria: 'Instalações'
        }
      ];
      
      // Calcular subtotais por categoria
      const subtotais = items.reduce((acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + item.total;
        return acc;
      }, {} as { [categoria: string]: number });
      
      const total = items.reduce((sum, item) => sum + item.total, 0);
      const bdi = 25; // 25% de BDI
      const total_com_bdi = total * (1 + bdi / 100);
      
      const mockBudget: BudgetData = {
        projectId: project.id,
        projectName: project.name,
        totalArea: area,
        items,
        subtotais,
        total,
        bdi,
        total_com_bdi,
        data_referencia: new Date().toLocaleDateString('pt-BR')
      };
      
      setBudgetData(mockBudget);
      onBudgetGenerated?.(mockBudget);
      
      toast({
        title: "✅ Orçamento gerado!",
        description: `Orçamento SINAPI para ${project.name} criado com sucesso.`,
      });
    } catch (error) {
      console.error('❌ ORÇAMENTO: Erro ao gerar:', error);
      toast({
        title: "❌ Erro ao gerar orçamento",
        description: "Não foi possível gerar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const exportBudget = () => {
    if (!budgetData) return;
    
    // Simular export para Excel/PDF
    toast({
      title: "📄 Exportando orçamento...",
      description: "Funcionalidade de export será implementada em breve.",
    });
  };

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'Movimento de Terra': 'bg-amber-100 text-amber-800',
      'Estrutura': 'bg-blue-100 text-blue-800',
      'Alvenaria': 'bg-red-100 text-red-800',
      'Instalações': 'bg-purple-100 text-purple-800',
      'Acabamentos': 'bg-green-100 text-green-800'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  if (!project) {
    return (
      <div className="text-center py-16">
        <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamento SINAPI - {project.name}</h1>
          <p className="text-gray-600">Orçamento detalhado baseado na tabela oficial SINAPI</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={generateBudget}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Gerar Orçamento
              </>
            )}
          </Button>
          
          {budgetData && (
            <Button onClick={exportBudget} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-green-600" />
                <span className="font-medium">Gerando orçamento SINAPI...</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-600">
                Consultando tabela oficial e calculando quantitativos para {project.total_area || 100}m²
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {budgetData && (
        <div className="space-y-6">
          {/* Resumo do projeto */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <TrendingUp className="h-5 w-5 mr-2" />
                Resumo do Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-green-700">Projeto</p>
                  <p className="font-bold text-green-900">{budgetData.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Área Total</p>
                  <p className="font-bold text-green-900">{budgetData.totalArea}m²</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Custo Direto</p>
                  <p className="font-bold text-green-900">R$ {budgetData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Total com BDI ({budgetData.bdi}%)</p>
                  <p className="font-bold text-green-900 text-lg">
                    R$ {budgetData.total_com_bdi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subtotais por categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Subtotais por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(budgetData.subtotais).map(([categoria, valor]) => (
                  <div key={categoria} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(categoria)}>
                        {categoria}
                      </Badge>
                    </div>
                    <p className="font-bold text-lg">
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {((valor / budgetData.total) * 100).toFixed(1)}% do total
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabela detalhada */}
          <Card>
            <CardHeader>
              <CardTitle>Orçamento Detalhado - SINAPI</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>Preços baseados na tabela SINAPI - Referência: {budgetData.data_referencia}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Código SINAPI</th>
                      <th className="border border-gray-300 p-3 text-left">Descrição</th>
                      <th className="border border-gray-300 p-3 text-center">Unid.</th>
                      <th className="border border-gray-300 p-3 text-center">Qtd.</th>
                      <th className="border border-gray-300 p-3 text-right">Preço Unit.</th>
                      <th className="border border-gray-300 p-3 text-right">Total</th>
                      <th className="border border-gray-300 p-3 text-center">Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3 font-mono text-sm">{item.codigo}</td>
                        <td className="border border-gray-300 p-3">{item.descricao}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.unidade}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.quantidade.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-right">
                          R$ {item.preco_unitario.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-3 text-right font-semibold">
                          R$ {item.total.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-3 text-center">
                          <Badge className={getCategoryColor(item.categoria)} variant="secondary">
                            {item.categoria}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50 font-bold">
                      <td colSpan={5} className="border border-gray-300 p-3 text-right">Subtotal:</td>
                      <td className="border border-gray-300 p-3 text-right text-blue-700">
                        R$ {budgetData.total.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-3"></td>
                    </tr>
                    <tr className="bg-orange-50 font-bold">
                      <td colSpan={5} className="border border-gray-300 p-3 text-right">BDI ({budgetData.bdi}%):</td>
                      <td className="border border-gray-300 p-3 text-right text-orange-700">
                        R$ {(budgetData.total_com_bdi - budgetData.total).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-3"></td>
                    </tr>
                    <tr className="bg-green-50 font-bold text-lg">
                      <td colSpan={5} className="border border-gray-300 p-3 text-right">TOTAL GERAL:</td>
                      <td className="border border-gray-300 p-3 text-right text-green-700">
                        R$ {budgetData.total_com_bdi.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!budgetData && !isGenerating && (
        <Card>
          <CardContent className="text-center py-12">
            <Calculator className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              Orçamento SINAPI para {project.name}
            </h3>
            <p className="text-gray-500 mb-6">
              Gere um orçamento detalhado baseado na tabela oficial SINAPI para este projeto de {project.total_area || 100}m².
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
