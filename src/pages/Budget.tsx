
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Calculator, Plus, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: '1',
      environment: 'Sala',
      material: 'Piso cerâmico 60x60cm',
      quantity: 25,
      unit: 'm²',
      unitPrice: 45.80,
      total: 1145.00
    },
    {
      id: '2',
      environment: 'Cozinha',
      material: 'Revestimento cerâmico 30x60cm',
      quantity: 15,
      unit: 'm²',
      unitPrice: 32.50,
      total: 487.50
    },
    {
      id: '3',
      environment: 'Fundação',
      material: 'Concreto fck=20MPa',
      quantity: 8.5,
      unit: 'm³',
      unitPrice: 340.00,
      total: 2890.00
    }
  ]);

  const [newItem, setNewItem] = useState({
    environment: '',
    material: '',
    quantity: 0,
    unit: 'm²',
    unitPrice: 0
  });

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
              <h1 className="text-2xl font-bold text-gray-900">Quantitativos e Orçamento</h1>
            </div>
            <Button onClick={generateBudgetSheet} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Gerar Planilha
            </Button>
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
                Preencha os dados do material ou serviço
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
                Valores baseados em preços SINAPI e mercado
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
                  <p>• Preços baseados na tabela SINAPI</p>
                  <p>• BDI inclui impostos e lucro</p>
                  <p>• Valores podem variar por região</p>
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
              Lista detalhada de todos os materiais e serviços
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Budget;
