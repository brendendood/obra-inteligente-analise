import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface EditUserModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EditFormData {
  name: string;
  role_title: string;
  company: string;
  phone: string;
  city: string;
  state: string;
  plan_code: string;
  status: string;
}

export const EditUserModal = ({ user, isOpen, onClose, onSuccess }: EditUserModalProps) => {
  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    role_title: '',
    company: '',
    phone: '',
    city: '',
    state: '',
    plan_code: 'basic',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      console.log('🔧 EDIT USER MODAL: Carregando dados do usuário:', user);
      console.log('🔧 EDIT USER MODAL: Status original:', user.status);
      
      // Normalizar status para garantir compatibilidade
      let normalizedStatus = 'active';
      if (user.status) {
        const statusLower = user.status.toLowerCase();
        if (['active', 'ativo'].includes(statusLower)) {
          normalizedStatus = 'active';
        } else if (['blocked', 'bloqueado'].includes(statusLower)) {
          normalizedStatus = 'blocked';
        } else if (['pending', 'pendente'].includes(statusLower)) {
          normalizedStatus = 'pending';
        }
      }
      
      console.log('🔧 EDIT USER MODAL: Status normalizado:', normalizedStatus);
      
      setFormData({
        name: user.full_name || '',
        role_title: user.cargo || '',
        company: user.company || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        plan_code: user.plan || 'basic',
        status: normalizedStatus
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara (99) 99999-9999
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome completo é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!['basic', 'pro', 'enterprise'].includes(formData.plan_code)) {
      toast({
        title: "Erro de validação",
        description: "Plano inválido",
        variant: "destructive",
      });
      return false;
    }

    // Validação mais permissiva para status
    const validStatuses = ['active', 'blocked', 'pending', 'ativo', 'bloqueado', 'pendente'];
    if (!validStatuses.includes(formData.status.toLowerCase())) {
      console.error('🚫 EDIT USER MODAL: Status inválido detectado:', formData.status);
      toast({
        title: "Erro de validação",
        description: `Status inválido: "${formData.status}". Use: ativo, bloqueado ou pendente`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;

    setIsLoading(true);
    
    // Normalizar dados antes de enviar
    const normalizedData = {
      ...formData,
      status: formData.status.toLowerCase() === 'ativo' ? 'active' : 
              formData.status.toLowerCase() === 'bloqueado' ? 'blocked' :
              formData.status.toLowerCase() === 'pendente' ? 'pending' : 
              formData.status
    };
    
    console.log('💾 EDIT USER MODAL: Salvando alterações para:', user.user_id);
    console.log('💾 EDIT USER MODAL: Dados originais:', formData);
    console.log('💾 EDIT USER MODAL: Dados normalizados:', normalizedData);

    try {
      // Buscar admin atual
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Admin não autenticado');
      }

      // Chamar RPC function para atualizar usuário
      const { data: result, error } = await supabase.rpc('admin_update_user_profile', {
        target_user_id: user.user_id,
        admin_user_id: currentUser.id,
        user_data: normalizedData as any
      });

      if (error) {
        console.error('❌ EDIT USER MODAL: Erro na RPC:', error);
        throw error;
      }

      const typedResult = result as any;
      if (!typedResult?.success) {
        console.error('❌ EDIT USER MODAL: Falha na atualização:', typedResult);
        
        if (typedResult?.error === 'SUPREME_PROTECTION_TRIGGERED') {
          toast({
            title: "Proteção de usuário supremo",
            description: typedResult.message || "Usuário supremo não pode ter o plano reduzido",
            variant: "destructive",
          });
          return;
        }

        if (typedResult?.error === 'UNAUTHORIZED') {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para editar usuários",
            variant: "destructive",
          });
          return;
        }

        throw new Error(typedResult?.message || 'Falha na atualização');
      }

      console.log('✅ EDIT USER MODAL: Usuário atualizado com sucesso:', typedResult);

      toast({
        title: "Usuário atualizado",
        description: "As alterações foram salvas com sucesso",
      });

      // Fechar modal e recarregar lista
      onClose();
      onSuccess();

    } catch (error) {
      console.error('❌ EDIT USER MODAL: Erro ao salvar:', error);
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o usuário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('🚫 EDIT USER MODAL: Cancelando edição');
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome completo"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="role_title">Cargo</Label>
              <Input
                id="role_title"
                value={formData.role_title}
                onChange={(e) => handleInputChange('role_title', e.target.value)}
                placeholder="Ex: Engenheiro Civil"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Empresa e Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Nome da empresa"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Localização */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Digite a cidade"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Digite o estado"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Plano e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan_code">Plano</Label>
              <Select
                value={formData.plan_code}
                onValueChange={(value) => handleInputChange('plan_code', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações do usuário */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Informações do Sistema</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">ID:</span> {user.user_id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};