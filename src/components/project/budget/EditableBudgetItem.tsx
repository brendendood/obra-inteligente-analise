
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit3, Check, X } from 'lucide-react';

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
  onRemove: (id: string) => void;
}

export const EditableBudgetItem = ({ item, onUpdate, onRemove }: EditableBudgetItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(item);

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(item);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="bg-yellow-50/50">
        <td className="border border-gray-300 p-2">
          <Input
            value={editData.codigo}
            onChange={(e) => setEditData({ ...editData, codigo: e.target.value })}
            className="h-8 text-xs"
          />
        </td>
        <td className="border border-gray-300 p-2">
          <Input
            value={editData.descricao}
            onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
            className="h-8 text-xs"
          />
        </td>
        <td className="border border-gray-300 p-2">
          <Input
            type="number"
            value={editData.quantidade}
            onChange={(e) => setEditData({ ...editData, quantidade: parseFloat(e.target.value) || 0 })}
            className="h-8 text-xs w-20"
          />
        </td>
        <td className="border border-gray-300 p-2 text-center text-xs">
          {editData.unidade}
        </td>
        <td className="border border-gray-300 p-2">
          <Input
            type="number"
            value={editData.preco_unitario}
            onChange={(e) => setEditData({ ...editData, preco_unitario: parseFloat(e.target.value) || 0 })}
            className="h-8 text-xs w-24"
          />
        </td>
        <td className="border border-gray-300 p-2 text-right text-xs font-medium">
          R$ {(editData.quantidade * editData.preco_unitario).toFixed(2)}
        </td>
        <td className="border border-gray-300 p-2">
          <div className="flex space-x-1 justify-center">
            <Button
              onClick={handleSave}
              size="sm"
              className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`hover:bg-gray-50 ${item.isCustom ? 'bg-blue-50/30' : ''}`}>
      <td className="border border-gray-300 p-3 text-xs">
        {item.codigo}
        {item.isAiGenerated && (
          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" title="Gerado por IA" />
        )}
      </td>
      <td className="border border-gray-300 p-3 text-xs">{item.descricao}</td>
      <td className="border border-gray-300 p-3 text-center text-xs">{item.quantidade}</td>
      <td className="border border-gray-300 p-3 text-center text-xs">{item.unidade}</td>
      <td className="border border-gray-300 p-3 text-right text-xs">R$ {item.preco_unitario.toFixed(2)}</td>
      <td className="border border-gray-300 p-3 text-right text-xs font-medium">R$ {item.total.toFixed(2)}</td>
      <td className="border border-gray-300 p-3">
        <div className="flex space-x-1 justify-center">
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => onRemove(item.id)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
