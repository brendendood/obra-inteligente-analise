
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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

interface AddItemDialogProps {
  onAddItem: (item: BudgetItem) => void;
  environments: string[];
  categories: string[];
}

export const AddItemDialog = ({ onAddItem, environments, categories }: AddItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    descricao: '',
    unidade: 'm²',
    quantidade: 1,
    preco_unitario: 0,
    categoria: '',
    ambiente: '',
    newCategoria: '',
    newAmbiente: '',
    useNewCategoria: false,
    useNewAmbiente: false
  });
  const { toast } = useToast();

  const units = ['m²', 'm³', 'm', 'un', 'kg', 'ton', 'l', 'cx', 'sc'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.codigo) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha código e descrição do item.",
        variant: "destructive",
      });
      return;
    }

    const finalCategoria = formData.useNewCategoria ? formData.newCategoria : formData.categoria;
    const finalAmbiente = formData.useNewAmbiente ? formData.newAmbiente : formData.ambiente;

    if (!finalCategoria || !finalAmbiente) {
      toast({
        title: "❌ Categoria e ambiente obrigatórios",
        description: "Selecione ou escreva categoria e ambiente.",
        variant: "destructive",
      });
      return;
    }

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      codigo: formData.codigo,
      descricao: formData.descricao,
      unidade: formData.unidade,
      quantidade: formData.quantidade,
      preco_unitario: formData.preco_unitario,
      total: formData.quantidade * formData.preco_unitario,
      categoria: finalCategoria,
      ambiente: finalAmbiente,
      isAiGenerated: false,
      isCustom: true
    };

    onAddItem(newItem);
    
    // Reset form
    setFormData({
      codigo: '',
      descricao: '',
      unidade: 'm²',
      quantidade: 1,
      preco_unitario: 0,
      categoria: '',
      ambiente: '',
      newCategoria: '',
      newAmbiente: '',
      useNewCategoria: false,
      useNewAmbiente: false
    });
    
    setOpen(false);
    
    toast({
      title: "✅ Item adicionado!",
      description: `${newItem.descricao} adicionado ao orçamento.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item ao Orçamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código SINAPI *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ex: SINAPI-12345"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="unidade">Unidade</Label>
              <Select value={formData.unidade} onValueChange={(value) => setFormData({ ...formData, unidade: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição detalhada do item/serviço"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.01"
                min="0"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <Label htmlFor="preco">Preço Unitário (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco_unitario}
                onChange={(e) => setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Categoria Selection */}
          <div>
            <Label>Categoria *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existing-categoria"
                  name="categoria-type"
                  checked={!formData.useNewCategoria}
                  onChange={() => setFormData({ ...formData, useNewCategoria: false })}
                />
                <label htmlFor="existing-categoria" className="text-sm">Usar categoria existente</label>
              </div>
              
              {!formData.useNewCategoria && (
                <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="new-categoria"
                  name="categoria-type"
                  checked={formData.useNewCategoria}
                  onChange={() => setFormData({ ...formData, useNewCategoria: true })}
                />
                <label htmlFor="new-categoria" className="text-sm">Criar nova categoria</label>
              </div>
              
              {formData.useNewCategoria && (
                <Input
                  value={formData.newCategoria}
                  onChange={(e) => setFormData({ ...formData, newCategoria: e.target.value })}
                  placeholder="Digite nova categoria"
                />
              )}
            </div>
          </div>

          {/* Ambiente Selection */}
          <div>
            <Label>Ambiente *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existing-ambiente"
                  name="ambiente-type"
                  checked={!formData.useNewAmbiente}
                  onChange={() => setFormData({ ...formData, useNewAmbiente: false })}
                />
                <label htmlFor="existing-ambiente" className="text-sm">Usar ambiente existente</label>
              </div>
              
              {!formData.useNewAmbiente && (
                <Select value={formData.ambiente} onValueChange={(value) => setFormData({ ...formData, ambiente: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.map((env) => (
                      <SelectItem key={env} value={env}>{env}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="new-ambiente"
                  name="ambiente-type"
                  checked={formData.useNewAmbiente}
                  onChange={() => setFormData({ ...formData, useNewAmbiente: true })}
                />
                <label htmlFor="new-ambiente" className="text-sm">Criar novo ambiente</label>
              </div>
              
              {formData.useNewAmbiente && (
                <Input
                  value={formData.newAmbiente}
                  onChange={(e) => setFormData({ ...formData, newAmbiente: e.target.value })}
                  placeholder="Digite novo ambiente"
                />
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Total do item:</strong> R$ {(formData.quantidade * formData.preco_unitario).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Adicionar Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
