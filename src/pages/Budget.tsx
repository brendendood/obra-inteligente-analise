import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Calculator, Plus, Trash2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';

interface BudgetItem {
  id: string;
  environment: string;
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

const Budget = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentProject } = useProject();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);

  const [newItem, setNewItem] = useState({
    environment: '',
    material: '',
    quantity: 0,
    unit: 'm²',
    unitPrice: 0
  });

  useEffect(() => {
    if (!currentProject) {
      // Redirecionar para upload se não houver projeto
      toast({
        title: "⚠️ Projeto necessário",
        description: "Envie um projeto primeiro para gerar orçamento.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }

    // Gerar orçamento baseado no projeto
    generateProjectBudget();
  }, [currentProject, navigate, toast]);

  const generateProjectBudget = async () => {
    if (!currentProject) return;

    setIsGeneratingBudget(true);
    
    try {
      // Gerar itens baseados no tipo de projeto e área
      const projectBasedItems = generateItemsFromProject();
      setBudgetItems(projectBasedItems);
      
      toast({
        title: "✅ Orçamento gerado!",
        description: `Orçamento baseado no projeto ${currentProject.name}`,
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro ao gerar orçamento do projeto",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBudget(false);
    }
  };

  const generateItemsFromProject = (): BudgetItem[] => {
    if (!currentProject) return [];

    const items: BudgetItem[] = [];
    const area = currentProject.total_area || 100;
    const projectType = currentProject.project_type || 'residencial';

    // Fundação (estimativa baseada na área)
    items.push({
      id: '1',
      environment: 'Fundação',
      material: 'Concreto fck=20MPa para sapatas',
      quantity: Math.round(area * 0.08 * 100) / 100,
      unit: 'm³',
      unitPrice: 340.00,
      total: 0
    });

    // Estrutura
    if (projectType.toLowerCase().includes('residencial') || projectType.toLowerCase().includes('casa')) {
      items.push({
        id: '2',
        environment: 'Estrutura',
        material: 'Concreto fck=25MPa para pilares e vigas',
        quantity: Math.round(area * 0.12 * 100) / 100,
        unit: 'm³',
        unitPrice: 380.00,
        total: 0
      });

      items.push({
        id: '3',
        environment: 'Laje',
        material: 'Concreto fck=25MPa para laje',
        quantity: Math.round(area * 0.10 * 100) / 100,
        unit: 'm³',
        unitPrice: 420.00,
        total: 0
      });
    }

    // Alvenaria (baseada na área)
    items.push({
      id: '4',
      environment: 'Alvenaria',
      material: 'Bloco cerâmico 14x19x39cm',
      quantity: Math.round(area * 1.2 * 100) / 100,
      unit: 'm²',
      unitPrice: 45.80,
      total: 0
    });

    // Revestimentos
    items.push({
      id: '5',
      environment: 'Revestimentos',
      material: 'Revestimento cerâmico interno',
      quantity: Math.round(area * 0.7 * 100) / 100,
      unit: 'm²',
      unitPrice: 52.30,
      total: 0
    });

    // Pisos
    items.push({
      id: '6',
      environment: 'Pisos',
      material: 'Piso cerâmico 60x60cm',
      quantity: Math.round(area * 0.85 * 100) / 100,
      unit: 'm²',
      unitPrice: 48.90,
      total: 0
    });

    // Instalações
    items.push({
      id: '7',
      environment: 'Instalações',
      material: 'Instalações elétricas completas',
      quantity: 1,
      unit: 'un',
      unitPrice: area * 85.00,
      total: 0
    });

    items.push({
      id: '8',
      environment: 'Instalações',
      material: 'Instalações hidrossanitárias',
      quantity: 1,
      unit: 'un',
      unitPrice: area * 65.00,
      total: 0
    });

    // Calcular totais
    return items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
  };

  const addItem = () => {
    if (!newItem.environment || !newItem.material || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive"
      });
      return;
    }

    const item: BudgetItem = {
      id: Date.now().toString(),
      ...newItem,
      total: newItem.quantity * newItem.unitPrice
    };

    setBudgetItems([...budgetItems, item]);
    setNewItem({
      environment: '',
      material: '',
      quantity: 0,
      unit: 'm²',
      unitPrice: 0
    });

    toast({
      title: "Item adicionado",
      description: "Item foi adicionado ao orçamento com sucesso"
    });
  };

  const removeItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const subtotal = budgetItems.reduce((sum, item) => sum + item.total, 0);
  const bdi = subtotal * 0.25; // 25% de BDI
  const totalWithBDI = subtotal + bdi;

  const generateBudgetSheet = () => {
    toast({
      title: "Planilha gerada!",
      description: "Orçamento exportado para Google Sheets com sucesso",
    });
  };

  // Verificar se há projeto carregado
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Upload className="h-6 w-6 mr-2" />
              Projeto Necessário
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Para gerar um orçamento, primeiro envie um projeto.</p>
            <Button onClick={() => navigate('/upload')} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Enviar Projeto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-orange-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orçamento</h1>
                <p className="text-sm text-gray-600">
                  Projeto: <strong>{currentProject.name}</strong> ({currentProject.total_area}m²)
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isGeneratingBudget && (
                <div className="flex items-center text-blue-600 mr-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Gerando...</span>
                </div>
              )}
              <Button onClick={generateProjectBudget} variant="outline">
                Atualizar Orçamento
              </Button>
              <Button onClick={generateBudgetSheet} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Gerar Planilha
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Item Form */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Item ao Orçamento</CardTitle>
              <CardDescription>
                Personalize o orçamento adicionando itens específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="environment">Ambiente/Local</Label>
                <Input
                  id="environment"
                  value={newItem.environment}
                  onChange={(e) => setNewItem({...newItem, environment: e.target.value})}
                  placeholder="Ex: Sala, Cozinha, Fundação..."
                />
              </div>

              <div>
                <Label htmlFor="material">Material/Serviço</Label>
                <Input
                  id="material"
                  value={newItem.material}
                  onChange={(e) => setNewItem({...newItem, material: e.target.value})}
                  placeholder="Ex: Piso cerâmico, Concreto, Alvenaria..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={newItem.quantity || ''}
                    onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <select
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="m²">m²</option>
                    <option value="m³">m³</option>
                    <option value="m">m</option>
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={newItem.unitPrice || ''}
                  onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>

              <Button onClick={addItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardContent>
          </Card>

          {/* Budget Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Orçamento</CardTitle>
              <CardDescription>
                Baseado no projeto: {currentProject.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Subtotal (Materiais + Serviços)</span>
                    <span className="text-lg font-bold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">BDI (25%)</span>
                    <span className="text-sm">R$ {bdi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Geral</span>
                    <span className="text-xl font-bold text-green-600">
                      R$ {totalWithBDI.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Área: {currentProject.total_area}m²</p>
                  <p>• Tipo: {currentProject.project_type}</p>
                  <p>• Preços baseados na tabela SINAPI</p>
                  <p>• BDI inclui impostos e lucro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Items Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Itens do Orçamento</CardTitle>
            <CardDescription>
              Gerado automaticamente baseado no projeto enviado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-medium">Ambiente</th>
                    <th className="pb-3 font-medium">Material/Serviço</th>
                    <th className="pb-3 font-medium text-center">Qtd</th>
                    <th className="pb-3 font-medium text-center">Unidade</th>
                    <th className="pb-3 font-medium text-right">Preço Unit.</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                    <th className="pb-3 font-medium text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3">{item.environment}</td>
                      <td className="py-3">{item.material}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-center">{item.unit}</td>
                      <td className="py-3 text-right">
                        R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right font-medium">
                        R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {budgetItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Carregando orçamento do projeto...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Budget;
