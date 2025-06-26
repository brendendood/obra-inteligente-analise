
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface BudgetItem {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco_unitario: number;
  categoria: string;
  ambiente: string;
  isAiGenerated: boolean;
  isCustom: boolean;
}

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: Omit<BudgetItem, 'id' | 'total'>) => void;
  environments: string[];
  categories: string[];
}

export const AddItemDialog = ({ open, onOpenChange, onAddItem, environments, categories }: AddItemDialogProps) => {
  const [formData, setFormData] = useState({
    codigo: '',
    descricao: '',
    unidade: 'm²',
    quantidade: 1,
    preco_unitario: 0,
    categoria: '',
    ambiente: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.categoria || !formData.ambiente) return;
    
    onAddItem({
      ...formData,
      isAiGenerated: false,
      isCustom: true
    });
    
    // Reset form
    setFormData({
      codigo: '',
      descricao: '',
      unidade: 'm²',
      quantidade: 1,
      preco_unitario: 0,
      categoria: '',
      ambiente: ''
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item ao Orçamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Código e Unidade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código SINAPI (opcional)</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ex: SINAPI-12345"
              />
            </div>
            <div>
              <Label htmlFor="unidade">Unidade *</Label>
              <Input
                id="unidade"
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                placeholder="Ex: m², m³, un, kg"
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição do Item *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Digite uma descrição detalhada do item ou serviço..."
              className="min-h-[80px]"
              required
            />
          </div>

          {/* Categoria e Ambiente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria *</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Ex: Alvenaria, Pintura, Instalações..."
                list="categories-list"
                required
              />
              <datalist id="categories-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <Label htmlFor="ambiente">Ambiente *</Label>
              <Input
                id="ambiente"
                value={formData.ambiente}
                onChange={(e) => setFormData({ ...formData, ambiente: e.target.value })}
                placeholder="Ex: Sala, Cozinha, Geral..."
                list="environments-list"
                required
              />
              <datalist id="environments-list">
                {environments.map((env) => (
                  <option key={env} value={env} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Quantidade e Preço */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                step="0.01"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="preco">Preço Unitário (R$) *</Label>
              <Input
                id="preco"
                type="number"
                min="0"
                step="0.01"
                value={formData.preco_unitario}
                onChange={(e) => setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          {/* Preview do total */}
          {formData.quantidade > 0 && formData.preco_unitario > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-center">
                <p className="text-sm text-green-700 mb-1">Total do Item</p>
                <p className="text-2xl font-bold text-green-800">
                  R$ {(formData.quantidade * formData.preco_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
