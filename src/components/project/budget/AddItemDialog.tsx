
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddItemDialogProps {
  onAddItem: (item: any) => void;
  environments: string[];
  categories: string[];
}

export const AddItemDialog = ({ onAddItem, environments, categories }: AddItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    ambiente: '',
    categoria: '',
    descricao: '',
    quantidade: '',
    unidade: 'm²',
    preco_unitario: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.ambiente || !newItem.categoria || !newItem.descricao || 
        !newItem.quantidade || !newItem.preco_unitario) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar o item.",
        variant: "destructive",
      });
      return;
    }

    const quantidade = parseFloat(newItem.quantidade);
    const preco_unitario = parseFloat(newItem.preco_unitario);

    onAddItem({
      id: Date.now().toString(),
      codigo: 'CUSTOM-' + Date.now(),
      descricao: newItem.descricao,
      unidade: newItem.unidade,
      quantidade,
      preco_unitario,
      total: quantidade * preco_unitario,
      categoria: newItem.categoria,
      ambiente: newItem.ambiente,
      isAiGenerated: false,
      isCustom: true
    });

    setNewItem({
      ambiente: '',
      categoria: '',
      descricao: '',
      quantidade: '',
      unidade: 'm²',
      preco_unitario: ''
    });

    setOpen(false);
    
    toast({
      title: "Item adicionado",
      description: "O novo item foi adicionado ao orçamento com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ambiente">Ambiente</Label>
              <Select value={newItem.ambiente} onValueChange={(value) => setNewItem({...newItem, ambiente: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env} value={env}>{env}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={newItem.categoria} onValueChange={(value) => setNewItem({...newItem, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição do Item</Label>
            <Input
              id="descricao"
              value={newItem.descricao}
              onChange={(e) => setNewItem({...newItem, descricao: e.target.value})}
              placeholder="Ex: Piso cerâmico 60x60cm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.01"
                value={newItem.quantidade}
                onChange={(e) => setNewItem({...newItem, quantidade: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="unidade">Unidade</Label>
              <Select value={newItem.unidade} onValueChange={(value) => setNewItem({...newItem, unidade: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m²">m²</SelectItem>
                  <SelectItem value="m³">m³</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="un">un</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="ton">ton</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preco">Preço Unit. (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={newItem.preco_unitario}
                onChange={(e) => setNewItem({...newItem, preco_unitario: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Adicionar Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
