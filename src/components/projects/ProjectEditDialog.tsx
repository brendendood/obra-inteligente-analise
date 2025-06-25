
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface ProjectEditDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: any) => void;
}

export const ProjectEditDialog = ({ project, isOpen, onClose, onSave }: ProjectEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    project_type: project?.project_type || '',
    total_area: project?.total_area || '',
    description: project?.description || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!project?.id) return;
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          project_type: formData.project_type,
          total_area: formData.total_area ? parseFloat(formData.total_area) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;

      onSave(data);
      onClose();
      
      toast({
        title: "✅ Projeto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "❌ Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Editar Projeto</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Faça as alterações necessárias nos dados do projeto.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome do Projeto
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do projeto"
              className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_type" className="text-sm font-medium text-gray-700">
              Tipo de Projeto
            </Label>
            <Select 
              value={formData.project_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}
            >
              <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="residencial">Residencial</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                <SelectItem value="reforma">Reforma</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_area" className="text-sm font-medium text-gray-700">
              Área Total (m²)
            </Label>
            <Input
              id="total_area"
              type="number"
              value={formData.total_area}
              onChange={(e) => setFormData(prev => ({ ...prev, total_area: e.target.value }))}
              placeholder="Ex: 150.5"
              className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex items-center space-x-2 hover:bg-gray-50 transition-all duration-200"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !formData.name.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
