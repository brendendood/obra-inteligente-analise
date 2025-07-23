
import { UsersHeader } from './users/UsersHeader';
import { UsersFilters } from './users/UsersFilters';
import { UsersTable } from './users/UsersTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export const AdminUsersManagement = () => {
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
    refreshUsers
  } = useAdminUsers();

  const clearFilters = () => {
    setSearchTerm('');
    setFilterPlan('');
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
      <UsersHeader 
        totalUsers={users.length}
        users={users}
        onRefresh={refreshUsers}
        isRefreshing={loading}
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
      />

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum usuário encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};
