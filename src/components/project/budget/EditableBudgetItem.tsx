
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { BudgetItem } from '@/utils/budgetGenerator';

interface EditableBudgetItemProps {
  item: BudgetItem;
  onUpdate: (id: string, updates: Partial<BudgetItem>) => void;
  onRemove: (id: string) => void;
}

export const EditableBudgetItem = ({ item, onUpdate, onRemove }: EditableBudgetItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    descricao: item.descricao,
    quantidade: item.quantidade,
    preco_unitario: item.preco_unitario,
    unidade: item.unidade
  });

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      descricao: item.descricao,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      unidade: item.unidade
    });
    setIsEditing(false);
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors w-full rounded-md">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header com badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              {item.codigo && (
                <Badge variant="outline" className="text-xs rounded-md">
                  {item.codigo}
                </Badge>
              )}
              <Badge className={`text-xs rounded-md ${
                item.isAiGenerated 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-green-100 text-green-700 border-green-200'
              }`}>
                {item.isAiGenerated ? '🤖 IA' : '👤 Manual'}
              </Badge>
              <Badge variant="secondary" className="text-xs rounded-md">
                {item.categoria}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 rounded-md"
                  >
                    <Edit3 className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(item.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="h-8 w-8 p-0 hover:bg-green-50 rounded-md"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="h-8 w-8 p-0 hover:bg-gray-50 rounded-md"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Descrição do Item
            </label>
            {!isEditing ? (
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                {item.descricao}
              </p>
            ) : (
              <Textarea
                value={editData.descricao}
                onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
                className="min-h-[60px] text-sm rounded-md"
                placeholder="Digite a descrição do item..."
              />
            )}
          </div>

          {/* Dados técnicos em grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Quantidade
              </label>
              {!isEditing ? (
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {Math.round(editData.quantidade).toLocaleString('pt-BR')}
                  </span>
                </div>
              ) : (
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={Math.round(editData.quantidade)}
                  onChange={(e) => setEditData({ ...editData, quantidade: Math.round(parseFloat(e.target.value) || 0) })}
                  className="text-center font-semibold rounded-md"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Unidade
              </label>
              {!isEditing ? (
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <span className="text-sm font-medium text-gray-700">
                    {editData.unidade}
                  </span>
                </div>
              ) : (
                <Input
                  type="text"
                  value={editData.unidade}
                  onChange={(e) => setEditData({ ...editData, unidade: e.target.value })}
                  className="text-center rounded-md"
                  placeholder="Ex: m², un, kg"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Preço Unitário
              </label>
              {!isEditing ? (
                <div className="bg-blue-50 p-3 rounded-md text-center">
                  <span className="text-lg font-semibold text-blue-700 whitespace-nowrap">
                    R$ {editData.preco_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ) : (
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editData.preco_unitario}
                  onChange={(e) => setEditData({ ...editData, preco_unitario: parseFloat(e.target.value) || 0 })}
                  className="text-center font-semibold rounded-md"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Total
              </label>
              <div className="bg-green-50 p-3 rounded-md text-center border-2 border-green-200">
                <span className="text-lg font-bold text-green-700 whitespace-nowrap block">
                  R$ {(Math.round(editData.quantidade) * editData.preco_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Ambiente */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium">Ambiente:</span>
            <Badge variant="outline" className="text-xs rounded-md">
              {item.ambiente}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
