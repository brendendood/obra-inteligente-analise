
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Edit3, Bot, User } from 'lucide-react';

interface BudgetItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
  categoria: string;
  ambiente: string;
  isAiGenerated: boolean;
  isCustom: boolean;
}

interface EditableBudgetItemProps {
  item: BudgetItem;
  onUpdate: (id: string, updates: Partial<BudgetItem>) => void;
  onToggleSource: (id: string) => void;
}

export const EditableBudgetItem = ({ 
  item, 
  onUpdate, 
  onToggleSource 
}: EditableBudgetItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(item.quantidade.toString());
  const [editedPrice, setEditedPrice] = useState(item.preco_unitario.toString());

  const handleSave = () => {
    const newQuantity = parseFloat(editedQuantity) || 0;
    const newPrice = parseFloat(editedPrice) || 0;
    
    onUpdate(item.id, {
      quantidade: newQuantity,
      preco_unitario: newPrice,
      total: newQuantity * newPrice,
      isCustom: true
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuantity(item.quantidade.toString());
    setEditedPrice(item.preco_unitario.toString());
    setIsEditing(false);
  };

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'Movimento de Terra': 'bg-amber-100 text-amber-800 border-amber-200',
      'Estrutura': 'bg-blue-100 text-blue-800 border-blue-200',
      'Alvenaria': 'bg-red-100 text-red-800 border-red-200',
      'Instalações': 'bg-purple-100 text-purple-800 border-purple-200',
      'Acabamentos': 'bg-green-100 text-green-800 border-green-200',
      'Cobertura': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <tr className="hover:bg-gray-50/80 transition-colors">
      <td className="border border-gray-300 p-3">
        <div className="space-y-2">
          <span className="font-mono text-sm text-gray-600">{item.codigo}</span>
          <div className="flex flex-wrap gap-1">
            <Badge 
              className={getCategoryColor(item.categoria)}
              variant="secondary"
            >
              {item.categoria}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {item.ambiente}
            </Badge>
          </div>
        </div>
      </td>
      
      <td className="border border-gray-300 p-3">
        <div className="flex items-start justify-between">
          <span className="text-sm">{item.descricao}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleSource(item.id)}
            className="ml-2 flex-shrink-0"
          >
            {item.isAiGenerated ? (
              <Bot className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-green-600" />
            )}
          </Button>
        </div>
      </td>

      <td className="border border-gray-300 p-3 text-center">
        {isEditing ? (
          <Input
            type="number"
            step="0.01"
            value={editedQuantity}
            onChange={(e) => setEditedQuantity(e.target.value)}
            className="w-20 text-center"
          />
        ) : (
          <span>{item.quantidade.toFixed(2)}</span>
        )}
      </td>

      <td className="border border-gray-300 p-3 text-center">{item.unidade}</td>

      <td className="border border-gray-300 p-3 text-right">
        {isEditing ? (
          <Input
            type="number"
            step="0.01"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            className="w-24 text-right"
          />
        ) : (
          <span>R$ {item.preco_unitario.toFixed(2)}</span>
        )}
      </td>

      <td className="border border-gray-300 p-3 text-right font-semibold">
        R$ {item.total.toFixed(2)}
      </td>

      <td className="border border-gray-300 p-3 text-center">
        {isEditing ? (
          <div className="flex space-x-1">
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="hover:bg-blue-50"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
      </td>
    </tr>
  );
};
