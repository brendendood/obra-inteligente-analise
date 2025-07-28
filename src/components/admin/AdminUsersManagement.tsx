
import React, { useState } from 'react';
import { UsersHeader } from './users/UsersHeader';
import { UsersFilters } from './users/UsersFilters';
import { UsersTable } from './users/UsersTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeLocation } from '@/hooks/useRealTimeLocation';
import { supabase } from '@/integrations/supabase/client';

export const AdminUsersManagement = () => {
  const [isUpdatingGeolocations, setIsUpdatingGeolocations] = useState(false);
  const { toast } = useToast();
  
  // Conectar ao sistema de localização em tempo real
  const { isConnected } = useRealTimeLocation((update) => {
    console.log('📍 Localização atualizada:', update);
    // Recarregar dados quando houver atualizações
    refreshUsers();
  });
  
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filterPlan,
    setFilterPlan,
    updateUserTags,
    updateUserProfile,
    updateUserPlan,
    deleteUser,
    refreshUsers,
    totalUsers,
    allUsers
  } = useAdminUsers();

  const clearFilters = () => {
    setSearchTerm('');
    setFilterPlan('');
  };

  // Função para atualizar todas as geolocalizações
  const updateAllGeolocations = async () => {
    setIsUpdatingGeolocations(true);
    
    try {
      console.log('🌍 ADMIN: Iniciando atualização de todas as geolocalizações...');
      
      // Buscar todos os logins sem localização
      const { data: loginsWithoutLocation, error: fetchError } = await supabase
        .from('user_login_history')
        .select('id, ip_address')
        .or('city.is.null,city.eq.Desconhecida,latitude.is.null')
        .not('ip_address', 'is', null)
        .neq('ip_address', '127.0.0.1')
        .neq('ip_address', '::1')
        .limit(50); // Processar até 50 por vez para não sobrecarregar

      if (fetchError) {
        throw fetchError;
      }

      if (!loginsWithoutLocation || loginsWithoutLocation.length === 0) {
        toast({
          title: "ℹ️ Nenhuma atualização necessária",
          description: "Todos os logins já possuem localização ou são IPs locais.",
        });
        return;
      }

      console.log(`📍 ADMIN: Encontrados ${loginsWithoutLocation.length} logins para atualizar`);

      // Processar em lotes para evitar sobrecarga
      let successCount = 0;
      let errorCount = 0;

      for (const login of loginsWithoutLocation) {
        try {
          const { error: geoError } = await supabase.functions
            .invoke('ip-geolocation', {
              body: {
                loginId: login.id,
                ipAddress: login.ip_address
              }
            });

          if (geoError) {
            console.error(`❌ ADMIN: Erro ao atualizar login ${login.id}:`, geoError);
            errorCount++;
          } else {
            console.log(`✅ ADMIN: Login ${login.id} atualizado com sucesso`);
            successCount++;
          }

          // Pequena pausa entre requisições para não sobrecarregar a API
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`❌ ADMIN: Erro geral para login ${login.id}:`, error);
          errorCount++;
        }
      }

      toast({
        title: "✅ Atualização de geolocalizações concluída",
        description: `${successCount} localizações atualizadas com sucesso. ${errorCount} erros.`,
      });

      console.log(`📊 ADMIN: Atualização concluída - ${successCount} sucessos, ${errorCount} erros`);
      
    } catch (error) {
      console.error('❌ ADMIN: Erro geral na atualização:', error);
      toast({
        title: "❌ Erro na atualização",
        description: "Não foi possível atualizar as geolocalizações. Verifique os logs.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingGeolocations(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Administre usuários e suas localizações</p>
        </div>
        <Button
          onClick={updateAllGeolocations}
          disabled={isUpdatingGeolocations}
          variant="outline"
          size="sm"
        >
          {isUpdatingGeolocations ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          {isUpdatingGeolocations ? 'Atualizando...' : 'Atualizar Localizações'}
        </Button>
      </div>
      
      <UsersHeader 
        totalUsers={totalUsers}
        filteredCount={users.length}
        users={allUsers as any} 
        onRefresh={refreshUsers}
        isRefreshing={loading}
        isRealtimeConnected={isConnected}
      />
      
      <UsersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPlan={filterPlan}
        setFilterPlan={setFilterPlan}
        onClearFilters={clearFilters}
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        onUpdateUser={updateUserProfile}
        onDeleteUser={deleteUser}
        onRefresh={refreshUsers}
      />

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum usuário encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};
