
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Download, RefreshCw } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ProjectSpecificBudget = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const [budgetData, setBudgetData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateBudget = async () => {
    if (!currentProject) return;
    
    console.log('💰 ORÇAMENTO: Gerando para projeto:', currentProject.name);
    setIsGenerating(true);
    
    try {
      // Simulação de geração de orçamento específico do projeto
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockBudget = {
        projectId: currentProject.id,
        projectName: currentProject.name,
        totalArea: currentProject.total_area || 100,
        items: [
          { item: 'Fundação', quantity: currentProject.total_area || 100, unit: 'm²', unitPrice: 120, total: (currentProject.total_area || 100) * 120 },
          { item: 'Estrutura', quantity: currentProject.total_area || 100, unit: 'm²', unitPrice: 250, total: (currentProject.total_area || 100) * 250 },
          { item: 'Alvenaria', quantity: currentProject.total_area || 100, unit: 'm²', unitPrice: 180, total: (currentProject.total_area || 100) * 180 },
          { item: 'Acabamento', quantity: currentProject.total_area || 100, unit: 'm²', unitPrice: 200, total: (currentProject.total_area || 100) * 200 }
        ]
      };
      
      setBudgetData(mockBudget);
      
      toast({
        title: "✅ Orçamento gerado!",
        description: `Orçamento específico para ${currentProject.name} criado com sucesso.`,
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
    }
  };

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
          <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orçamento - {currentProject.name}</h1>
            <p className="text-gray-600">Orçamento específico baseado nos dados deste projeto</p>
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
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-green-600" />
              Orçamento Detalhado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {budgetData ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Informações do Projeto</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-blue-700">Projeto:</span> {budgetData.projectName}
                    </div>
                    <div>
                      <span className="text-blue-700">Área Total:</span> {budgetData.totalArea}m²
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Item</th>
                        <th className="border border-gray-300 p-3 text-center">Quantidade</th>
                        <th className="border border-gray-300 p-3 text-center">Unidade</th>
                        <th className="border border-gray-300 p-3 text-right">Preço Unit.</th>
                        <th className="border border-gray-300 p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetData.items.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3">{item.item}</td>
                          <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                          <td className="border border-gray-300 p-3 text-center">{item.unit}</td>
                          <td className="border border-gray-300 p-3 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                          <td className="border border-gray-300 p-3 text-right font-semibold">R$ {item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-green-50 font-bold">
                        <td colSpan={4} className="border border-gray-300 p-3 text-right">Total Geral:</td>
                        <td className="border border-gray-300 p-3 text-right text-green-700">
                          R$ {budgetData.items.reduce((sum: number, item: any) => sum + item.total, 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Orçamento Específico para {currentProject.name}
                </h3>
                <p className="text-gray-500 mb-6">
                  Clique em "Gerar Orçamento" para criar um orçamento detalhado baseado nos dados deste projeto específico.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificBudget;
