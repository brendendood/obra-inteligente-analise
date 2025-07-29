
import { useState, useEffect } from 'react';
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
import { Save, X, Calendar } from 'lucide-react';

interface ProjectEditDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: any) => void;
}

export const ProjectEditDialog = ({ project, isOpen, onClose, onSave }: ProjectEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    project_type: '',
    total_area: '',
    description: '',
    project_status: 'draft',
    start_date: '',
    end_date: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Atualizar formulário quando o projeto muda
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        project_type: project.project_type || '',
        total_area: project.total_area?.toString() || '',
        description: project.description || '',
        project_status: project.project_status || 'draft',
        start_date: project.start_date || '',
        end_date: project.end_date || ''
      });
    }
  }, [project]);

  const handleSave = async () => {
    if (!project?.id) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        name: formData.name,
        project_type: formData.project_type,
        total_area: formData.total_area ? parseFloat(formData.total_area) : null,
        description: formData.description,
        project_status: formData.project_status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
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
      <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Editar Projeto</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Faça as alterações necessárias nos dados do projeto.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Nome do Projeto */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome do Projeto *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do projeto"
              className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Tipo e Status em linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status do Projeto
              </Label>
              <Select 
                value={formData.project_status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, project_status: value }))}
              >
                <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Área Total */}
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

          {/* Datas em linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Data de Início</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Data de Conclusão</span>
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição do Projeto
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva os detalhes do projeto..."
              rows={3}
              className="w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
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
